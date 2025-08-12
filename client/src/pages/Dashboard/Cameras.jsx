import React, { useState, useEffect } from 'react';
import RoomLobby from '../../components/camera/RoomLobby';
import VideoRoom from '../../components/camera/VideoRoom';

const Cameras = () => {
  const api = import.meta.env.VITE_API_URL;
  const [currentUser] = useState({
    id: localStorage.getItem('id'),
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
    // Call backend or socket to remove participant
    if (roomState.roomId) {
      fetch(`/api/room/${roomState.roomId}/leave`, {
        method: 'POST',
        body: JSON.stringify({ userId: currentUser.id }),
        headers: { 'Content-Type': 'application/json' }
      });
    }
    setRoomState({ inRoom: false, roomId: null, userRole: null });
  };

  useEffect(() => {
    const handleUnload = () => {
      if (roomState.inRoom) {
        handleLeaveRoom();
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [roomState.inRoom, roomState.roomId, currentUser.id]);

  if (!roomState.inRoom) {
    return <RoomLobby onJoinSuccess={handleJoinSuccess} />;
  }

  return (
    <VideoRoom
      roomId={roomState.roomId}
      userRole={roomState.userRole}
      currentUser={currentUser}
      onLeave={handleLeaveRoom}
    />
  );
};

export default Cameras;
