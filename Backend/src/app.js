const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const {authMiddleware} = require('./middlewares/authMiddleware');

const authRoutes = require('./routes/auth/authRoutes');
const roomRoutes = require('./routes/room/roomRoutes');

const api = process.env.API;
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({
  origin: '*', // Or specify your allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

app.get(`${api}/`, (req, res) => {
  res.send("Hello");
});

app.use(`${api}/auth`, authRoutes);
app.use(authMiddleware);
app.use(`${api}/room`, roomRoutes);


module.exports = app;