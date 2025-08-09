const { pool } = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const query = "SELECT id, email, name, password FROM users WHERE email = $1";
    const { rows } = await pool.query(query, [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        email: user.email,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const register = async (req, res) => {
  try {
    // 1. Input Validation
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // 2. Check if user already exists
    const userCheckQuery = "SELECT * FROM users WHERE email = $1";
    const existingUser = await pool.query(userCheckQuery, [email]);

    if (existingUser.rows.length > 0) {
      // 409 Conflict is a good status code for a duplicate resource
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    // 3. Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 4. Store the new user in the database
    // Using 'RETURNING *' is a PostgreSQL feature that returns the data that was just inserted.
    // This saves us from having to make a second query to get the new user's ID.
    const insertQuery = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email";
    const { rows } = await pool.query(insertQuery, [name, email, passwordHash]);
    const newUser = rows[0];
    
    // 5. Generate a JWT for the new user (auto-login)
    const payload = {
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send a 201 Created response, which is the standard for a successful resource creation.
    res.status(201).json({
      message: "User registered successfully",
      token, // Send the token for immediate login
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { login, register };