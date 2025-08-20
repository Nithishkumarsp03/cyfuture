const { Pool } = require("pg");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Determine if we're in production or development
const isProduction = process.env.NODE_ENV === 'production';

// Configure pool based on environment
let poolConfig;

if (isProduction) {
  // Production configuration (Neon DB)
  const connectionString = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?sslmode=require`;
  poolConfig = {
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  };
} else {
  // Local development configuration (no SSL)
  poolConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432, // Default PostgreSQL port is 5432
    database: process.env.DB_NAME,
    // No SSL configuration for local
  };
}

const pool = new Pool(poolConfig);



// Connect to DB and log success/error
pool.connect()
  .then(() => console.log(`✅ Connected to PostgreSQL database in ${isProduction ? 'production' : 'development'} mode`))
  .catch((err) => console.error("❌ Database connection error:", err.stack));

module.exports = {pool};