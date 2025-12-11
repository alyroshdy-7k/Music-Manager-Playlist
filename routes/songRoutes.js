const express = require('express');
const router = express.Router();

const {
  getAvailableSongs,
  addSongToPlaylist,
  getSongsForPlaylist
} = require('../controllers/songController');

const { protect } = require('../middlewares/authMiddleware');

// Get catalog songs
router.get('/available', protect, getAvailableSongs);

// Add song to playlist
router.post('/add', protect, addSongToPlaylist);

// Get songs of playlist
router.get('/all', protect, getSongsForPlaylist);

module.exports = router;
