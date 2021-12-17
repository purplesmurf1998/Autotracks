const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Vehicle = require('../models/Vehicle')

// @desc        Get all vehicles for a specific dealership
// @route       GET /api/v1/inventory/dealership/:dealershipId
// @access      Private
exports.getVehicles = asyncHandler(async (req, res, next) => {
  let query = Vehicle.find({ dealership: req.params.dealershipId });
  // run query
  const vehicles = await query;

  res.status(200).json({
    success: true,
    count: vehicles.length,
    payload: vehicles
  });
});

// @desc        Get a specific vehicle
// @route       GET /api/v1/inventory/vehicle/:vehicleId
// @access      Private
exports.getVehicle = asyncHandler(async (req, res, next) => {
  let vehicle = await Vehicle.findById(req.params.vehicleId);

  if (!vehicle) {
    return next(
      new ErrorResponse(`Vehicle with id ${req.params.vehicleId} not found.`)
    );
  }

  res.status(200).json({
    success: true,
    payload: vehicle
  });
});

// @desc        Update a specific vehicle
// @route       PUT /api/v1/inventory/vehicle/:vehicleId
// @access      Private
exports.updateVehicle = asyncHandler(async (req, res, next) => {

});

// @desc        Create a specific vehicle
// @route       POST /api/v1/inventory
// @access      Private
exports.createVehicle = asyncHandler(async (req, res, next) => {
  const reqBody = req.body;

  // try to create the new vehicle
  const newVehicle = await Vehicle.create(reqBody);

  // return an error response if no vehicle was created
  if (!newVehicle) {
    return next(
      new ErrorResponse("Vehicle was not created. Please validate your input.")
    );
  }

  // return a success response
  res.status(200).json({
    success: true,
    payload: newVehicle
  })
});

// @desc        Delete a specific vehicle
// @route       DELETE /api/v1/inventory/vehicle/:vehicleId
// @access      Private
exports.deleteVehicle = asyncHandler(async (req, res, next) => {

});