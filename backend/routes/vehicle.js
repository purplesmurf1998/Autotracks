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
const { protect, hasRoles } = require('../middleware/auth');

router.route('/')
  .post(protect, hasRoles('Administration', 'Management', 'Reception'), createVehicle);

router.route('/dealership/:dealershipId')
  .get(protect, getVehicles);

router.route('/dealership/:dealershipId/notSold')
    .get(protect, getNotSoldVehicles);

router.route('/dealership/:dealershipId/stale')
    .get(protect, getStaleVehicles);

//Add permissions  
router.route('/dealership/:dealershipId/visual3/:property')
  .get(protect, hasRoles('Administration', 'Management', 'Sales Rep'), getVehiclesDashboardV3);

router.route('/vehicle/:vehicleId')
  .get(protect, getVehicle)
  .put(protect, createEvent, createHistory, updateVehicle)
  .delete(protect, hasRoles('Administration', 'Management'), createEvent, createHistory, deleteVehicle);

module.exports = router;