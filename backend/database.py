from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# load environment variables
load_dotenv()

# database connection string
DATABASE_URL = os.getenv("DATABASE_URL")

# create engine (connection to database)
engine = create_engine(DATABASE_URL)

# create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# base class for all models
Base = declarative_base()

# function to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()