const express = require('express');
const router = express.Router();

const {
  getVehicle,
  getVehicles,
  getVehiclesDashboardV3,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getNotSoldVehicles,
  getStaleVehicles
} = require('../controllers/vehicleController');

const {
  createEvent
} = require('../controllers/eventsController');


const {
  createHistory
} = require('../controllers/historyController');

// get authentication middleware
const { protect, hasPermissions } = require('../middleware/auth');

router.route('/')
  .post(protect, hasPermissions('Add Vehicles'), createVehicle);

router.route('/dealership/:dealershipId')
  .get(protect, hasPermissions('View Vehicles'), getVehicles);

router.route('/dealership/:dealershipId/notSold')
    .get(protect, hasPermissions('View Vehicles'), getNotSoldVehicles);

router.route('/dealership/:dealershipId/stale')
    .get(protect, getStaleVehicles);

//Add permissions  
router.route('/dealership/:dealershipId/visual3/:property')
.get(protect, getVehiclesDashboardV3);

router.route('/vehicle/:vehicleId')
  .get(protect, hasPermissions('View Vehicles'), getVehicle)
  .put(protect, hasPermissions('Edit Vehicles'), createEvent, createHistory, updateVehicle)
  .delete(protect, hasPermissions('Delete Vehicles'), createEvent, createHistory, deleteVehicle);

module.exports = router;