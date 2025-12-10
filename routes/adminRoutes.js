const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { updateUserRole } = require('../controllers/adminController');

// PUT /admin/users/:id/role
router.put('/users/:id/role', protect, updateUserRole);

module.exports = router;
