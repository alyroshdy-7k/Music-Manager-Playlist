const express = require('express');
const router = express.Router();

// Import the controller functions
const { addSongToPlaylist, getSongsForPlaylist, removeSongFromPlaylist } = require('../controllers/songController');

// Route to add a song to a playlist
// POST request to /songs/add
router.post('/add', addSongToPlaylist);

// Route to get all songs from a specific playlist
// GET request to /songs/all?playlistId
router.get('/all', getSongsForPlaylist);

// Route to remove a song from a playlist
// DELETE request to /songs/remove/:id, where :id is the song id
router.delete('/remove/:id', removeSongFromPlaylist);

module.exports = router;  // Export the router
