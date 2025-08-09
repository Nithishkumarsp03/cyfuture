// File: src/pages/Cameras.jsx

import React, { useState } from 'react';
import RoomLobby from '../../components/camera/RoomLobby';
import VideoRoom from '../../components/camera/VideoRoom';

const Cameras = () => {
  // In a real app, this would come from your auth context after login
  const [currentUser, setCurrentUser] = useState({
    id: localStorage.getItem('id'), // Example user UUID from your DB
    name: localStorage.getItem('name')
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