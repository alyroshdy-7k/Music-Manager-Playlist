const { db } = require('../models/db.js');  // Import the database connection

// Create a favorites playlist for the user
const createFavoritesPlaylist = (req, res) => {
  const user_id = req.body.user_id;  // Getting the user ID from the request body

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const query = "INSERT INTO playlists (name, user_id) VALUES (?, ?)";
  const params = ['Favorites', user_id];

  db.run(query, params, function () {
    res.status(201).json({ message: "Favorites playlist created.", id: this.lastID });
  });
};

// Add a song to the user's favorites playlist 
const addSongToFavorites = (req, res) => {
  const { song_id, user_id } = req.body;

  if (!song_id || !user_id) {
    return res.status(400).json({ error: "Song ID and User ID are required." });
  }

  const query = "INSERT INTO favorites (song_id, user_id) VALUES (?, ?)";
  const params = [song_id, user_id];

  db.run(query, params, function () {
    res.status(201).json({ message: "Song added to favorites!" });
  });
};

// Get all songs in the user's favorites
const getFavoritesSongs = (req, res) => {
  const user_id = req.query.user_id;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const query = "SELECT id, title, artist FROM songs JOIN favorites ON songs.id = favorites.song_id WHERE favorites.user_id = ?";
  const params = [user_id];

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Unable to fetch songs" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "No favorite songs found." });
    }

    res.status(200).json({ message: "Favorites fetched.", songs: rows });
  });
};

// Remove a song from the user's favorites 
const removeSongFromFavorites = (req, res) => {
  const song_id = req.params.id;

  const query = "DELETE FROM favorites WHERE song_id = ?";
  const params = [song_id];

  db.run(query, params, function () {
    if (this.changes === 0) {
      return res.status(404).json({ error: "Song not found in favorites." });
    }

    res.status(200).json({ message: "Song removed from favorites." });
  });
};

module.exports = {
  createFavoritesPlaylist,
  addSongToFavorites,
  getFavoritesSongs,
  removeSongFromFavorites
};
