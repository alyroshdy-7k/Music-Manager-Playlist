const { db } = require('../models/db.js');

// Share a playlist
const sharePlaylist = (req, res) => {
  const { playlist_id, user_id_receiver, access_level } = req.body;

  // Take sender from JWT (not from body)
  const user_id_sender = req.user.userId;

  if (!playlist_id || !user_id_receiver || !access_level) {
    return res.status(400).json({ error: "Missing fields." });
  }

  const query = `
    INSERT INTO shared_playlists (playlist_id, user_id_sender, user_id_receiver, access_level)
    VALUES (?, ?, ?, ?)
  `;
  const params = [playlist_id, user_id_sender, user_id_receiver, access_level];

  db.run(query, params, function (err) {
    if (err) {
      return res.status(500).json({ error: "Error sharing playlist." });
    }

    res.status(201).json({ message: "Playlist shared successfully!" });
  });
};

// Get playlists shared with logged-in user
const getSharedPlaylists = (req, res) => {
  const user_id = req.user.userId;

  const query = `
    SELECT playlists.id, playlists.name, shared_playlists.access_level
    FROM playlists
    JOIN shared_playlists
      ON playlists.id = shared_playlists.playlist_id
    WHERE shared_playlists.user_id_receiver = ?
  `;

  db.all(query, [user_id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching shared playlists." });
    }

    res.status(200).json({
      message: "Shared playlists fetched.",
      playlists: rows
    });
  });
};

module.exports = { sharePlaylist, getSharedPlaylists };
