// File: src/components/VideoRoom.jsx (With Race Condition Fix)

import React, { useEffect, useRef, useState, useCallback } from "react";
import io from "socket.io-client";

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL;
const PEER_CONNECTION_CONFIG = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const VideoTile = ({ peerId, stream }) => {
    // ... This component is correct, no changes needed ...
    const videoRef = useRef(null);
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.warn("Autoplay was prevented:", e));
        }
    }, [stream]);
    return (
        <div className="relative bg-black rounded-lg overflow-hidden shadow-lg aspect-video">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 p-2 bg-gradient-to-t from-black/60 to-transparent w-full">
                <p className="text-white text-sm font-semibold">{peerId}</p>
            </div>
        </div>
    );
};


const VideoRoom = ({ roomId, userRole, currentUser, onLeave }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});

  const socketRef = useRef(null);
  const peerConnections = useRef({});
  const localStreamRef = useRef(null);

  // --- WebRTC Helper Functions are correct, no changes needed ---
  const createPeerConnection = useCallback((partnerSocketId, isInitiator) => { /* ... */ }, []);
  const handleReceiveOffer = useCallback(async (from, offer) => { /* ... */ }, []);

  // --- Main useEffect for Setup and Teardown ---
  useEffect(() => {
    if (!currentUser || !currentUser.id) {
      console.error("VideoRoom Error: currentUser prop is missing or invalid.");
      onLeave();
      return;
    }

    // This function contains all our socket logic.
    const setupSocketListeners = () => {
      socketRef.current = io(SOCKET_SERVER_URL);
      const socket = socketRef.current;

      socket.on('connect', () => {
        console.log(`✅ Connected with role: ${userRole}. Socket ID: ${socket.id}`);
        const userInfo = { id: currentUser.id, name: currentUser.name, role: userRole };
        socket.emit('join-room', { roomId, userInfo });
      });

      // All other socket.on() listeners go here...
      socket.on('all-other-users', (otherUsers) => {
          if (userRole === 'streamer') {
              otherUsers.forEach(user => {
                  if (user.role === 'viewer') createPeerConnection(user.socketId, true);
              });
          }
      });
      socket.on('user-joined', ({ socketId, userInfo }) => {
          if (userRole === 'streamer' && userInfo.role === 'viewer') {
              createPeerConnection(socketId, true);
          }
      });
      socket.on('offer-made', ({ from, offer }) => {
          if (userRole === 'viewer') handleReceiveOffer(from, offer);
      });
      socket.on('answer-made', ({ from, answer }) => {
          peerConnections.current[from]?.setRemoteDescription(new RTCSessionDescription(answer));
      });
      socket.on('ice-candidate-received', ({ from, candidate }) => {
          peerConnections.current[from]?.addIceCandidate(new RTCIceCandidate(candidate)).catch(e => console.error(e));
      });
      socket.on('user-left', socketId => {
          if (peerConnections.current[socketId]) {
              peerConnections.current[socketId].close();
              delete peerConnections.current[socketId];
          }
          setRemoteStreams(prev => {
              const newStreams = { ...prev };
              delete newStreams[socketId];
              return newStreams;
          });
      });
    };

    // --- FIX: This is the new, corrected logic flow ---
    if (userRole === 'streamer') {
      // 1. Get camera first
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          setLocalStream(stream);
          localStreamRef.current = stream;
          // 2. ONLY THEN, connect to the socket server
          setupSocketListeners();
        })
        .catch(err => {
            console.error("Could not get media stream:", err);
            alert("Could not start camera. Please check permissions and try again.");
            onLeave();
        });
    } else { // For viewers
      // Viewers don't need a camera, so connect immediately.
      setupSocketListeners();
    }

    // --- Cleanup Phase ---
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      Object.values(peerConnections.current).forEach(pc => pc.close());
    };
  }, [roomId, userRole, currentUser, onLeave, createPeerConnection, handleReceiveOffer]);

  // --- Render logic remains the same ---
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Room: <span className="font-mono">{roomId}</span></h1>
            <p className="text-sm text-gray-400">Your Role: <span className="font-semibold">{userRole}</span></p>
          </div>
          <button onClick={onLeave} className="px-4 py-2 font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 transition-colors">
            Leave Room
          </button>
        </header>

        {userRole === 'streamer' && localStream && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Your Live Stream</h2>
            <div className="w-full md:w-1/2 lg:w-1/3">
              <VideoTile peerId="My Camera" stream={localStream} />
            </div>
          </div>
        )}

        {userRole === 'viewer' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Live Streams</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(remoteStreams).length > 0 ? (
                Object.entries(remoteStreams).map(([peerId, stream]) => (
                  <VideoTile key={peerId} peerId={`User ${peerId.substring(0, 6)}`} stream={stream} />
                ))
              ) : (
                <div className="col-span-full text-center py-10 bg-gray-800 rounded-lg">
                  <p className="text-gray-400">Waiting for streamers to join...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoRoom;