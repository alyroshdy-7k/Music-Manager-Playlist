const express = require('express');
const router = express.Router();

// Import the controller functions
const { updateUserRole } = require('../controllers/adminController');

// Route to update a user's role (admin (me) only)
router.put('/update-role:id', updateUserRole);

module.exports = router;
