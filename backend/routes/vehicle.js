const express = require('express');
const router = express.Router();

const {
  getVehicle,
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicleController');

// get authentication middleware
const { protect, hasPermissions } = require('../middleware/auth');

router.route('/')
  .post(protect, hasPermissions('Add Vehicles'), createVehicle);

router.route('/dealership/:dealershipId')
  .get(protect, hasPermissions('View Vehicles'), getVehicles);//getVehicle

router.route('/vehicle/:vehicleId')
  .get(protect, hasPermissions('View Vehicles'), getVehicles)
  .put(protect, hasPermissions('Edit Vehicles'), updateVehicle)
  .delete(protect, hasPermissions('Delete Vehicles'), deleteVehicle);

module.exports = router;