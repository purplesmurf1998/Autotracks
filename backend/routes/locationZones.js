const express = require('express');
const router = express.Router();

const {
  createLocationZone,
  getLocationZones,
  deleteLocationZone
} = require('../controllers/locationZoneController');

// get authentication middleware
const { protect, hasPermissions } = require('../middleware/auth');

router.route('/')
  .post(protect, createLocationZone);

router.route('/:zoneId')
  .delete(protect, deleteLocationZone);

router.route('/dealership/:dealershipId')
  .get(protect, getLocationZones);

module.exports = router;