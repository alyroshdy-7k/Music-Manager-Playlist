const { db } = require('../models/db.js');

// Create a new playlist
const createPlaylist = (req, res) => {
  const { name, user_id } = req.body;  // Extract name and user_id from the request body

  if (!name) {
    return res.status(400).json({ error: "Name is required to create a playlist" });
  }

  const query = "INSERT INTO playlists (name, user_id) VALUES (?, ?)";
  const params = [name, user_id];

  db.run(query, params, function (err) {
    if (err) {
      return res.status(500).json({ error: "Something went wrong while creating the playlist" });
    }
    res.status(201).json({ message: "Playlist created.", id: this.lastID });
  });
};

// Get all playlists for a user
const getAllPlaylists = (req, res) => {
  const user_id = req.query.user_id;

  const query = "SELECT * FROM playlists WHERE user_id = ?";
  const params = [user_id];

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Error retrieving playlists" });
    }
    res.status(200).json({ message: "Playlists fetched successfully", data: rows });
  });
};

// Update a playlist name
const updatePlaylist = (req, res) => {
  const id = Number(req.params.id);  // Get playlist ID from params
  const { name } = req.body;  // Get the new name from request body

  if (!name) {
    return res.status(400).json({ error: "Name is required to update playlist" });
  }

  const query = "UPDATE playlists SET name = ? WHERE id = ?";
  const params = [name, id];

  db.run(query, params, function (err) {
    if (err) {
      return res.status(500).json({ error: "Error updating playlist" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Playlist not found" });
    }
    res.status(200).json({ message: "Playlist updated successfully" });
  });
};

// Delete a playlist and its associated songs
const deletePlaylist = (req, res) => {
  const id = Number(req.params.id);  // Get playlist ID from params

  // First, delete all songs associated with this playlist
  const deleteSongsQuery = "DELETE FROM songs WHERE playlist_id = ?";
  const deleteSongsParams = [id];

  db.run(deleteSongsQuery, deleteSongsParams, (err) => {
    if (err) {
      return res.status(500).json({ error: "Error deleting songs from playlist" });
    }

    // Now, delete the playlist itself
    const query = "DELETE FROM playlists WHERE id = ?";
    const params = [id];

    db.run(query, params, function (err) {
      if (err) {
        return res.status(500).json({ error: "Error deleting playlist" });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Playlist not found" });
      }
      res.status(200).json({ message: `Playlist ${id} and associated songs deleted successfully` });
    });
  });
};

module.exports = { createPlaylist, getAllPlaylists, updatePlaylist, deletePlaylist };
