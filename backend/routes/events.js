const express = require('express');
const router = express.Router();

const {
  getEvents,
  getUnReadEvents,
  markEventAsRead,
} = require('../controllers/eventsController');

// get authentication middleware
//hasPermissions need to be refactored to has roles, with a possibility of a complete removal

const { protect, hasPermissions } = require('../middleware/auth');

router.route('/dealership/:dealershipId')
  .get(protect, getEvents);

router.route('/dealership/:dealershipId/user/:userId')
  .get(protect, getUnReadEvents);

router.route('/:eventId/user/:userId')
  .put(protect, markEventAsRead);

module.exports = router;