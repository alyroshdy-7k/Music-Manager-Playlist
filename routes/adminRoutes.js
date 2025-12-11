const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { updateUserRole } = require('../controllers/adminController');
const { getAllUsers } = require('../controllers/authController');

// PUT /admin/users/:id/role to update roll
router.put('/users/:id/role', protect, updateUserRole);
router.get('/all-users', protect, getAllUsers);

module.exports = router;
