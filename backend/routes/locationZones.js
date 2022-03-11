const express = require('express');
const router = express.Router();

const {
  createLocationZone,
  getLocationZones,
  deleteLocationZone,
  updateZoneNameDescription
} = require('../controllers/locationZoneController');

// get authentication middleware
//hasPermissions need to be refactored to has roles, with a possibility of a complete removal

const { protect, hasPermissions } = require('../middleware/auth');

router.route('/')
  .post(protect, createLocationZone);

router.route('/:zoneId')
  .delete(protect, deleteLocationZone)
  .put(protect, updateZoneNameDescription);

router.route('/dealership/:dealershipId')
  .get(protect, getLocationZones);

module.exports = router;