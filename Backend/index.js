// File: server.js

const app = require('./src/app');
const http = require('http');
const { Server } = require("socket.io");
const { pool } = require('./src/config/db'); // *** NEW: Import the database pool ***

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

const rooms = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join-room', ({ roomId, userInfo }) => {
    // *** CHANGED: Store essential info on the socket object ***
    socket.roomId = roomId;
    // We expect userInfo to contain the user's database ID, e.g., { id: '...', name: '...' }
    socket.userId = userInfo.id; 
    
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }
    
    // The rest of this listener is the same...
    socket.emit('all-other-users', rooms[roomId]);
    socket.join(roomId);
    rooms[roomId].push({ socketId: socket.id, ...userInfo });
    socket.to(roomId).emit('user-joined', { socketId: socket.id, userInfo });
    console.log(`User ${userInfo.name} (ID: ${userInfo.id}) joined room ${roomId}`);
  });
  
  // WebRTC signaling relays remain the same...
  socket.on('offer', (payload) => { /* ... no changes ... */ });
  socket.on('answer', (payload) => { /* ... no changes ... */ });
  socket.on('ice-candidate', (payload) => { /* ... no changes ... */ });

  socket.on('disconnect', async () => { // *** CHANGED: Made this function async ***
    console.log(`User ${socket.id} disconnected.`);
    
    const { userId, roomId } = socket; // Get the stored info

    // --- NEW: Database Cleanup Logic ---
    if (userId && roomId) {
      try {
        const query = 'DELETE FROM participants WHERE user_id = $1 AND room_id = $2';
        await pool.query(query, [userId, roomId]);
        console.log(`Removed participant with user_id ${userId} from room ${roomId} in DB.`);
      } catch (err) {
        console.error("Error removing participant from DB on disconnect:", err.message);
      }
    }
    // ------------------------------------

    // The existing cleanup logic is still needed for real-time updates
    if (roomId && rooms[roomId]) {
      const userIndex = rooms[roomId].findIndex(user => user.socketId === socket.id);
      if (userIndex !== -1) {
        rooms[roomId].splice(userIndex, 1);
        io.to(roomId).emit('user-left', socket.id);
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});