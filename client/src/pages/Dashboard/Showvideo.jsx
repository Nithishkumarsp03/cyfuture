import React, { useState } from "react";
import Video1 from "../../assets/videos/Video1.mp4";
import Video2 from "../../assets/videos/Video2.mp4";
import Video3 from "../../assets/videos/Video3.mp4";
import { useNavigate } from "react-router-dom";

export default function Showvideo() {
  const videos = [Video1, Video2, Video3];
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const handleRestart = () => {
    const video = document.getElementById("demo-video");
    if (video) {
      video.currentTime = 0;
      video.play();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 py-12">
      {/* Friendly Heading */}
      <h1 className="text-4xl font-bold text-gray-900 mb-3 text-center">
        Welcome to Our Product Demo 🎥
      </h1>
      <p className="text-gray-700 mb-8 text-center max-w-xl">
        Watch how our AI-powered Quality Assurance solution works in real-time.  
        Use the buttons below to navigate through the demo videos.
      </p>

      {/* Video Card */}
      <div className="bg-white flex flex-col md:flex-row gap-8 rounded-3xl shadow-2xl p-6 max-w-7xl w-full">
        {/* Video Player */}
        <video
          id="demo-video"
          key={videos[currentIndex]}
          src={videos[currentIndex]}
          controls
          autoPlay
          className="w-full md:w-[55%] rounded-2xl"
        />

        {/* Controls */}
        <div className="flex flex-col justify-between w-full md:w-[40%]">
          {/* Progress Info */}
          <div className="text-center mb-6">
            <span className="text-lg font-medium text-gray-800">
              Video {currentIndex + 1} of {videos.length}
            </span>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentIndex + 1) / videos.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handlePrev}
              className="px-6 py-3 bg-gray-200 rounded-xl text-gray-800 font-semibold shadow hover:bg-gray-300 transition"
            >
              ⬅ Previous
            </button>
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-yellow-400 rounded-xl text-white font-semibold shadow hover:bg-yellow-500 transition"
            >
              🔄 Restart
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700 transition"
            >
              Next ➡
            </button>
          </div>

          {/* Back to Dashboard */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-800 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
