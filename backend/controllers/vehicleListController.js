const VehicleList = require('../models/VehicleList');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Create a vehicle list
// @route   POST /api/v1/vehicle-list
// @access  Private
exports.createVehicleList = asyncHandler(async (req, res, next) => {

  // create the list passed in the request body and let mongoose apply the proper validations
  const vehicleList = await VehicleList.create(req.body);

  if (!vehicleList) {
    // something went wront...validate with Abdul if this check ever runs
    return next(
      new ErrorResponse(`User not found.`, 404)
    );
  }

  // send response
  res.status(201).json({
    success: true,
    payload: vehicleList
  });
});

// @desc    Get a specific vehicle list
// @route   GET /api/v1/vehicle-list/:vehicleListId
// @access  Private
exports.getVehicleList = asyncHandler(async (req, res, next) => {
  
  // find the vehicle list by id
  const vehicleList = await VehicleList.findById(req.params.vehicleListId).populate('vehicles');

  if (!vehicleList) {
    // something went wront...validate with Abdul if this check ever runs
    return next(
      new ErrorResponse(`User not found.`, 404)
    );
  }

  // send response
  res.status(200).json({
    success: true,
    payload: vehicleList
  });
});

// @desc    Get a all vehicle lists for a specific user
// @route   GET /api/v1/vehicle-list/user/:userId
// @access  Private
exports.getVehicleLists = asyncHandler(async (req, res, next) => {
  
  // find the vehicle list owned by the provided userId
  const vehicleList = await VehicleList.find({owner: req.params.userId});

  // send response
  res.status(200).json({
    success: true,
    payload: vehicleList
  });
});

// @desc    Delete a vehicle list
// @route   DELETE /api/v1/vehicle-list/:vehicleListId
// @access  Private
exports.deleteVehicleList = asyncHandler(async (req, res, next) => {
  
  // find the vehicle list owned by the provided userId
  const vehicleList = await VehicleList.findByIdAndDelete(req.params.vehicleListId);

  // send response
  res.status(200).json({
    success: true,
    payload: {}
  });
});

// @desc    Add a vehicle to the list
// @route   POST /api/v1/vehicle-list/add/:vehicleListId
// @access  Private
exports.addVehiclesToList = asyncHandler(async (req, res, next) => {
  
  // find the vehicle list owned by the provided userId
  const vehicleList = await VehicleList.find({owner: req.params.vehicleListId});

  if (!vehicleList) {
    // something went wront...validate with Abdul if this check ever runs
    return next(
      new ErrorResponse(`Vehicle list not found.`, 404)
    );
  }

  const vehicleIds = req.body.vehicles;
  const newVehicles = [];
  const oldVehicles = vehicleList.vehicles;

  // get all the vehicle objects ids from the provided string ids
  // must use for loop since forEach doesn't work properly with await clauses
  for (let i = 0; i < vehicleIds.length; i++) {
    let newVehicle = await Vehicle.findById(vehicleIds[i]);

    if (!newVehicle) {
      return next(
        new ErrorResponse(`At least one of the vehicles added was not not found.`, 404)
      );
    }

    newVehicles.push(newVehicle._id);
  }

  // concatenate the old array with the new vehicles
   const vehicles = oldVehicles.concat(newVehicles);

   // add to the vehicle list and save
   vehicleList.vehicles = vehicles;
   vehicleList.save();

  // send response
  res.status(201).json({
    success: true,
    payload: vehicleList
  });
});

// @desc    Delete a vehicle from the list
// @route   DELETE /api/v1/vehicle-list/delete/:vehicleListId
// @access  Private
exports.deleteVehiclesFromList = asyncHandler(async (req, res, next) => {
  
  // find the vehicle list owned by the provided userId
  const vehicleList = await VehicleList.find({owner: req.params.vehicleListId});

  if (!vehicleList) {
    // something went wront...validate with Abdul if this check ever runs
    return next(
      new ErrorResponse(`Vehicle list not found.`, 404)
    );
  }

  const vehicleIds = req.body.vehicles;
  let vehicles = vehicleList.vehicles;

  vehiclesIds.forEach(vehicleId => {
    let index = vehicles.findIndex(objectId => objectId.toString() == vehicleId);
    vehicles.splice(index, 1);
  })

   // add to the vehicle list and save
   vehicleList.vehicles = vehicles;
   vehicleList.save();

  // send response
  res.status(201).json({
    success: true,
    payload: vehicleList
  });
});