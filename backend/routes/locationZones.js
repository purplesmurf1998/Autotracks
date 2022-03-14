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

const { protect, hasRoles } = require('../middleware/auth');

router.route('/')
  .post(protect, hasRoles('Administration', 'Management'), createLocationZone);

router.route('/:zoneId')
  .delete(protect, hasRoles('Administration', 'Management'), deleteLocationZone)
  .put(protect, hasRoles('Administration', 'Management'), updateZoneNameDescription);

router.route('/dealership/:dealershipId')
  .get(protect, hasRoles('Administration', 'Management'), getLocationZones);

module.exports = router;