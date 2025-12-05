const sqlite = require('sqlite3');
const db = new sqlite.Database('./musicManager.db'); //SQLite database for your app

// Create Users Table
const createUserTable = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);
`;

// Create Playlists Table
const createPlaylistTable = `
CREATE TABLE IF NOT EXISTS playlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    user_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
`;

// Create Songs Table
const createSongTable = `
CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT,
    playlist_id INTEGER,
    FOREIGN KEY(playlist_id) REFERENCES playlists(id)
);
`;

module.exports = {
    db,
    createUserTable,
    createPlaylistTable,
    createSongTable
};
