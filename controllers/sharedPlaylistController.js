const { db } = require('../models/db.js');  // Import the database connection

// Share a playlist with another user
const sharePlaylist = (req, res) => {
  const { playlist_id, user_id_sender, user_id_receiver, access_level } = req.body;

  // Basic validation
  if (!playlist_id || !user_id_sender || !user_id_receiver || !access_level) {
    return res.status(400).json({ error: "All fields (playlist_id, user_id_sender, user_id_receiver, access_level) are required." });
  }

  // Insert the shared playlist record into the shared_playlists table
  const query = "INSERT INTO shared_playlists (playlist_id, user_id_sender, user_id_receiver, access_level) VALUES (?, ?, ?, ?)";
  const params = [playlist_id, user_id_sender, user_id_receiver, access_level];

  db.run(query, params, function (err) {
    if (err) {
      return res.status(500).json({ error: "Something went wrong while sharing the playlist." });
    }

    res.status(201).json({ message: "Playlist shared successfully!" });
  });
};

// Get all playlists shared with a user
const getSharedPlaylists = (req, res) => {
  const user_id = req.query.user_id;  // Extract the user_id from query params

  // Check if user_id is provided
  if (!user_id) {
    return res.status(400).json({ error: "User ID is required." });
  }

  // Get all playlists shared with the user
  const query = "SELECT id, name, access_level FROM playlists JOIN shared_playlists ON playlists.id = shared_playlists.playlist_id WHERE shared_playlists.user_id_receiver = ?";
  const params = [user_id];

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Unable to fetch shared playlists." });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "No shared playlists found." });
    }

    res.status(200).json({ message: "Shared playlists fetched.", playlists: rows });
  });
};

module.exports = {
  sharePlaylist,
  getSharedPlaylists
};
