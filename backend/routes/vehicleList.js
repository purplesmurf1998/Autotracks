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

const { protect, hasRoles } = require('../middleware/auth');

router.route('/')
  .post(protect, hasRoles('Administration', 'Management', 'Sales Rep'), createVehicleList);

router.route('/:vehicleListId')
  .get(protect, hasRoles('Administration', 'Management', 'Sales Rep'), getVehicleList)
  .put(protect, updateVehicleList);

router.route('/user/:userId/delete')
  .post(protect, hasRoles('Administration', 'Management', 'Sales Rep'), deleteVehicleLists, getVehicleLists);

router.route('/user/:userId')
  .get(protect, hasRoles('Administration', 'Management', 'Sales Rep'), getVehicleLists);

router.route('/:vehicleListId/add')
  .post(protect, hasRoles('Administration', 'Management', 'Sales Rep'), addVehiclesToList);

router.route('/:vehicleListId/delete')
  .post(protect, hasRoles('Administration', 'Management', 'Sales Rep'), deleteVehiclesFromList);

module.exports = router;