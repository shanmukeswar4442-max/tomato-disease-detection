import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:8000/auth/login",
        { username, password }
      );

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("full_name", response.data.full_name);

      navigate("/");

    } catch (err) {
      setError(
        err.response?.data?.detail || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        <div className="text-center mb-8">
          <p className="text-5xl mb-3">🍅</p>
          <h1 className="text-2xl font-bold text-green-700">
            Welcome Back!
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Login to check your tomato plants
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
            <p className="text-red-600 text-sm">❌ {error}</p>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login 🌿"}
        </button>

        <p className="text-center text-gray-500 text-sm mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-600 font-semibold">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
}

export default LoginPage;