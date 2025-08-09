// File: src/pages/Cameras.jsx

import React, { useState } from 'react';
import RoomLobby from '../../components/camera/RoomLobby';
import VideoRoom from '../../components/camera/VideoRoom';

const Cameras = () => {
  // In a real app, this would come from your auth context after login
  const [currentUser, setCurrentUser] = useState({
    id: 'b476d645-57e9-46fb-abdf-60578c5dd5aa', // Example user UUID from your DB
    name: 'Nithish Kumar'
  });

  const [roomState, setRoomState] = useState({
    inRoom: false,
    roomId: null,
    userRole: null,
  });

  const handleJoinSuccess = (roomId, role) => {
    setRoomState({ inRoom: true, roomId, userRole: role });
  };

  const handleLeaveRoom = () => {
    setRoomState({ inRoom: false, roomId: null, userRole: null });
  };

  if (!roomState.inRoom) {
    return <RoomLobby onJoinSuccess={handleJoinSuccess} />;
  }

  return (
    <VideoRoom
      roomId={roomState.roomId}
      userRole={roomState.userRole}
      currentUser={currentUser} // *** NEW: Pass the current user down ***
      onLeave={handleLeaveRoom}
    />
  );
};

export default Cameras;