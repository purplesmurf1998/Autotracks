const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Vehicle = require('../models/Vehicle')

// @desc        Get all vehicles for a specific dealership
// @route       GET /api/v1/inventory/:dealershipId
// @access      Private
exports.getVehicles = asyncHandler(async (req, res, next) => {
  
});

// @desc        Get a specific vehicle
// @route       GET /api/v1/inventory/vehicle/:vehicleId
// @access      Private
exports.getVehicle = asyncHandler(async (req, res, next) => {

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