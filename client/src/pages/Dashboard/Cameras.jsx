import React, { useEffect, useRef, useState, useCallback } from "react";
import { useToast } from "../../components/Toast/ToastContext";

const SIGNALING_URL = "ws://localhost:3000"; // backend websocket

// Keep these outside the component so they persist between mounts
let globalSocket = null;
const connectedPeers = new Set();

const VideoTile = ({ peerId, stream, onClick }) => {
  const videoRef = useRef();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((e) => console.warn("Playback issue:", e));
    }
  }, [stream]);

  return (
    <div
      className="relative rounded-xl overflow-hidden shadow-lg bg-gray-900 border border-gray-700 hover:scale-[1.02] hover:shadow-2xl transition-all duration-200 cursor-pointer"
      onClick={() => onClick(peerId, stream)}
    >
      <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-blue-600 to-indigo-500 px-3 py-1 flex justify-between items-center text-xs text-white font-semibold">
        <span>Camera: {peerId}</span>
        <span className="text-[10px] bg-black/30 px-2 py-[1px] rounded">LIVE</span>
      </div>
      <video ref={videoRef} muted playsInline autoPlay className="w-full h-full object-cover" />
    </div>
  );
};

const Cameras = () => {
  const { addToast } = useToast();
  const [clientId, setClientId] = useState(null);
  const [peerStreams, setPeerStreams] = useState({});
  const peerConnections = useRef({});
  const disconnectedPeers = useRef(new Set());
  const [selectedCamera, setSelectedCamera] = useState(null);

  const addStream = useCallback(
    (peerId, stream) => {
      setPeerStreams((prev) => {
        if (prev[peerId] === stream) return prev;

        if (!connectedPeers.has(peerId)) {
          addToast(`Peer ${peerId} connected`, "connected");
          connectedPeers.add(peerId);
        }
        disconnectedPeers.current.delete(peerId);

        return { ...prev, [peerId]: stream };
      });
    },
    [addToast]
  );

  const removeStream = useCallback(
    (peerId) => {
      setPeerStreams((prev) => {
        if (!prev[peerId] || disconnectedPeers.current.has(peerId)) return prev;

        disconnectedPeers.current.add(peerId);
        connectedPeers.delete(peerId);
        addToast(`Peer ${peerId} disconnected`, "disconnected");

        const updated = { ...prev };
        delete updated[peerId];
        return updated;
      });
    },
    [addToast]
  );

  useEffect(() => {
  if (!globalSocket) {
    globalSocket = new WebSocket(SIGNALING_URL);
    console.log("✅ WebSocket created");
  }

  const socket = globalSocket;

  socket.onopen = () => {
    console.log("✅ WebSocket connected (viewer)");
    // If we already have a clientId from a previous session, announce ourselves again
    if (clientId) {
      socket.send(JSON.stringify({ type: "new-viewer", viewerId: clientId }));
    }
  };

  // If we already know our clientId when mounting (coming back to tab), re-announce
  if (clientId) {
    socket.send(JSON.stringify({ type: "new-viewer", viewerId: clientId }));
  }

  socket.onmessage = async (evt) => {
    let msg;
    try {
      msg = JSON.parse(evt.data);
    } catch {
      return;
    }

    switch (msg.type) {
      case "id":
        setClientId(msg.id);
        socket.send(JSON.stringify({ type: "new-viewer", viewerId: msg.id }));
        break;

      case "offer":
        let pc = peerConnections.current[msg.from];
        if (!pc) {
          pc = createPeerConnection(msg.from);
        }
        await pc.setRemoteDescription(new RTCSessionDescription(msg.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.send(
          JSON.stringify({
            type: "answer",
            answer,
            to: msg.from,
            from: clientId,
          })
        );
        break;

      case "ice":
        if (peerConnections.current[msg.from]) {
          try {
            await peerConnections.current[msg.from].addIceCandidate(
              new RTCIceCandidate(msg.ice)
            );
          } catch {}
        }
        break;

      default:
        break;
    }
  };

  function createPeerConnection(peerId) {
    if (peerConnections.current[peerId]) return peerConnections.current[peerId];

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    peerConnections.current[peerId] = pc;

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.send(
          JSON.stringify({
            type: "ice",
            ice: e.candidate,
            to: peerId,
            from: clientId,
          })
        );
      }
    };

    pc.ontrack = (event) => {
      if (event.track.kind === "video" && event.streams && event.streams[0]) {
        addStream(peerId, event.streams[0]);
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
        removeStream(peerId);
      }
    };

    return pc;
  }

  return () => {
    // Keep WebSocket alive — do not close
  };
}, [clientId, addStream, removeStream]);


  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 relative">
      <h1 className="text-2xl font-bold mb-4">📡 Live Camera Feeds</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(peerStreams).map(([peerId, stream]) => (
          <VideoTile
            key={peerId}
            peerId={peerId}
            stream={stream}
            onClick={(id, str) => setSelectedCamera({ peerId: id, stream: str })}
          />
        ))}
        {Object.keys(peerStreams).length === 0 && (
          <div className="col-span-full p-8 bg-white rounded-xl shadow text-center text-gray-600 border border-gray-200">
            No camera streams detected yet. Waiting for peers...
          </div>
        )}
      </div>

      {selectedCamera && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-40 flex items-center justify-center p-4"
          onClick={() => setSelectedCamera(null)}
        >
          <div className="relative w-full max-w-5xl">
            <video
              autoPlay
              playsInline
              muted
              ref={(el) => {
                if (el && selectedCamera.stream) el.srcObject = selectedCamera.stream;
              }}
              className="w-full h-full object-contain rounded-lg shadow-2xl"
            />
            <button
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow"
              onClick={() => setSelectedCamera(null)}
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cameras;
