const express = require('express');
const router = express.Router();

const {
  getHistory,
  createHistory,

} = require('../controllers/historyController');

// get authentication middleware
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createHistory);

router.route('/vehicle/:vehicleId')
  .get(protect, getHistory);

module.exports = router;