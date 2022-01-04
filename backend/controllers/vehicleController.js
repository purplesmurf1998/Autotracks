const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Vehicle = require('../models/Vehicle');
const Dealership = require('../models/Dealership');

// @desc        Get all vehicles for a specific dealership
// @route       GET /api/v1/inventory/dealership/:dealershipId
// @access      Private
exports.getVehicles = asyncHandler(async (req, res, next) => {

  // grab the dealership_ID from the body and verify that the dealership exists
  const dealership = await Dealership.findById(req.params.dealershipId);

  // no dealership found
  if (!dealership) {
      return next(
          new ErrorResponse(`This dealership ID ${req.params.dealershipId} with this not found. Cannot return a list of vehicls without a valid dealership.`, 404)
      );
  }
  
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
      new ErrorResponse(`Vehicle with id ${req.params.vehicleId} not found.`, 404)
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
  // find vehicle property model to update
  const vehicle = await Vehicle.findByIdAndUpdate(req.params.vehicleId, req.body, {
    new: true,
    runValidators: true
  });
  // return error if no vehicle found
  if (!vehicle) {
    return next(new ErrorResponse(`Vehicle property not found with id ${req.params.vehicleId}`, 404));
  }
  // return data
  res.status(200).json({ success: true, payload: vehicle });
});

// @desc        Create a specific vehicle
// @route       POST /api/v1/inventory
// @access      Private
exports.createVehicle = asyncHandler(async (req, res, next) => {
  const reqBody = req.body;

  // grab the dealership_ID from the body and verify that the dealership exists
  const dealership = await Dealership.findById(req.body.dealership);

  // no dealership found
  if (!dealership) {
      return next(
          new ErrorResponse(`This is dealership ID ${req.body.dealership} was not found. Cannot create a vehicle without a valid dealership.`, 400)
      );
  }

  // try to create the new vehicle
  const newVehicle = await Vehicle.create(reqBody);

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
  // find vehicle property to delete
  const vehicle = await Vehicle.findById(req.params.vehicleId);
  // return error if no vehicle found
  if (!vehicle) {
    return next(new ErrorResponse(`Vehicle not found with id ${req.params.vehicleId}`, 404));
  }
  //TODO: Delete anything related to the vehicle. This can be done in the Vehicle model using middleware.
  vehicle.remove();

  res.status(200).json({
    success: true,
    payload: {}
  })
});