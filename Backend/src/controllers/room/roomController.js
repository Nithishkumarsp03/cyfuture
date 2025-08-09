const { pool } = require("../../config/db");
// *** FIX 1: You must import a UUID generator ***
const { v4: uuidv4 } = require('uuid'); 

const roomController = {
  createRoom: async (req, res) => {
    console.log(req.body);
    try {
      if (!req.user) {
        return res.status(403).json({ message: 'Forbidden: This action requires a logged-in user.' });
      }

      const { name, is_private, pin } = req.body;
      const owner_id = req.user.id;

      if (!name) return res.status(400).json({ message: "Room name is required" });
      if (typeof is_private !== 'boolean') return res.status(400).json({ message: "is_private must be a boolean." });
      if (is_private && !pin) return res.status(400).json({ message: "A private room requires a PIN." });

      const newRoomId = uuidv4();
      const roomQuery = `
        INSERT INTO rooms (id, name, owner_id, is_private, pin) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING id, name, is_private, created_at
      `;
      const { rows: roomRows } = await pool.query(roomQuery, [newRoomId, name, owner_id, is_private, pin || null]);
      const newRoom = roomRows[0];

      // *** NEW: Automatically add the creator as the first participant (viewer) ***
      const firstParticipantId = uuidv4();
      const participantQuery = `
        INSERT INTO participants (id, user_id, room_id, role)
        VALUES ($1, $2, $3, $4)
      `;
      await pool.query(participantQuery, [firstParticipantId, owner_id, newRoom.id, 'viewer']);

      res.status(201).json({ message: "Room created successfully and you have been added as a viewer.", room: newRoom });

    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  joinRoom: async (req, res) => {
    try {
      // *** FIX 4: Add this critical check here too! ***
      if (!req.user) {
        return res.status(403).json({ message: 'Forbidden: Only users can join rooms.' });
      }
      
      const { roomId } = req.params;
      const { role, pin } = req.body;
      const user_id = req.user.id; // This is now safe

      // ... (rest of the logic is mostly fine)
      if (!role || !['streamer', 'viewer'].includes(role)) {
        return res.status(400).json({ message: "Invalid or missing role. Must be 'streamer' or 'viewer'." });
      }

      const roomQuery = "SELECT * FROM rooms WHERE id = $1";
      const roomResult = await pool.query(roomQuery, [roomId]);
      if (roomResult.rows.length === 0) {
        return res.status(404).json({ message: "Room not found." });
      }
      const room = roomResult.rows[0];

      if (room.is_private && room.pin !== pin) {
        return res.status(403).json({ message: "Invalid PIN for private room." });
      }
      
      const participantCheckQuery = "SELECT * FROM participants WHERE user_id = $1 AND room_id = $2";
      const participantCheck = await pool.query(participantCheckQuery, [user_id, roomId]);
      if (participantCheck.rows.length > 0) {
        return res.status(409).json({ message: "You are already in this room." });
      }

      // *** FIX 5: Generate and use a UUID for the new participant's ID ***
      const newParticipantId = uuidv4();
      const insertQuery = `
        INSERT INTO participants (id, user_id, room_id, role) 
        VALUES ($1, $2, $3, $4) RETURNING id, role
      `;
      const { rows } = await pool.query(insertQuery, [newParticipantId, user_id, roomId, role]);
      
      res.status(200).json({ message: `Successfully joined room as a ${role}.`, participation: rows[0] });

    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getRoomParticipants: async (req, res) => {
    try {
      // This endpoint is safe because it doesn't rely on req.user or req.clientApp
      // But we can add logging to see who is making the request
      if (req.user) {
        console.log(`Participant list requested by USER: ${req.user.email}`);
      } else if (req.clientApp) {
        console.log(`Participant list requested by APPLICATION: ${req.clientApp.name}`);
      }

      const { roomId } = req.params;
      const query = `
        SELECT p.id, p.role, u.id as user_id, u.name, u.email 
        FROM participants p
        JOIN users u ON p.user_id = u.id
        WHERE p.room_id = $1
      `;
      const { rows } = await pool.query(query, [roomId]);
      res.status(200).json(rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = roomController;