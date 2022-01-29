const express = require('express');
const router = express.Router();

const {
  getVehicleList,
  getVehicleLists,
  createVehicleList,
  deleteVehicleLists,
  addVehiclesToList,
  deleteVehiclesFromList,
  updateVehicleList
} = require('../controllers/vehicleListController');

// get authentication middleware
const { protect, hasPermissions } = require('../middleware/auth');

router.route('/')
  .post(protect, createVehicleList);

router.route('/:vehicleListId')
  .get(protect, getVehicleList)
  .put(protect, updateVehicleList);

router.route('/user/:userId/delete')
  .post(protect, deleteVehicleLists, getVehicleLists);

router.route('/user/:userId')
  .get(protect, getVehicleLists);

router.route('/:vehicleListId/add')
  .post(protect, addVehiclesToList);

router.route('/:vehicleListId/delete')
  .post(protect, deleteVehiclesFromList);

module.exports = router;