const express = require('express');
const router = express.Router();

const {
  createFavoritesPlaylist,
  addSongToFavorites,
  getFavoritesSongs,
  removeSongFromFavorites
} = require('../controllers/favouriteController');

const { protect } = require('../middlewares/authMiddleware');

// Create a favourites playlist for the logged-in user
// POST /favourites/create
router.post('/create', protect, createFavoritesPlaylist);

// Add a song to favourites
// POST /favourites/add
router.post('/add', protect, addSongToFavorites);

// Get all favourite songs for the logged-in user
// GET /favourites/all
router.get('/all', protect, getFavoritesSongs);

// Remove a song from favourites for the logged-in user
// DELETE /favourites/remove/:id
router.delete('/remove/:id', protect, removeSongFromFavorites);

module.exports = router;
