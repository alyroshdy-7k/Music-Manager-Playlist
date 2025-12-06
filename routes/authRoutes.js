const express = require('express');
const router = express.Router();

// Import functions from the controller
const { signup, login, logout } = require('../controllers/authController');

// Define signup route, linking to the signup function in the auth controller
router.post('/signup', signup);

// Define login route, linking to the login function in the auth controller
router.post('/login', login);

// Define logout route, linking to the logout function in the auth controller
router.post('/logout', logout);

module.exports = router;  // Export the router
