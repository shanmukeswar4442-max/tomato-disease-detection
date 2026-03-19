import api from "../utils/api";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await api.get("/dashboard");
      setDashboard(response.data);
    } catch (err) {
      console.error("error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 0.90) return { label: "Very Accurate", color: "text-green-600 bg-green-50" };
    if (confidence >= 0.70) return { label: "Fairly Accurate", color: "text-yellow-600 bg-yellow-50" };
    return { label: "Moderate", color: "text-orange-600 bg-orange-50" };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">

      <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
        📊 Farm Dashboard
      </h1>

      {loading && (
        <div className="text-center">
          <p className="text-gray-500">Loading your farm data...</p>
        </div>
      )}

      {dashboard && (
        <div className="max-w-2xl mx-auto">

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow p-4 text-center border-t-4 border-green-500">
              <p className="text-gray-500 text-sm mb-1">
                Total Checks Done
              </p>
              <h2 className="text-4xl font-bold text-green-700">
                {dashboard.total_predictions}
              </h2>
              <p className="text-gray-400 text-xs mt-1">
                plants checked
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-4 text-center border-t-4 border-orange-400">
              <p className="text-gray-500 text-sm mb-1">
                Most Found Disease
              </p>
              <h2 className="text-lg font-bold text-orange-600">
                {dashboard.most_common_disease?.replace(/_/g, " ")}
              </h2>
              <p className="text-gray-400 text-xs mt-1">
                found {dashboard.most_common_count} times
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 mb-6">
            <h3 className="font-bold text-gray-700 mb-4 text-lg">
              🕐 Recent Plant Checks
            </h3>

            {dashboard.recent_predictions?.length === 0 && (
              <p className="text-gray-400 text-center py-4">
                No predictions yet!
              </p>
            )}

            {dashboard.recent_predictions?.map((p, index) => {
              const confidenceInfo = getConfidenceLabel(p.confidence);
              return (
                <div
                  key={p.id}
                  className={`flex justify-between items-center py-3 ${
                    index !== dashboard.recent_predictions.length - 1
                      ? "border-b"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 rounded-full p-2">
                      <span className="text-lg">🌿</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {p.disease?.replace(/_/g, " ")}
                      </p>
                      <p className="text-gray-400 text-xs">
                        🕐 {new Date(p.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${confidenceInfo.color}`}>
                    {confidenceInfo.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/predict"
              className="bg-green-600 text-white rounded-xl p-4 text-center font-semibold hover:bg-green-700"
            >
              🔍 Check New Plant
            </Link>
            <Link
              to="/history"
              className="bg-white border border-green-600 text-green-600 rounded-xl p-4 text-center font-semibold hover:bg-green-50"
            >
              📋 View All History
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}

export default DashboardPage;