import React, { useState } from "react";
import { joinRoomAPI } from "../../services/api"; // The API service we created
import { useToast } from "../Toast/ToastContext"; // Your toast notification hook
import { ClipLoader } from "react-spinners";
import NextUIButton from "../button/button";

const JoinRoomModal = ({ onClose, onSuccess }) => {
  // --- Component State ---
  const [roomId, setRoomId] = useState("");
  const [pin, setPin] = useState("");
  const [role, setRole] = useState("viewer"); // Default role is viewer
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  // --- Event Handlers ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomId) {
      setError("Please enter a Room ID.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const joinData = {
        role,
        pin: pin || null, // Send pin if provided
      };

      const response = await joinRoomAPI(roomId, joinData);

      addToast(
        response.message || `Successfully joined room as a ${role}!`,
        "success"
      );
      onSuccess(roomId, role); // Pass the room ID and selected role to the parent
      onClose(); // Close the modal on success
    } catch (err) {
      const errorMessage =
        err.message || "Failed to join the room. Please check the details.";
      setError(errorMessage);
      addToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Backdrop
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
    >
      {/* Modal Content */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl transform transition-all duration-300"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Join an Existing Room
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Room ID Input */}
          <div>
            <label
              htmlFor="roomId"
              className="block text-sm font-medium text-gray-700"
            >
              Room ID
            </label>
            <input
              id="roomId"
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter the Room ID"
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* PIN Input */}
          <div>
            <label
              htmlFor="pin"
              className="block text-sm font-medium text-gray-700"
            >
              Room PIN (if required)
            </label>
            <input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="****"
              maxLength="4"
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Join as
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-50 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="viewer">Viewer</option>
              <option value="streamer">Streamer</option>
            </select>
          </div>

          {/* Error Message Display */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none"
            >
              Cancel
            </button>
            <NextUIButton
              type="submit"
              disabled={isLoading}
              className={`w-auto inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed`}
            >
              {isLoading ? "Joining..." : "Join Room"}
              <ClipLoader color="white" loading={isLoading} size={24} />
            </NextUIButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinRoomModal;
