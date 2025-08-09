// File: server.js

const app = require('./src/app');
const http = require('http');
const { Server } = require("socket.io");
const { pool } = require('./src/config/db');

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// In-memory store for active users in rooms
const rooms = {};

// This is the main "waiting area" for new connections.
// This function runs once for every new browser tab that connects.
io.on('connection', (socket) => {
  console.log('✅ A user connected:', socket.id);

  // This function WAITS until a client sends the 'join-room' event.
  socket.on('join-room', ({ roomId, userInfo }) => {
    if (!userInfo || !userInfo.id) {
      console.error("Server Error: 'join-room' event received without userInfo.id");
      return;
    }
    
    console.log(`<--- [SERVER] Received 'join-room' for room ${roomId} from user:`, userInfo);
    
    socket.roomId = roomId;
    socket.userId = userInfo.id; 
    
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }
    
    socket.emit('all-other-users', rooms[roomId]);
    socket.join(roomId);
    rooms[roomId].push({ socketId: socket.id, ...userInfo });
    socket.to(roomId).emit('user-joined', { socketId: socket.id, userInfo });
  });
  
  // These functions WAIT until a client sends a matching WebRTC signal.
  socket.on('offer', (payload) => {
    io.to(payload.to).emit('offer-made', { from: socket.id, offer: payload.offer });
  });

  socket.on('answer', (payload) => {
    io.to(payload.to).emit('answer-made', { from: socket.id, answer: payload.answer });
  });
  
  socket.on('ice-candidate', (payload) => {
    io.to(payload.to).emit('ice-candidate-received', { from: socket.id, candidate: payload.candidate });
  });

  // This function WAITS until the client's connection is lost for any reason.
  socket.on('disconnect', async () => {
    console.log('❌ User disconnected:', socket.id);
    const { userId, roomId } = socket;

    if (userId && roomId) {
      try {
        await pool.query('DELETE FROM participants WHERE user_id = $1 AND room_id = $2', [userId, roomId]);
        console.log(`🧹 Removed participant ${userId} from room ${roomId} in DB.`);
      } catch (err) {
        console.error("Error removing participant from DB on disconnect:", err.message);
      }
    }
    
    if (roomId && rooms[roomId]) {
      const originalLength = rooms[roomId].length;
      rooms[roomId] = rooms[roomId].filter(user => user.socketId !== socket.id);
      if (rooms[roomId].length < originalLength) {
        io.to(roomId).emit('user-left', socket.id);
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});