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
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createVehicleProperty)
  .get(protect, getVehicleProperties)
  .put(protect, updateVehiclePropertyPositions);

router.route('/:propertyId')
  .put(protect, updateVehicleProperty)
  .delete(protect, deleteVehicleProperty);

module.exports = router;