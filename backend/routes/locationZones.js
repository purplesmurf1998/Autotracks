const express = require('express');
const router = express.Router();

const {
    createLocationZone,
    getLocationZones
} = require('../controllers/locationZoneController');

// get authentication middleware
const { protect, hasPermissions } = require('../middleware/auth');

router.route('/')
  .post(protect, createLocationZone);

router.route('/dealership/:dealershipId')
  .get(protect, getLocationZones);

module.exports = router;