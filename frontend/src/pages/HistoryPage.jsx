import { useState, useEffect } from "react";
import api from "../utils/api";
import Skeleton from "../components/Skeleton";

function HistoryPage() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPredictions = async () => {
    setLoading(true);
    try {
      const response = await api.get("/predictions");
      setPredictions(response.data);
    } catch (err) {
      console.error("Error fetching predictions: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 0.90) return { label: "Very Accurate", color: "text-green-600 bg-green-50" };
    if (confidence >= 0.70) return { label: "Fairly Accurate", color: "text-yellow-600 bg-yellow-50" };
    return { label: "Moderate", color: "text-orange-600 bg-orange-50" };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
        📋 Your Plant History
      </h1>

      {loading && <Skeleton />}

      {!loading && predictions.length === 0 && (
        <div className="text-center">
          <p className="text-5xl mb-4">🌱</p>
          <p className="text-gray-500">No predictions yet!</p>
          <p className="text-gray-400 text-sm">
            Upload a tomato leaf to get started
          </p>
        </div>
      )}

      <div className="max-w-xl mx-auto">
        {predictions.map((prediction) => {
          const confidenceInfo = getConfidenceLabel(prediction.confidence);
          return (
            <div
              key={prediction.id}
              className="bg-white rounded-xl shadow mb-4 border-l-4 border-green-500 overflow-hidden"
            >
              <img
                src={`http://localhost:8000/${prediction.image_path}`}
                alt={prediction.disease}
                className="w-full h-40 object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />

              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-bold text-gray-800">
                    🌿 {prediction.disease.replace(/_/g, " ")}
                  </h2>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${confidenceInfo.color}`}>
                    {confidenceInfo.label}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  🕐 {new Date(prediction.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HistoryPage;
