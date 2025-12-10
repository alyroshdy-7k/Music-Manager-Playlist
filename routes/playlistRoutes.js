const express = require('express');
const router = express.Router();

// Controller functions
const {
  createPlaylist,
  getAllPlaylists,
  updatePlaylist,
  deletePlaylist
} = require('../controllers/playlistController');

// Auth middleware
const { protect } = require('../middlewares/authMiddleware');

// All playlist routes are protected
router.post('/', protect, createPlaylist);
router.get('/', protect, getAllPlaylists);
router.put('/:id', protect, updatePlaylist);
router.delete('/:id', protect, deletePlaylist);

module.exports = router;
