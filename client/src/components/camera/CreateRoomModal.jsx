import React, { useState } from 'react';
import { createRoomAPI } from '../../services/api'; // The API service we created
import { useToast } from '../Toast/ToastContext'; // Your toast notification hook

const CreateRoomModal = ({ onClose, onSuccess }) => {
  // --- Component State ---
  const [name, setName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  // --- Event Handlers ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (isPrivate && pin.length < 4) {
      setError("A private room requires a PIN of at least 4 digits.");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const roomData = {
        name,
        is_private: isPrivate,
        pin: isPrivate ? pin : null,
      };
      
      const response = await createRoomAPI(roomData);
      
      addToast(response.message || "Room created successfully!", "success");
      onSuccess(response.room.id, 'viewer'); // Pass the new room ID and default role to the parent
      onClose(); // Close the modal on success

    } catch (err) {
      const errorMessage = err.message || "An unknown error occurred.";
      setError(errorMessage);
      addToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Backdrop: Covers the screen and closes the modal when clicked
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
    >
      {/* Modal Content: Stop propagation to prevent closing when clicking inside */}
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
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Create a New Room</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Room Name Input */}
          <div>
            <label htmlFor="roomName" className="block text-sm font-medium text-gray-700">Room Name</label>
            <input
              id="roomName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Weekly Team Sync"
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Private Room Checkbox */}
          <div className="flex items-center">
            <input
              id="isPrivate"
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-900">
              Make this a private room (requires PIN)
            </label>
          </div>
          
          {/* Conditional PIN Input */}
          {isPrivate && (
            <div className="transition-all duration-300">
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700">4-Digit PIN</label>
              <input
                id="pin"
                type="password" // Use password type to obscure PIN
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="****"
                maxLength="4"
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}

          {/* Error Message Display */}
          {error && (
             <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>
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
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;