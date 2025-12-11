const express = require('express');
const router = express.Router();

// Import functions from the controller
const { signup, login, logout, makeMeAdmin, getMe, getAllUsers } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Define signup route,
router.post('/signup', signup);

// Define login route, 
router.post('/login', login);
// Get current user information
router.get('/me', protect, getMe);

// Define logout route,
router.post('/logout', logout);

router.post('/make-admin', protect, makeMeAdmin);

router.get('/all-users', protect, getAllUsers);

module.exports = router;  // Export the router