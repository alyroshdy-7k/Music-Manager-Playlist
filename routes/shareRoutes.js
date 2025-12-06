const express = require('express');
const router = express.Router();

// Import the controller functions
const { sharePlaylist, getSharedPlaylists } = require('../controllers/sharedPlaylistController');

// Route to share a playlist
router.post('/share', sharePlaylist);

// Route to get all shared playlists
router.get('/shared', getSharedPlaylists);

module.exports = router;
