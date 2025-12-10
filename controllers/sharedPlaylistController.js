const { db } = require('../models/db.js');  // Import the database connection

// Share a playlist with another user
const sharePlaylist = (req, res) => {
  const { playlist_id, user_id_receiver, access_level } = req.body;
  const user_id_sender = req.user.userId; // from authMiddleware (JWT)

  // Basic validation
  if (!playlist_id || !user_id_receiver || !access_level) {
    return res.status(400).json({
      error: "playlist_id, user_id_receiver and access_level are required."
    });
  }

  // Only allow 'view' or 'edit'
  if (!['view', 'edit'].includes(access_level)) {
    return res.status(400).json({ error: "access_level must be 'view' or 'edit'." });
  }

  // 1) Check that this playlist belongs to the logged-in user (sender)
  const checkQuery = "SELECT * FROM playlists WHERE id = ? AND user_id = ?";
  db.get(checkQuery, [playlist_id, user_id_sender], (err, row) => {
    if (err) {
      console.log("Error checking playlist ownership:", err);
      return res.status(500).json({ error: "Server error while checking playlist." });
    }

    if (!row) {
      return res.status(403).json({
        error: "You can only share playlists that you own."
      });
    }

    // 2) Insert the shared playlist record
    const insertQuery = `
      INSERT INTO shared_playlists (playlist_id, user_id_sender, user_id_receiver, access_level)
      VALUES (?, ?, ?, ?)
    `;
    const params = [playlist_id, user_id_sender, user_id_receiver, access_level];

    db.run(insertQuery, params, function (err) {
      if (err) {
        console.log("Error sharing playlist:", err);
        return res.status(500).json({
          error: "Something went wrong while sharing the playlist."
        });
      }

      res.status(201).json({
        message: "Playlist shared successfully!",
        shared_id: this.lastID
      });
    });
  });
};

// Get all playlists shared *with* the logged-in user
const getSharedPlaylists = (req, res) => {
  const user_id = req.user.userId;  // from JWT

  const query = `
    SELECT
      playlists.id,
      playlists.name,
      shared_playlists.access_level,
      shared_playlists.user_id_sender
    FROM playlists
    JOIN shared_playlists ON playlists.id = shared_playlists.playlist_id
    WHERE shared_playlists.user_id_receiver = ?
  `;
  const params = [user_id];

  db.all(query, params, (err, rows) => {
    if (err) {
      console.log("Error fetching shared playlists:", err);
      return res.status(500).json({ error: "Unable to fetch shared playlists." });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "No shared playlists found." });
    }

    res.status(200).json({
      message: "Shared playlists fetched.",
      playlists: rows
    });
  });
};

module.exports = {
  sharePlaylist,
  getSharedPlaylists
};
