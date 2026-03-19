import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    setError(null);

    if (!username || !email || !password) {
      setError("Username, email and password are required!");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/auth/register",
        {
          username,
          email,
          password,
          full_name: fullName,
          location
        }
      );

      navigate("/login");

    } catch (err) {
      setError(
        err.response?.data?.detail || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        <div className="text-center mb-8">
          <p className="text-5xl mb-3">🌱</p>
          <h1 className="text-2xl font-bold text-green-700">
            Create Account
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Join us to protect your tomato crops
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
            <p className="text-red-600 text-sm">❌ {error}</p>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
          />

        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name (optional)"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-1">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your village/district (optional)"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create Account 🌱"}
        </button>

        <p className="text-center text-gray-500 text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 font-semibold">
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
}

export default RegisterPage;