const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./musicManager.db');  //SQLite database for your app

//SQL to create User Table
const createUserTable = `
  CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user'
  );
`;

//SQL to create Playlist Table
const createPlaylistTable = `
  CREATE TABLE IF NOT EXISTS playlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    user_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`;

//SQL to create Song Table
const createSongTable = `
  CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT,
    playlist_id INTEGER,
    FOREIGN KEY(playlist_id) REFERENCES playlists(id)
  );
`;

//SQL to create Favourites Table (example of extra table)
const createFavouritesTable = `
  CREATE TABLE IF NOT EXISTS favourites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    song_id INTEGER,
    user_id INTEGER,
    FOREIGN KEY(song_id) REFERENCES songs(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`;

//Export db and table creation queries
module.exports = {
  db,
  createUserTable,
  createPlaylistTable,
  createSongTable,
  createFavouritesTable  //Include extra tables here
};

