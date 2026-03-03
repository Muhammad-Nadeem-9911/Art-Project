const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getAnalytics } = require('../controllers/analyticsController');

router.get('/', protect, admin, getAnalytics);

module.exports = router;