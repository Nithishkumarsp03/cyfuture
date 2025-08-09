// File: src/components/RoomLobby.jsx

import React, { useState } from 'react';
import CreateRoomModal from './CreateRoomModal';
import JoinRoomModal from './JoinRoomModal'; // Import the new modal

const RoomLobby = ({ onJoinSuccess }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false); // State to control the join modal

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Live Video Rooms</h1>
        <p className="text-lg text-gray-600 mb-8">Create a room or join an existing one.</p>
        <div className="space-x-4">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none"
          >
            Create Room
          </button>
          <button 
            onClick={() => setShowJoinModal(true)} // This button now opens the join modal
            className="px-6 py-3 font-semibold text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200 focus:outline-none"
          >
            Join Room
          </button>
        </div>
      </div>

      {/* Conditionally render the create modal */}
      {showCreateModal && (
        <CreateRoomModal 
          onClose={() => setShowCreateModal(false)} 
          onSuccess={onJoinSuccess} 
        />
      )}

      {/* Conditionally render the join modal */}
      {showJoinModal && (
        <JoinRoomModal 
          onClose={() => setShowJoinModal(false)}
          onSuccess={onJoinSuccess} 
        />
      )}
    </div>
  );
};

export default RoomLobby;