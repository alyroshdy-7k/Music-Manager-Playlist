const { db } = require('../models/db.js');  // Import the database connection

// Add a song to a playlist
const addSongToPlaylist = (req, res) => {
  const { songTitle, artistName, playlistId } = req.body;  // Destructure song details from the request

  // Basic validation for song data
  if (!songTitle || !artistName || !playlistId) {
    return res.status(400).json({ error: "Song title, artist name, and playlist ID are required." });
  }

  const query = "INSERT INTO songs (title, artist, playlist_id) VALUES (?, ?, ?)";
  const params = [songTitle, artistName, playlistId];

  // Attempt to add the song
  db.run(query, params, function(err) {
    if (err) {
      console.log("Failed to add song:", err);  // Simplified logging for errors
      return res.status(500).json({ error: "Something went wrong." });
    }

    // Success response with the new song ID
    res.status(201).json({ message: "Song added to playlist!", songId: this.lastID });
  });
};

// Get all songs from a specific playlist
const getSongsForPlaylist = (req, res) => {
  const playlistId = req.query.playlistId;  // Extract playlist ID from the query params

  if (!playlistId) {
    return res.status(400).json({ error: "Playlist ID is required." });
  }

  const query = "SELECT id, title, artist FROM songs WHERE playlist_id = ?";
  const params = [playlistId];

  db.all(query, params, (err, rows) => {
    if (err) {
      console.log("Failed to retrieve songs:", err);  // Simplified logging for errors
      return res.status(500).json({ error: "Unable to fetch songs." });
    }

    // Return the songs associated with the given playlist
    res.status(200).json({ message: "Songs fetched.", songs: rows });
  });
};

// Remove a song from a playlist
const removeSongFromPlaylist = (req, res) => {
  const songId = req.params.id;  // Song ID from route params

  const query = "DELETE FROM songs WHERE id = ?";
  const params = [songId];

  db.run(query, params, function(err) {
    if (err) {
      console.log("Failed to delete song:", err);  // Simplified logging for errors
      return res.status(500).json({ error: "Unable to remove song." });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Song not found." });
    }

    res.status(200).json({ message: "Song removed successfully!" });
  });
};

module.exports = {
  addSongToPlaylist,
  getSongsForPlaylist,
  removeSongFromPlaylist
};
