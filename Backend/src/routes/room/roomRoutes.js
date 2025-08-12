const express = require('express');
const router = express.Router();
const roomController = require('../../controllers/room/roomController');
const fetchActiverooms = require('../../controllers/room/fetchActiveroom');


// POST /api/rooms - Create a new room
router.post('/create-room', roomController.createRoom);

// POST /api/rooms/:roomId/join - Join a room
router.post('/:roomId/join', roomController.joinRoom);

// GET /api/rooms/:roomId/participants - Get list of participants in a room
router.get('/:roomId/participants', roomController.getRoomParticipants);

// You can add more routes here like leaving a room, fetching public rooms, etc.
router.get('/active-rooms', fetchActiverooms.fechActiverooms);

module.exports = router;