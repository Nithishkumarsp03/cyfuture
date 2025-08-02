const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = new Map();

wss.on('connection', (ws) => {
  const id = Date.now().toString();
  clients.set(id, ws);
  console.log(`🔌 Client connected: ${id}`);

  // Send the new peer list to the connecting client
  ws.send(JSON.stringify({ type: 'id', id }));
  ws.send(JSON.stringify({ type: 'init', peers: Array.from(clients.keys()).filter(pid => pid !== id) }));

  // Notify all others about the new peer
  for (const [otherId, otherWs] of clients.entries()) {
    if (otherId !== id && otherWs.readyState === WebSocket.OPEN) {
      otherWs.send(JSON.stringify({ type: 'init', peers: [id] }));
    }
  }

  ws.on('message', (raw) => {
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return;
    }

    // Handle viewer re-announcing itself
    if (data.type === 'new-viewer') {
      console.log(`📺 New viewer announced: ${data.viewerId}`);
      // Tell all other peers to send offers to this viewer
      for (const [otherId, otherWs] of clients.entries()) {
        if (otherId !== data.viewerId && otherWs.readyState === WebSocket.OPEN) {
          otherWs.send(JSON.stringify({ type: 'init', peers: [data.viewerId] }));
        }
      }
      return; // stop here so we don't relay this to a specific target
    }

    // Relay signaling messages
    const target = clients.get(data.to);
    if (target && target.readyState === WebSocket.OPEN) {
      target.send(JSON.stringify({ ...data, from: id }));
    }
  });

  ws.on('close', () => {
    clients.delete(id);
    console.log(`❌ Client disconnected: ${id}`);
    for (const wsClient of clients.values()) {
      if (wsClient.readyState === WebSocket.OPEN) {
        wsClient.send(JSON.stringify({ type: 'peer-disconnected', id }));
      }
    }
  });
});

// Serve static pages
app.get('/stream', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'stream.html'));
});

app.get('/viewer', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'viewer.html'));
});

server.listen(3000, () => {
  console.log('🌐 Server running on http://localhost:3000');
});
