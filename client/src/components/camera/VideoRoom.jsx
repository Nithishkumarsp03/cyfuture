import React, { useEffect, useRef, useState, useCallback } from "react";
import io from "socket.io-client";

// --- Configuration ---
const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL;
const PEER_CONNECTION_CONFIG = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

// --- Re-usable Video Tile Component ---
const VideoTile = ({ peerId, stream }) => {
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


// --- Main Video Room Component ---
const VideoRoom = ({ roomId, userRole, currentUser, onLeave }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});

  const socketRef = useRef(null);
  const peerConnections = useRef({});
  const localStreamRef = useRef(null);

  const createPeerConnection = useCallback((partnerSocketId, isInitiator) => {
    if (peerConnections.current[partnerSocketId]) return;
    const pc = new RTCPeerConnection(PEER_CONNECTION_CONFIG);
    peerConnections.current[partnerSocketId] = pc;

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => pc.addTrack(track, localStreamRef.current));
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) socketRef.current?.emit('ice-candidate', { to: partnerSocketId, candidate: event.candidate });
    };

    pc.ontrack = (event) => {
      console.log(`[VIEWER] ✅ SUCCESS: Received video track from ${partnerSocketId}!`);
      setRemoteStreams(prev => ({ ...prev, [partnerSocketId]: event.streams[0] }));
    };

    if (isInitiator) {
      pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .then(() => {
          console.log(`[STREAMER] Sent offer to ${partnerSocketId}`);
          socketRef.current?.emit('offer', { to: partnerSocketId, offer: pc.localDescription });
        });
    }
  }, []);

  const handleReceiveOffer = useCallback(async (from, offer) => {
    const pc = new RTCPeerConnection(PEER_CONNECTION_CONFIG);
    peerConnections.current[from] = pc;
    pc.ontrack = (event) => {
      console.log(`[VIEWER] ✅ SUCCESS: Received video track from ${from}!`);
      setRemoteStreams(prev => ({ ...prev, [from]: event.streams[0] }));
    };
    pc.onicecandidate = event => {
      if (event.candidate) socketRef.current?.emit('ice-candidate', { to: from, candidate: event.candidate });
    };

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    console.log(`[VIEWER] Sent answer back to ${from}`);
    socketRef.current?.emit('answer', { to: from, answer: pc.localDescription });
  }, []);


  useEffect(() => {
    // This function contains all our socket logic.
    const setupSocketListeners = () => {
      socketRef.current = io(SOCKET_SERVER_URL);
      const socket = socketRef.current;
      socket.on('connect', () => {
        console.log(`✅ Connected with role: ${userRole}. Socket ID: ${socket.id}`);
        const userInfo = { id: currentUser.id, name: currentUser.name, role: userRole };
        socket.emit('join-room', { roomId, userInfo });
      });
      socket.on('all-other-users', (otherUsers) => {
        if (userRole === 'streamer') {
          otherUsers.forEach(user => {
            if (user.role === 'viewer') createPeerConnection(user.socketId, true);
          });
        }
      });
      socket.on('user-joined', ({ socketId, userInfo }) => {
        console.log(`[INFO] User ${userInfo.name} joined as a ${userInfo.role}`);
        if (userRole === 'streamer' && userInfo.role === 'viewer') {
          createPeerConnection(socketId, true);
        }
      });
      socket.on('offer-made', ({ from, offer }) => {
        if (userRole === 'viewer') handleReceiveOffer(from, offer);
      });
      socket.on('answer-made', ({ from, answer }) => {
        console.log(`[STREAMER] Received answer from ${from}. Connection should establish.`);
        peerConnections.current[from]?.setRemoteDescription(new RTCSessionDescription(answer));
      });
      socket.on('ice-candidate-received', ({ from, candidate }) => {
        peerConnections.current[from]?.addIceCandidate(new RTCIceCandidate(candidate)).catch(e => console.error(e));
      });
      socket.on('user-left', socketId => {
        if (peerConnections.current[socketId]) peerConnections.current[socketId].close();
        delete peerConnections.current[socketId];
        setRemoteStreams(prev => {
          const newStreams = { ...prev };
          delete newStreams[socketId];
          return newStreams;
        });
      });
    };

    // This is the corrected logic flow to prevent race conditions.
    if (userRole === 'streamer') {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          setLocalStream(stream);
          localStreamRef.current = stream;
          setupSocketListeners(); // Connect only AFTER camera is ready
        })
        .catch(err => {
            console.error("Could not get media stream:", err);
            alert("Could not start camera. Please check permissions and try again.");
            onLeave();
        });
    } else { // For viewers
      setupSocketListeners(); // Connect immediately
    }

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (localStreamRef.current) localStreamRef.current.getTracks().forEach(track => track.stop());
      Object.values(peerConnections.current).forEach(pc => pc.close());
    };
  }, [roomId, userRole, currentUser, onLeave, createPeerConnection, handleReceiveOffer]);

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