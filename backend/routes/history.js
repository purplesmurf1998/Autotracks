const express = require('express');
const router = express.Router();

const {
  getHistory,
} = require('../controllers/historyController');

// get authentication middleware
const { protect } = require('../middleware/auth');

router.route('/vehicle/:vehicleId')
  .get(protect, getHistory);

module.exports = router;