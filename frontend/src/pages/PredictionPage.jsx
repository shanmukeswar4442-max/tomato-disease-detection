import { useState } from "react";
import api from "../utils/api";

function PredictionPage() {

  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setImage(URL.createObjectURL(selectedFile));
    setResult(null);
    setError(null);
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("/predict", formData);
      setResult(response.data);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.90) return "bg-green-500";
    if (confidence >= 0.70) return "bg-yellow-500";
    return "bg-orange-500";
  };

  const getSeverityColor = (severity) => {
    if (severity === "High") return "text-red-500";
    if (severity === "Medium") return "text-yellow-500";
    if (severity === "Low") return "text-green-500";
    return "text-gray-500";
  };

  const getSeverityBg = (severity) => {
    if (severity === "High") return "bg-red-50 border-red-200";
    if (severity === "Medium") return "bg-yellow-50 border-yellow-200";
    if (severity === "Low") return "bg-green-50 border-green-200";
    return "bg-gray-50 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-700">
          🍅 Check Your Tomato Plant
        </h1>
        <p className="text-gray-500 mt-2">
          Take a clear photo of the tomato leaf and upload it below
        </p>
      </div>

      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6">

        <div className="border-2 border-dashed border-green-300 rounded-xl p-6 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="fileInput"
          />
          <label htmlFor="fileInput" className="cursor-pointer">
            {image ? (
              <img
                src={image}
                alt="preview"
                className="mx-auto rounded-lg max-h-64 object-contain"
              />
            ) : (
              <div>
                <p className="text-5xl mb-3">📸</p>
                <p className="text-green-600 font-semibold">
                  Tap here to upload leaf photo
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Make sure leaf is clear and well lit
                </p>
              </div>
            )}
          </label>
        </div>

        {image && (
          <button
            onClick={handlePredict}
            disabled={loading}
            className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 text-lg"
          >
            {loading ? "🔍 Analyzing your plant..." : "Check My Plant 🌿"}
          </button>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 font-semibold">❌ Something went wrong</p>
            <p className="text-red-500 text-sm mt-1">
              Please check your internet and try again.
            </p>
          </div>
        )}

        {result?.status === "error" && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 font-semibold">
              ❌ This does not look like a tomato leaf
            </p>
            <p className="text-red-500 text-sm mt-1">
              Please upload a clear photo of a tomato leaf only.
            </p>
          </div>
        )}

        {result?.status === "warning" && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <h3 className="font-bold text-yellow-700 mb-2">
              📸 Photo not clear enough
            </h3>
            <p className="text-yellow-600 text-sm">
              Please try again with:
            </p>
            <ul className="list-disc list-inside text-yellow-600 text-sm mt-1">
              <li>Better lighting (natural daylight is best)</li>
              <li>Move closer to the leaf</li>
              <li>Make sure photo is not blurry</li>
              <li>Leaf should fill most of the photo</li>
            </ul>
          </div>
        )}

        {result?.status === "success" && (
          <div className="mt-6">

            <div className={`rounded-xl p-4 mb-4 border ${getSeverityBg(result.treatment?.severity)}`}>
              <h2 className="text-xl font-bold text-gray-800">
                🌿 {result.disease.replace(/_/g, " ")}
              </h2>

              <div className="mt-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>How sure are we?</span>
                  <span className="font-semibold">
                    {Math.round(result.confidence * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${getConfidenceColor(result.confidence)}`}
                    style={{ width: `${result.confidence * 100}%` }}
                  />
                </div>
              </div>

              <div className={`mt-3 inline-block px-3 py-1 rounded-full text-sm font-semibold ${getSeverityColor(result.treatment?.severity)}`}>
                {result.treatment?.severity === "High" && "🔴 Serious — Act immediately!"}
                {result.treatment?.severity === "Medium" && "🟡 Moderate — Treat soon"}
                {result.treatment?.severity === "Low" && "🟢 Mild — Monitor your plant"}
              </div>
            </div>

            <div className="bg-white border rounded-xl p-4 mb-4">
              <h3 className="font-bold text-gray-700 mb-2">
                📋 What is this?
              </h3>
              <p className="text-gray-600 text-sm">
                {result.treatment?.what_is_it}
              </p>
            </div>

            <div className="bg-white border rounded-xl p-4 mb-4">
              <h3 className="font-bold text-gray-700 mb-2">
                🔍 Signs to look for
              </h3>
              <ul className="list-disc list-inside text-gray-600 text-sm">
                {result.treatment?.symptoms?.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
              <h3 className="font-bold text-green-700 mb-2">
                💊 What to do
              </h3>
              <ol className="list-decimal list-inside text-gray-600 text-sm">
                {result.treatment?.treatment?.map((t, i) => (
                  <li key={i} className="mb-1">{t}</li>
                ))}
              </ol>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <h3 className="font-bold text-blue-700 mb-2">
                🛡️ How to prevent
              </h3>
              <ul className="list-disc list-inside text-gray-600 text-sm">
                {result.treatment?.prevention?.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                setImage(null);
                setFile(null);
                setResult(null);
              }}
              className="w-full mt-2 border border-green-600 text-green-600 py-3 rounded-xl font-semibold hover:bg-green-50"
            >
              Check Another Plant 🔄
            </button>

          </div>
        )}

      </div>
    </div>
  );
}

export default PredictionPage;
