const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(cookieParser());
app.use(express.json());
const { normalizeInput } = require('./middlewares/validators');
app.use(normalizeInput);


// Import routes
const authRouter = require('./routes/authRoutes');
const playlistRouter = require('./routes/playlistRoutes');
const songRoutes = require('./routes/songRoutes');
const favouriteRouter = require('./routes/favouriteRoutes');  // Import favourites routes
const shareRouter = require('./routes/shareRoutes');  // Import share playlist routes
const adminRouter = require('./routes/adminRoutes');  // Import admin routes

// Test database connection
const { db } = require('./models/db.js');
db.get("SELECT 1", (err, row) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("Database is accessible! Test query result:", row);
  }
});

// Use routes
app.use('/auth', authRouter);
app.use('/playlists', playlistRouter);
app.use('/songs', songRoutes);
app.use('/favourites', favouriteRouter);  
app.use('/share', shareRouter);  
app.use('/admin', adminRouter);  // Use admin routes

// Export the app for use in server.js
module.exports = { app };
