const { db } = require('../models/db.js');  // Import the database connection

// Get all available songs (the list user can choose from)
const getAvailableSongs = (req, res) => {
  const query = "SELECT id, title, artist FROM songs"; // songs library

  db.all(query, [], (err, rows) => {
    if (err) {
      console.log("Failed to retrieve available songs:", err);
      return res.status(500).json({ error: "Unable to fetch available songs." });
    }

    return res.status(200).json({
      message: "Available songs fetched.",
      songs: rows
    });
  });
};

// Add an existing song (by songId) to a playlist
const addSongToPlaylist = (req, res) => {
  const { songId, playlistId } = req.body;   // user picks existing song
  const user_id = req.user.userId;           // from JWT

  if (!songId || !playlistId) {
    return res.status(400).json({ error: "songId and playlistId are required." });
  }

  // 1) Make sure this playlist belongs to the logged-in user
  const checkPlaylistQuery = "SELECT * FROM playlists WHERE id = ? AND user_id = ?";
  db.get(checkPlaylistQuery, [playlistId, user_id], (err, playlistRow) => {
    if (err) {
      console.log("Error checking playlist ownership:", err);
      return res.status(500).json({ error: "Server error" });
    }

    if (!playlistRow) {
      return res.status(403).json({ error: "You cannot add songs to this playlist" });
    }

    // 2) Get the song details from the songs table (the "catalog")
    const getSongQuery = "SELECT title, artist FROM songs WHERE id = ?";
    db.get(getSongQuery, [songId], (err, songRow) => {
      if (err) {
        console.log("Error fetching song:", err);
        return res.status(500).json({ error: "Server error" });
      }

      if (!songRow) {
        return res.status(404).json({ error: "Song not found" });
      }

      // 3) Insert a copy of that song into the playlist (same title/artist, new row)
      const insertQuery = "INSERT INTO songs (title, artist, playlist_id) VALUES (?, ?, ?)";
      const params = [songRow.title, songRow.artist, playlistId];

      db.run(insertQuery, params, function (err) {
        if (err) {
          console.log("Failed to add song to playlist:", err);
          return res.status(500).json({ error: "Something went wrong." });
        }

        return res.status(201).json({
          message: "Song added to playlist!",
          songId: this.lastID
        });
      });
    });
  });
};

// Get all songs from a specific playlist
const getSongsForPlaylist = (req, res) => {
  const playlistId = req.query.playlistId;
  const user_id = req.user.userId;

  if (!playlistId) {
    return res.status(400).json({ error: "Playlist ID is required." });
  }

  // Make sure the playlist belongs to the logged-in user
  const checkQuery = "SELECT * FROM playlists WHERE id = ? AND user_id = ?";
  db.get(checkQuery, [playlistId, user_id], (err, row) => {
    if (err) {
      console.log("Error checking playlist ownership:", err);
      return res.status(500).json({ error: "Server error" });
    }

    if (!row) {
      return res.status(403).json({ error: "You cannot view songs in this playlist" });
    }

    const query = "SELECT id, title, artist FROM songs WHERE playlist_id = ?";
    db.all(query, [playlistId], (err, rows) => {
      if (err) {
        console.log("Failed to retrieve songs:", err);
        return res.status(500).json({ error: "Unable to fetch songs." });
      }

      res.status(200).json({ message: "Songs fetched.", songs: rows });
    });
  });
};



module.exports = {
  getAvailableSongs,
  addSongToPlaylist,
  getSongsForPlaylist,
};
