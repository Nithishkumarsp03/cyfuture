const jwt = require('jsonwebtoken');
const { pool } = require("../config/db");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const apiKey = req.headers['x-api-key'];

    // --- Priority 1: Check for JWT (User Authentication) ---
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = decoded.user; // Attach user payload
          return next(); // Successfully authenticated as a user, stop processing.
        } catch (err) {
          // If the token is present but invalid (expired, etc.)
          return res.status(403).json({ message: 'Forbidden: Invalid or expired token.' });
        }
      }
    }

    // --- Priority 2: Check for API Key (Application Authorization) ---
    if (apiKey) {
      const query = "SELECT app_name FROM api_keys WHERE api_key = $1 AND is_active = TRUE";
      const { rows } = await pool.query(query, [apiKey]);

      if (rows.length > 0) {
        req.clientApp = { name: rows[0].app_name }; // Attach client app payload
        return next(); // Successfully authorized as an application, stop processing.
      } else {
        return res.status(403).json({ message: 'Forbidden: Invalid API Key.' });
      }
    }

    // --- If no credentials are provided ---
    return res.status(401).json({ message: 'Unauthorized: No credentials provided.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {authMiddleware};