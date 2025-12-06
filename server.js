const { app } = require('./index.js');  // Import Express app
const db_access = require('./models/db.js');  // Import database setup
const db = db_access.db;  // Access SQLite database instance

const PORT = 3000;  // Port for server

// Create tables before starting server
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
});

// Now start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

