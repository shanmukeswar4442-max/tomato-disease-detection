import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO SECTION */}
      <div className="bg-green-700 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">
          🍅 Tomato Disease Detector
        </h1>
        <p className="text-xl mb-2 text-green-100">
          Protect your tomato crops with AI
        </p>
        <p className="text-green-200 mb-8">
          Upload a tomato leaf photo and get instant disease detection
          and treatment advice
        </p>
        <Link
          to="/predict"
          className="bg-white text-green-700 font-bold px-8 py-3 rounded-full hover:bg-green-50"
        >
          Start Detecting 🔍
        </Link>
      </div>

      {/* HOW IT WORKS */}
      <div className="py-16 px-4">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-10">
          How It Works
        </h2>
        <div className="max-w-3xl mx-auto grid grid-cols-1 gap-6 md:grid-cols-3">

          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-4xl mb-3">📸</p>
            <h3 className="font-bold text-gray-700 mb-2">
              Step 1
            </h3>
            <p className="text-gray-500">
              Upload a clear photo of your tomato leaf
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-4xl mb-3">🤖</p>
            <h3 className="font-bold text-gray-700 mb-2">
              Step 2
            </h3>
            <p className="text-gray-500">
              Our AI analyzes the leaf and detects disease
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-4xl mb-3">💊</p>
            <h3 className="font-bold text-gray-700 mb-2">
              Step 3
            </h3>
            <p className="text-gray-500">
              Get instant treatment and prevention advice
            </p>
          </div>

        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="bg-green-50 py-16 px-4">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-10">
          Why Use Our App?
        </h2>
        <div className="max-w-3xl mx-auto grid grid-cols-1 gap-6 md:grid-cols-3">

          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-4xl mb-3">⚡</p>
            <h3 className="font-bold text-gray-700 mb-2">
              Fast Detection
            </h3>
            <p className="text-gray-500">
              Get results in seconds with 97.8% accuracy
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-4xl mb-3">🌿</p>
            <h3 className="font-bold text-gray-700 mb-2">
              11 Diseases
            </h3>
            <p className="text-gray-500">
              Detects 11 different tomato diseases accurately
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-4xl mb-3">📊</p>
            <h3 className="font-bold text-gray-700 mb-2">
              Track History
            </h3>
            <p className="text-gray-500">
              Monitor your crop health over time
            </p>
          </div>

        </div>
      </div>

      {/* CTA SECTION */}
      <div className="py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Ready to protect your crops?
        </h2>
        <p className="text-gray-500 mb-8">
          Start detecting tomato diseases instantly for free
        </p>
        <Link
          to="/predict"
          className="bg-green-600 text-white font-bold px-8 py-3 rounded-full hover:bg-green-700"
        >
          Get Started Free 🚀
        </Link>
      </div>

      {/* FOOTER */}
      <div className="bg-green-700 text-green-200 py-6 text-center">
        <p>Tomato Disease Detector. Helping farmers grow better.</p>
      </div>

    </div>
  );
}

export default LandingPage;