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
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createVehicle);

router.route('/dealership/:dealershipId')
  .get(protect, getVehicles);

router.route('/vehicle/:vehicleId')
  .get(protect, getVehicle)
  .put(protect, updateVehicle)
  .delete(protect, deleteVehicle);

module.exports = router;