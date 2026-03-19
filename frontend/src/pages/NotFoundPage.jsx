import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <p className="text-8xl mb-4">🍅</p>
      <h1 className="text-4xl font-bold text-gray-700 mb-2">
        Page Not Found
      </h1>
      <p className="text-gray-500 mb-8">
        Oops! This page doesn't exist.
      </p>
      <Link
        to="/"
        className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700"
      >
        Go Back Home 🏠
      </Link>
    </div>
  );
}

export default NotFoundPage;