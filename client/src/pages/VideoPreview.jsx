import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DemoVideoPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShowPrompt(true);
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  return (
    <>
      {showPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full text-center relative">
            {/* Close Button */}
            <button
              onClick={() => setShowPrompt(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
            >
              {/* ✕ */}
            </button>

            <h2 className="text-2xl font-bold mb-3">👋 Welcome!</h2>
            <p className="mb-4 text-gray-700">
              See how our <strong>AI-powered Quality Assurance</strong> works in action.
              <p className="text-red-600">(This is only for evaluation purposes. kindly have a look at our project pragya to get more understanding.)</p>
            </p>

            {/* Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700"
                onClick={() => navigate("/showvideo")}
              >
                View
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
