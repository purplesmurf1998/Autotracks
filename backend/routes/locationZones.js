const express = require('express');
const router = express.Router();

const {
  createLocationZone,
  getLocationZones,
  deleteLocationZone,
  updateZoneNameDescription,
  isInsideZone
} = require('../controllers/locationZoneController');

// get authentication middleware
const { protect, hasRoles } = require('../middleware/auth');

router.route('/')
  .post(protect, hasRoles('Administration', 'Management'), createLocationZone);

router.route('/locate-vehicle')
  .post(protect, isInsideZone);

router.route('/:zoneId')
  .delete(protect, hasRoles('Administration', 'Management'), deleteLocationZone)
  .put(protect, updateZoneNameDescription);

router.route('/dealership/:dealershipId')
  .get(protect, getLocationZones);

module.exports = router;