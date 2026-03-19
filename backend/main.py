from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from ultralytics import YOLO
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
import google.generativeai as genai
import shutil
import os
import json
import re
import uuid

from database import engine, get_db, Base
from models import Prediction, User, BlacklistedToken
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    oauth2_scheme
)

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

disease_model = YOLO("best.pt")
validator_model = YOLO("new_image_classifier1.pt")

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
gemini = genai.GenerativeModel("gemini-2.5-flash")


class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    full_name: str = None
    location: str = None


class LoginRequest(BaseModel):
    username: str
    password: str


def get_treatment(disease_name):
    prompt = f"""
    Tomato plant has {disease_name}.
    
    Respond in this exact JSON format only, no extra text, no markdown:
    {{
        "what_is_it": "one simple sentence explaining the disease",
        "symptoms": ["symptom 1", "symptom 2", "symptom 3"],
        "treatment": ["step 1", "step 2", "step 3"],
        "prevention": ["tip 1", "tip 2"],
        "severity": "High or Medium or Low"
    }}
    """
    try:
        response = gemini.generate_content(prompt)
        text = response.text
        text = re.sub(r'```json|```', '', text).strip()
        return json.loads(text)
    except Exception as e:
        return {
            "what_is_it": f"{disease_name} detected in tomato plant",
            "symptoms": ["Check leaves for visible symptoms"],
            "treatment": ["Consult local agricultural expert"],
            "prevention": ["Maintain good plant hygiene"],
            "severity": "Unknown"
        }


@app.post("/auth/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        User.username == request.username
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    existing_email = db.query(User).filter(
        User.email == request.email
    ).first()
    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed = hash_password(request.password)
    new_user = User(
        username=request.username,
        email=request.email,
        password=hashed,
        full_name=request.full_name,
        location=request.location
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Account created successfully!"}


@app.post("/auth/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        User.username == request.username
    ).first()
    if not user:
        raise HTTPException(
            status_code=400,
            detail="User not found"
        )

    if not verify_password(request.password, user.password):
        raise HTTPException(
            status_code=400,
            detail="Wrong password"
        )

    token = create_access_token({"user_id": user.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "username": user.username,
        "full_name": user.full_name,
        "location": user.location
    }


@app.get("/auth/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "location": current_user.location
    }


@app.post("/auth/logout")
def logout(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    blacklisted = BlacklistedToken(token=token)
    db.add(blacklisted)
    db.commit()
    return {"message": "Logged out successfully!"}


@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_folder = f"uploads/user_{current_user.id}"
    os.makedirs(user_folder, exist_ok=True)

    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = f"{user_folder}/{unique_filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    val_results = validator_model(file_path)
    val_class = val_results[0].names[val_results[0].probs.top1]
    val_confidence = float(val_results[0].probs.top1conf)

    print(f"Validator: {val_class} → {val_confidence}")

    if val_class != "tomato_leaf" or val_confidence < 0.70:
        return {
            "status": "error",
            "message": "Invalid image. Please upload a tomato leaf image only."
        }

    results = disease_model(file_path)
    predicted_class = results[0].names[results[0].probs.top1]
    confidence = float(results[0].probs.top1conf)

    if confidence < 0.60:
        return {
            "status": "warning",
            "disease": predicted_class,
            "confidence": round(confidence, 2),
            "message": "Image not clear enough for reliable detection.",
            "treatment": None
        }

    treatment = get_treatment(predicted_class)

    db_prediction = Prediction(
        image_name=unique_filename,
        image_path=file_path,
        disease=predicted_class,
        confidence=round(confidence, 2),
        severity=treatment.get("severity", "Unknown"),
        treatment=json.dumps(treatment),
        user_id=current_user.id
    )
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)

    return {
        "status": "success",
        "disease": predicted_class,
        "confidence": round(confidence, 2),
        "treatment": treatment,
        "prediction_id": db_prediction.id
    }


@app.get("/predictions")
def get_predictions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    predictions = db.query(Prediction)\
        .filter(Prediction.user_id == current_user.id)\
        .order_by(Prediction.timestamp.desc())\
        .all()

    result = []
    for p in predictions:
        result.append({
            "id": p.id,
            "image_name": p.image_name,
            "image_path": p.image_path,
            "disease": p.disease,
            "confidence": p.confidence,
            "severity": p.severity,
            "treatment": json.loads(p.treatment) if p.treatment else None,
            "timestamp": p.timestamp
        })
    return result


@app.get("/predictions/{prediction_id}")
def get_prediction(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    prediction = db.query(Prediction)\
        .filter(
            Prediction.id == prediction_id,
            Prediction.user_id == current_user.id
        ).first()

    if not prediction:
        return {"error": "Prediction not found"}

    return {
        "id": prediction.id,
        "image_name": prediction.image_name,
        "image_path": prediction.image_path,
        "disease": prediction.disease,
        "confidence": prediction.confidence,
        "severity": prediction.severity,
        "treatment": json.loads(prediction.treatment) if prediction.treatment else None,
        "timestamp": prediction.timestamp
    }


@app.get("/dashboard")
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total = db.query(Prediction)\
        .filter(Prediction.user_id == current_user.id)\
        .count()

    most_common = db.query(
        Prediction.disease,
        func.count(Prediction.disease).label("count")
    ).filter(Prediction.user_id == current_user.id)\
     .group_by(Prediction.disease)\
     .order_by(func.count(Prediction.disease).desc())\
     .first()

    recent = db.query(Prediction)\
        .filter(Prediction.user_id == current_user.id)\
        .order_by(Prediction.timestamp.desc())\
        .limit(5)\
        .all()

    recent_list = []
    for p in recent:
        recent_list.append({
            "id": p.id,
            "disease": p.disease,
            "confidence": p.confidence,
            "severity": p.severity,
            "timestamp": p.timestamp
        })

    return {
        "total_predictions": total,
        "most_common_disease": most_common[0] if most_common else None,
        "most_common_count": most_common[1] if most_common else 0,
        "recent_predictions": recent_list
    }