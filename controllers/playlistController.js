const { db } = require('../models/db.js');  // Import the database

// Create a new playlist
const createPlaylist = (req, res) => {
  const { name, user_id } = req.body;  // Extract name and user_id from the request body

  // Check if name is provided, basic validation
  if (!name) {
    return res.status(400).json({ error: "Name is required to create a playlist" });
  }

  const query = "INSERT INTO playlists (name, user_id) VALUES (?, ?)";
  const params = [name, user_id];

  // Missing error handling for db.run here, just making it simple
  db.run(query, params, function (err) {
    if (err) {
      return res.status(500).json({ error: "Something went wrong while creating the playlist" });
    }
    // Simple response with the ID of the new playlist
    res.status(201).json({ message: "Playlist created.", id: this.lastID });
  });
};

// Get all playlists for a user (without checking if user exists)
const getAllPlaylists = (req, res) => {
  const user_id = req.query.user_id;  // Get user_id from query parameters

  // Skipping validation for user_id here
  const query = "SELECT * FROM playlists WHERE user_id = ?";
  const params = [user_id];

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Error retrieving playlists" });
    }
    res.status(200).json({ message: "Playlists fetched successfully", data: rows });
  });
};

// Update a playlist name (missing a check if playlist exists)
const updatePlaylist = (req, res) => {
  const id = Number(req.params.id);  // Get playlist ID from params
  const { name } = req.body;  // Get the new name from request body

  if (!name) {
    return res.status(400).json({ error: "Name is required to update playlist" });
  }

  const query = "UPDATE playlists SET name = ? WHERE id = ?";
  const params = [name, id];

  // Not checking if the playlist exists here
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

// Delete a playlist (no validation if playlist exists first)
const deletePlaylist = (req, res) => {
  const id = Number(req.params.id);  // Get the playlist ID from params

  const query = "DELETE FROM playlists WHERE id = ?";
  const params = [id];

  // No error handling for db.run here, just assuming it's simple
  db.run(query, params, function (err) {
    if (err) {
      return res.status(500).json({ error: "Error deleting playlist" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Playlist not found" });
    }
    res.status(200).json({ message: `Playlist ${id} deleted successfully` });
  });
};

module.exports = { createPlaylist, getAllPlaylists, updatePlaylist, deletePlaylist };
