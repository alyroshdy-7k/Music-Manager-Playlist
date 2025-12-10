const { db } = require('../models/db.js');  // Import the database connection

// Create a favourites playlist for the logged-in user
const createFavoritesPlaylist = (req, res) => {
  const user_id = req.user.userId;   // from authMiddleware

  const query = "INSERT INTO playlists (name, user_id) VALUES (?, ?)";
  const params = ['Favourites', user_id];

  db.run(query, params, function (err) {
    if (err) {
      console.log("Error creating favourites playlist:", err);
      return res.status(500).json({ error: "Could not create favourites playlist" });
    }

    res.status(201).json({ message: "Favorites playlist created.", id: this.lastID });
  });
};

// Add a song to the user's favourites
const addSongToFavorites = (req, res) => {
  const user_id = req.user.userId;   // from JWT
  const { song_id } = req.body;

  if (!song_id) {
    return res.status(400).json({ error: "Song ID is required." });
  }

  const query = "INSERT INTO favourites (song_id, user_id) VALUES (?, ?)";
  const params = [song_id, user_id];

  db.run(query, params, function (err) {
    if (err) {
      console.log("Error adding favourite:", err);
      return res.status(500).json({ error: "Song could not be added to favourites." });
    }

    res.status(201).json({ message: "Song added to favorites!" });
  });
};

// Get all songs in the new logged-in user's favourites
const getFavoritesSongs = (req, res) => {
  const user_id = req.user.userId;   // from JWT

  const query = `
    SELECT songs.id, songs.title, songs.artist
    FROM songs
    JOIN favourites ON songs.id = favourites.song_id
    WHERE favourites.user_id = ?
  `;
  const params = [user_id];

  db.all(query, params, (err, rows) => {
    if (err) {
      console.log("Error fetching favourites:", err);
      return res.status(500).json({ error: "Unable to fetch songs" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "No favorite songs found." });
    }

    res.status(200).json({ message: "Favorites fetched.", songs: rows });
  });
};

// Remove a song from the logged-in user's favourites 
const removeSongFromFavorites = (req, res) => {
  const song_id = req.params.id;
  const user_id = req.user.userId;   // from JWT

  const query = "DELETE FROM favourites WHERE song_id = ? AND user_id = ?";
  const params = [song_id, user_id];

  db.run(query, params, function (err) {

    res.status(200).json({ message: "Song removed from favorites." });
  });
};

module.exports = {
  createFavoritesPlaylist,
  addSongToFavorites,
  getFavoritesSongs,
  removeSongFromFavorites
};
