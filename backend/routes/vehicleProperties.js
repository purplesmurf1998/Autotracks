const express = require('express');
const router = express.Router({ mergeParams : true });

const {
  getVehicleProperties,
  createVehicleProperty,
  updateVehicleProperty,
  deleteVehicleProperty
} = require('../controllers/vehiclePropertyController');

router.route('/')
  .post(createVehicleProperty)
  .get(getVehicleProperties);

router.route('/:propertyId')
  .put(updateVehicleProperty)
  .delete(deleteVehicleProperty);

module.exports = router;