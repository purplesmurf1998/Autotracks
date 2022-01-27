const express = require('express');
const router = express.Router();

const {
  getVehicleList,
  getVehicleLists,
  createVehicleList,
  deleteVehicleList,
  addVehiclesToList,
  deleteVehiclesFromList

} = require('../controllers/vehicleListController');

// get authentication middleware
const { protect, hasPermissions } = require('../middleware/auth');

router.route('/')
  .post(protect, createVehicleList);

router.route('/:vehicleListId')
  .get(protect, getVehicleList)
  .delete(protect, deleteVehicleList);

router.route('/user/:userId')
  .get(protect, getVehicleLists)

  router.route('/add/:userId')
  .post(protect, addVehiclesToList);

  router.route('/delete/:userId')
  .delete(protect, deleteVehiclesFromList);

module.exports = router;