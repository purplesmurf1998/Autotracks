const express = require('express');
const router = express.Router();

const {
  getEvents,
  getUnReadEvents
} = require('../controllers/eventsController');

// get authentication middleware
const { protect, hasPermissions } = require('../middleware/auth');

router.route('/dealership/:dealershipId')
  .get(protect, getEvents);

router.route('/dealership/:dealershipId/user/:userId')
  .get(protect, getUnReadEvents);

module.exports = router;