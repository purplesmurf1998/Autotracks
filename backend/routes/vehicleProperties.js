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
//hasPermissions need to be refactored to has roles, with a possibility of a complete removal

const { protect, hasPermissions } = require('../middleware/auth');

router.route('/')
  .post(protect, hasPermissions('Add Vehicle Property'), createVehicleProperty)
  .get(protect, hasPermissions('View Vehicle Properties'), getVehicleProperties)
  .put(protect, hasPermissions('Edit Vehicle Properties'), updateVehiclePropertyPositions);

router.route('/:propertyId')
  .put(protect, hasPermissions('Edit Vehicle Properties'), updateVehicleProperty)
  .delete(protect, hasPermissions('Delete Vehicle Properties'), deleteVehicleProperty);

module.exports = router;