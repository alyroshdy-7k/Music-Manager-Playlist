const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('musicManager.db');

// Create User Table
const createUserTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user'
  );
`;

// Create Playlist Table
const createPlaylistTable = `
  CREATE TABLE IF NOT EXISTS playlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    user_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`;

// Create Song Table (FIXED: removed playlist_id)
const createSongTable = `
  CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT NOT NULL
  );
`;

// Create Playlist_Songs Table (link table)
const createPlaylistSongsTable = `
  CREATE TABLE IF NOT EXISTS playlist_songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    playlist_id INTEGER NOT NULL,
    song_id INTEGER NOT NULL,
    FOREIGN KEY(playlist_id) REFERENCES playlists(id),
    FOREIGN KEY(song_id) REFERENCES songs(id)
  );
`;

// Create Favourites Table
const createFavouritesTable = `
  CREATE TABLE IF NOT EXISTS favourites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    song_id INTEGER,
    user_id INTEGER,
    FOREIGN KEY(song_id) REFERENCES songs(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`;

// Create Shared Playlists Table
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

// Dummy Songs (fixed: no playlist_id)
const insertDummySongs = () => {
  const dummySongs = [
    { title: 'Dummy Song 1', artist: 'Dummy Artist 1' },
    { title: 'Dummy Song 2', artist: 'Dummy Artist 2' },
    { title: 'Dummy Song 3', artist: 'Dummy Artist 3' },
    { title: 'Dummy Song 4', artist: 'Dummy Artist 4' },
    { title: 'Dummy Song 5', artist: 'Dummy Artist 5' },
    { title: 'Dummy Song 6', artist: 'Dummy Artist 6' },
    { title: 'Dummy Song 7', artist: 'Dummy Artist 7' },
    { title: 'Dummy Song 8', artist: 'Dummy Artist 8' },
    { title: 'Dummy Song 9', artist: 'Dummy Artist 9' }
  ];

  dummySongs.forEach(song => {
    db.run("INSERT INTO songs (title, artist) VALUES (?, ?)", [
      song.title,
      song.artist
    ]);
  });
};

// Create Tables
db.serialize(() => {
  db.run(createUserTable);
  db.run(createPlaylistTable);
  db.run(createSongTable);
  db.run(createPlaylistSongsTable);
  db.run(createFavouritesTable);
  db.run(createSharedPlaylistsTable);

  db.get("SELECT COUNT(*) AS count FROM songs", (err, row) => {
    if (row.count === 0) {
      insertDummySongs();
    }
  });
});

module.exports = {
  db,
  createUserTable,
  createPlaylistTable,
  createSongTable,
  createPlaylistSongsTable,
  createFavouritesTable,
  createSharedPlaylistsTable
};
