const express = require('express');
const router = express.Router();
const { createFavoritesPlaylist, addSongToFavorites, getFavoritesSongs, removeSongFromFavorites } = require('../controllers/favouriteController');

// Route to create a favorites playlist
router.post('/create', createFavoritesPlaylist);

// Route to add a song to favorites
router.post('/add', addSongToFavorites);

// Route to get all songs in the user's favorites
router.get('/get', getFavoritesSongs);

// Route to remove a song from favorites
router.delete('/remove/:id', removeSongFromFavorites);

module.exports = router;
