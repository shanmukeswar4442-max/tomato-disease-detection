import { useState } from "react";
import axios from "axios";

function ImageUploader() {
  const [image, setImage] = useState(null);   // for preview URL
  const [file, setFile] = useState(null);     // for actual file
  const [result, setResult] = useState(null); // for storing prediction result

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);                        // store actual file
    setImage(URL.createObjectURL(selectedFile));  // store URL for preview
  };

  const handlePredict = async () => {
    const formData = new FormData();       // create empty envelope
    formData.append("file", file);         // put file inside envelope

    const response = await axios.post("http://localhost:8000/predict", formData);
    setResult(response.data);              // store the result from backend
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />

      {image && (
        <div>
          <h3>Preview:</h3>
          <img src={image} alt="preview" width="300" />
          <button onClick={handlePredict}>Predict Disease</button>
        </div>
      )}

      {result && (
        <div>
          <h3>Result:</h3>
          <p>Disease: {result.disease}</p>
          <p>Confidence: {result.confidence}</p>
          <p>Treatment: {result.treatment}</p>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;