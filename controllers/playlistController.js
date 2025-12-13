const { db } = require('../models/db.js');

// Create a new playlist
const createPlaylist = (req, res) => {
  const { name } = req.body;
  const user_id = req.user.userId;  // from JWT middleware

  if (!name) {
    return res.status(400).json({ error: "Name is required to create a playlist" });
  }

  const query = "INSERT INTO playlists (name, user_id) VALUES (?, ?)";
  const params = [name, user_id];

  db.run(query, params, function (err) {
    if (err) {
      console.log("Error creating playlist:", err);
      return res.status(500).json({ error: "Something went wrong while creating the playlist" });
    }
    res.status(201).json({ message: "Playlist created.", id: this.lastID });
  });
};

// Get all playlists for the logged-in user
const getAllPlaylists = (req, res) => {
  const user_id = req.user.userId;  // from JWT

  const query = "SELECT * FROM playlists WHERE user_id = ?";
  const params = [user_id];

  db.all(query, params, (err, rows) => {
    if (err) {
      console.log("Error fetching playlists:", err);
      return res.status(500).json({ error: "Error retrieving playlists" });
    }
    res.status(200).json({ message: "Playlists fetched successfully", data: rows });
  });
};

// Update a playlist name
const updatePlaylist = (req, res) => {
  const playlist_id = Number(req.params.id);
  const { name } = req.body;
  const user_id = req.user.userId; // from JWT

  if (!name) {
    return res.status(400).json({ error: "Name is required to update playlist" });
  }

  // Check if playlist belongs to user
  const checkQuery = "SELECT * FROM playlists WHERE id = ? AND user_id = ?";
  db.get(checkQuery, [playlist_id, user_id], (err, row) => {
    if (err) {
      console.log("Error checking playlist ownership:", err);
      return res.status(500).json({ error: "Server error" });
    }

    if (!row) {
      return res.status(403).json({ error: "You cannot edit this playlist" });
    }

    // If ownership is correct → update
    const updateQuery = "UPDATE playlists SET name = ? WHERE id = ?";
    db.run(updateQuery, [name, playlist_id], function (err) {

      res.status(200).json({ message: "Playlist updated successfully" });
    });
  });
};


// Delete a playlist and its associated songs
const deletePlaylist = (req, res) => {
  const playlist_id = Number(req.params.id);
  const user_id = req.user.userId; // from JWT

  // 1) Check ownership first
  const checkQuery = "SELECT * FROM playlists WHERE id = ? AND user_id = ?";
  db.get(checkQuery, [playlist_id, user_id], (err, row) => {
    if (err) {
      console.log("Error checking playlist ownership:", err);
      return res.status(500).json({ error: "Server error" });
    }

    if (!row) {
      return res.status(403).json({ error: "You cannot delete this playlist" });
    }

    // 2) Delete songs in that playlist
    const deleteSongsQuery = "DELETE FROM playlist_songs WHERE playlist_id = ?";
    db.run(deleteSongsQuery, [playlist_id], (err) => {
      if (err) {
        console.log("Error deleting songs from playlist:", err);
        return res.status(500).json({ error: "Error deleting songs from playlist" });
      }

      // 3) Delete the playlist itself
      const deletePlaylistQuery = "DELETE FROM playlists WHERE id = ?";
      db.run(deletePlaylistQuery, playlist_id, function (err) {
        if (err) {
          console.log("Error deleting playlist:", err);
          return res.status(500).json({ error: "Error deleting playlist" });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: "Playlist not found" });
        }

        res.status(200).json({
          message: `Playlist ${playlist_id} and associated songs deleted successfully`
        });
      });
    });
  });
};

module.exports = { createPlaylist, getAllPlaylists, updatePlaylist, deletePlaylist };
