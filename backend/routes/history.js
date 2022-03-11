const express = require('express');
const router = express.Router();

const {
  getHistory,
} = require('../controllers/historyController');

// get authentication middleware
//hasPermissions need to be refactored to has roles, with a possibility of a complete removal

const { protect } = require('../middleware/auth');

router.route('/vehicle/:vehicleId')
  .get(protect, getHistory);

module.exports = router;