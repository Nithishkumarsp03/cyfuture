const { pool } = require("../../config/db");

const fechActiverooms = async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT
    r.id,
    r.name AS room_name,
    u.name AS user_name,
    r.is_private,
    r.created_at
FROM rooms r
INNER JOIN users u ON u.id = r.owner_id


    `;

    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No active rooms found" });
    }

    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { fechActiverooms };
