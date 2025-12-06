const { app } = require('./index.js');  // Import Express app
const db_access = require('./models/db.js');  // Import database setup
const db = db_access.db;  // Access SQLite database instance
const authRoutes = require('./routes/authRoutes');  // Import authRoutes
const playlistRoutes = require('./routes/playlistRoutes');  // Import playlistRoutes

const PORT = 3000;  // Port for server

// Create tables before starting the server
db.serialize(() => {
  // Create all required tables
  db.run(db_access.createUserTable, (err) => {
    if (err) console.error("Error creating user table:", err.message);
  });
  db.run(db_access.createPlaylistTable, (err) => {
    if (err) console.error("Error creating playlist table:", err.message);
  });
  db.run(db_access.createSongTable, (err) => {
    if (err) console.error("Error creating song table:", err.message);
  });
  db.run(db_access.createFavouritesTable, (err) => {
    if (err) console.error("Error creating favourites table:", err.message);
  });
  db.run(db_access.createSharedPlaylistsTable, (err) => {  // Add this line for shared playlists table
    if (err) console.error("Error creating shared playlists table:", err.message);
  });

  // Test database connection
  db.get("SELECT 1", (err, row) => {
    if (err) {
      console.error("Error connecting to the database:", err.message);
    } else {
      console.log("Database connected successfully:", row);
    }
  });
});

// Use the routes
app.use('/auth', authRoutes);  // Mount authRoutes at /auth path
app.use('/playlists', playlistRoutes);  // Mount playlistRoutes at /playlists path

// Now start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
