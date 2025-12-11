const { db } = require('../models/db.js');

// Get all available catalog songs
const getAvailableSongs = (req, res) => {
  const query = "SELECT id, title, artist FROM songs";

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Unable to fetch songs." });

    return res.status(200).json({
      message: "Available songs fetched.",
      songs: rows
    });
  });
};

// Add a song to playlist using linking table
const addSongToPlaylist = (req, res) => {
  const { songId, playlistId } = req.body;
  const user_id = req.user.userId;

  if (!songId || !playlistId)
    return res.status(400).json({ error: "songId and playlistId required." });

  // Check playlist ownership
  const checkPlaylistQuery = "SELECT * FROM playlists WHERE id = ? AND user_id = ?";
  db.get(checkPlaylistQuery, [playlistId, user_id], (err, playlistRow) => {
    if (!playlistRow) return res.status(403).json({ error: "Not your playlist." });

    // Check if song exists
    const checkSongQuery = "SELECT * FROM songs WHERE id = ?";
    db.get(checkSongQuery, [songId], (err, songRow) => {
      if (!songRow) return res.status(404).json({ error: "Song not found." });

      // Insert link
      const linkQuery = `
        INSERT INTO playlist_songs (playlist_id, song_id)
        VALUES (?, ?)
      `;

      db.run(linkQuery, [playlistId, songId], function (err) {
  if (err) {
    console.log("SQL ERROR:", err); // DEBUG LINE
    return res.status(500).json({ error: "Something went wrong." });
  }

  return res.status(201).json({
    message: "Song added to playlist!",
    linkId: this.lastID
    });
});

    });
  });
};

// Fetch all songs from a playlist using JOIN
const getSongsForPlaylist = (req, res) => {
  const playlistId = req.query.playlistId;
  const user_id = req.user.userId;

  if (!playlistId) return res.status(400).json({ error: "playlistId required." });

  // Check playlist belongs to user
  const checkQuery = "SELECT * FROM playlists WHERE id = ? AND user_id = ?";
  db.get(checkQuery, [playlistId, user_id], (err, row) => {
    if (!row) return res.status(403).json({ error: "Not your playlist." });

    const query = `
      SELECT songs.id, songs.title, songs.artist
      FROM songs
      JOIN playlist_songs ON songs.id = playlist_songs.song_id
      WHERE playlist_songs.playlist_id = ?
    `;

    db.all(query, [playlistId], (err, rows) => {
      if (err) return res.status(500).json({ error: "Failed to fetch songs." });

      return res.status(200).json({
        message: "Songs fetched.",
        songs: rows
      });
    });
  });
};

module.exports = {
  getAvailableSongs,
  addSongToPlaylist,
  getSongsForPlaylist
};
