const express = require('express');
const router = express.Router();

const {
  getVehicle,
  getVehicles,
  getVehiclesDashboardV3,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getNotSoldVehicles
} = require('../controllers/vehicleController');

// get authentication middleware
const { protect, hasPermissions } = require('../middleware/auth');

router.route('/')
  .post(protect, hasPermissions('Add Vehicles'), createVehicle);

router.route('/dealership/:dealershipId')
  .get(protect, hasPermissions('View Vehicles'), getVehicles);

router.route('/dealership/:dealershipId/notSold')
    .get(protect, hasPermissions('View Vehicles'), getNotSoldVehicles);

//Add permissions  
router.route('/dealership/:dealershipId/visual3/:property')
.get(protect, getVehiclesDashboardV3);

router.route('/vehicle/:vehicleId')
  .get(protect, hasPermissions('View Vehicles'), getVehicle)
  .put(protect, hasPermissions('Edit Vehicles'), updateVehicle)
  .delete(protect, hasPermissions('Delete Vehicles'), deleteVehicle);

module.exports = router;