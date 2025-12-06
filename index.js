const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();  // Loads environment variables from .env file
const cookieParser = require('cookie-parser');

// Import routes
const authRouter = require('./routes/authRoutes');  // Authentication routes
const playlistRouter = require('./routes/playlistRoutes');  // Playlist routes

// Middleware
app.use(cookieParser());  // Cookie parsing middleware
app.use(express.json());  // JSON parsing middleware

// Test database connection
const { db } = require('./models/db.js');
db.get("SELECT 1", (err, row) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("Database is accessible! Test query result:", row);
  }
});

// Using routes
app.use('/auth', authRouter);  // Use the authentication routes
app.use('/playlists', playlistRouter);  // Use the playlist routes

// Export the app for use in server.js
module.exports = { app };
