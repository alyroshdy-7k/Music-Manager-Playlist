const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('musicManager.db'); // SQLite database for your app

// SQL to create User Table
const createUserTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user'
  );
`;

// SQL to create Playlist Table
const createPlaylistTable = `
  CREATE TABLE IF NOT EXISTS playlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    user_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`;

// SQL to create Song Table
const createSongTable = `
  CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT,
    playlist_id INTEGER,
    FOREIGN KEY(playlist_id) REFERENCES playlists(id)
  );
`;

// SQL to create Favourites Table
const createFavouritesTable = `
  CREATE TABLE IF NOT EXISTS favourites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    song_id INTEGER,
    user_id INTEGER,
    FOREIGN KEY(song_id) REFERENCES songs(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`;

// SQL to create Shared Playlists Table 
const createSharedPlaylistsTable = `
  CREATE TABLE IF NOT EXISTS shared_playlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    playlist_id INTEGER,
    user_id_sender INTEGER,
    user_id_receiver INTEGER,
    access_level TEXT CHECK(access_level IN ('view', 'edit')),
    shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(playlist_id) REFERENCES playlists(id),
    FOREIGN KEY(user_id_sender) REFERENCES users(id),
    FOREIGN KEY(user_id_receiver) REFERENCES users(id)
  );
`;

// Function to insert dummy songs (dummy data) into the database
const insertDummySongs = () => {
  const dummySongs = [
    { title: 'Dummy Song 1', artist: 'Dummy Artist 1', playlist_id: 1 },
    { title: 'Dummy Song 2', artist: 'Dummy Artist 2', playlist_id: 1 },
    { title: 'Dummy Song 3', artist: 'Dummy Artist 3', playlist_id: 2 },
    { title: 'Dummy Song 4', artist: 'Dummy Artist 4', playlist_id: 2 },
  ];

  dummySongs.forEach(song => {
    const query = "INSERT INTO songs (title, artist, playlist_id) VALUES (?, ?, ?)";
    const params = [song.title, song.artist, song.playlist_id];
    
    db.run(query, params, (err) => {
      if (err) {
        console.log("Error adding dummy song:", err);
      }
    });
  });
};

// Create the tables and insert dummy data if necessary
db.serialize(() => {
  // Create User Table
  db.run(createUserTable, (err) => {
    if (err) console.error("Error creating user table:", err.message);
  });

  // Create Playlist Table
  db.run(createPlaylistTable, (err) => {
    if (err) console.error("Error creating playlist table:", err.message);
  });

  // Create Song Table
  db.run(createSongTable, (err) => {
    if (err) console.error("Error creating song table:", err.message);
  });

  // Create Favourites Table
  db.run(createFavouritesTable, (err) => {
    if (err) console.error("Error creating favourites table:", err.message);
  });

  // Create Shared Playlists Table
  db.run(createSharedPlaylistsTable, (err) => {
    if (err) console.error("Error creating shared playlists table:", err.message);
  });

  // Insert dummy songs (only run if the songs table is empty)
  insertDummySongs();
});

// Export db and table creation queries
module.exports = {
  db,
  createUserTable,
  createPlaylistTable,
  createSongTable,
  createFavouritesTable,
  createSharedPlaylistsTable // Export shared playlists table
};
