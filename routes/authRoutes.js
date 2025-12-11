const express = require('express');
const router = express.Router();

// Import functions from the controller
const { signup, login, logout, makeMeAdmin, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Define signup route,
router.post('/signup', signup);

// Define login route, 
router.post('/login', login);

router.get('/me', protect, getMe);

// Define logout route,
router.post('/logout', logout);

router.post('/make-admin', protect, makeMeAdmin);

module.exports = router;  // Export the router