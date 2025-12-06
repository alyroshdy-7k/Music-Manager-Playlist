const express = require('express');
const router = express.Router();

// Import the controller functions
const { createPlaylist, getAllPlaylists, updatePlaylist, deletePlaylist } = require('../controllers/playlistController');

// Route to create a new playlist
router.post('/', createPlaylist);

// Route to get all playlists of a user
router.get('/', getAllPlaylists);

// Route to update a specific playlist
router.put('/:id', updatePlaylist);

// Route to delete a specific playlist
router.delete('/:id', deletePlaylist);

module.exports = router;
