const express = require('express');
const router = express.Router();

const { sharePlaylist, getSharedPlaylists } = require('../controllers/sharedPlaylistController');
const { protect } = require('../middlewares/authMiddleware');

// Routes with JWT protection
router.post('/share', protect, sharePlaylist);
router.get('/shared', protect, getSharedPlaylists);

module.exports = router;
