const express = require('express');
const router = express.Router();

const {
  getAvailableSongs,
  addSongToPlaylist,
  getSongsForPlaylist,
  removeSongFromPlaylist
} = require('../controllers/songController');

const { protect } = require('../middlewares/authMiddleware');

// Get all available songs user can choose from
router.get('/available', protect, getAvailableSongs);

// Add existing song to playlist (by songId)
router.post('/add', protect, addSongToPlaylist);

// Get songs in a playlist
router.get('/all', protect, getSongsForPlaylist);

module.exports = router;
