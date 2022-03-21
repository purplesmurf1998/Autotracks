const express = require('express');
const router = express.Router({ mergeParams: true });

const {
  getVehicleProperties,
  createVehicleProperty,
  updateVehicleProperty,
  deleteVehicleProperty,
  updateVehiclePropertyPositions
} = require('../controllers/vehiclePropertyController');

// get authentication middleware
const { protect, hasRoles } = require('../middleware/auth');

router.route('/')
  .post(protect, hasRoles('Administration', 'Management'), createVehicleProperty)
  .get(protect, getVehicleProperties)
  .put(protect, hasRoles('Administration', 'Management'), updateVehiclePropertyPositions);

router.route('/:propertyId')
  .put(protect, hasRoles('Administration', 'Management'), updateVehicleProperty)
  .delete(protect, hasRoles('Administration', 'Management'), deleteVehicleProperty);

module.exports = router;