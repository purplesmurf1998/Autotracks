const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Vehicle = require('../models/Vehicle');
const Dealership = require('../models/Dealership');
const Sale = require('../models/VehicleSale');

// @desc        Get all vehicles for a specific dealership
// @route       GET /api/v1/inventory/dealership/:dealershipId?interiorColor=Black
// @access      Private
exports.getVehicles = asyncHandler(async (req, res, next) => {

  // grab the dealership_ID from the body and verify that the dealership exists
  const dealership = await Dealership.findById(req.params.dealershipId);

  // no dealership found
  if (!dealership) {
    return next(
      new ErrorResponse(`This dealership ID ${req.params.dealershipId} does not exist. Cannot return a list of vehicls without a valid dealership.`, 404)
    );
  }

  let query = Vehicle.find({ dealership: req.params.dealershipId }).populate('zone');
  let inventory_query = Vehicle.count({ dealership: req.params.dealershipId, delivered: { $ne: true } });

  // run query
  const vehicles = await query;
  const inventory_vehicle = await inventory_query;

  res.status(200).json({
    success: true,
    count: vehicles.length,
    inventoryCount: inventory_vehicle,
    payload: vehicles
  });
});

// @desc        Get only not-sold vehicles for a specific dealership
// @route       GET /api/v1/inventory/dealership/:dealershipId/notSold
// @access      Private
exports.getNotSoldVehicles = asyncHandler(async (req, res, next) => {

  // grab the dealership_ID from the body and verify that the dealership exists
  const dealership = await Dealership.findById(req.params.dealershipId);

  // no dealership found
  if (!dealership) {
    return next(
      new ErrorResponse(`This dealership ID ${req.params.dealershipId} does not exist. Cannot return a list of vehicls without a valid dealership.`, 404)
    );
  }

  let query = Vehicle.find({ dealership: req.params.dealershipId, sale: null});
  let inventory_query = Vehicle.count({ dealership: req.params.dealershipId, delivered: { $ne: true }, sale: null });

  // run query
  const vehicles = await query;
  const inventory_not_sold_vehicle = await inventory_query;

  res.status(200).json({
    success: true,
    count: vehicles.length,
    inventoryNotSoldCount: inventory_not_sold_vehicle,
    payload: vehicles
  });
});

// @desc        Get count of stale vehicles for a specific dealership
// @route       GET /api/v1/inventory/dealership/:dealershipId/stale
// @access      Private
exports.getStaleVehicles = asyncHandler(async (req, res, next) => {

  // grab the dealership_ID from the body and verify that the dealership exists
  const dealership = await Dealership.findById(req.params.dealershipId);
  let staleTime = parseInt(req.query.staleTime);
  //console.log("[API] staleTime is "+staleTime);

  // no dealership found
  if (!dealership) {
    return next(
      new ErrorResponse(`This dealership ID ${req.params.dealershipId} does not exist. Cannot return a list of vehicls without a valid dealership.`, 404)
    );
  }

  // Aggregation pipeline to find number of stale vehicles
  let stale_vehicles_count_query = Vehicle.aggregate([
      // Get cars that are registered to the dealership and aren't sold
    {
      $match: {
        dealership: dealership._id,
        sale: null,
        delivered: false
      }
    },
      // Filter the fields and add a new one using $dateDiff to get the elapsed time between now and the added date
    {
      $project: {
        _id: 1,
        date_added: 1,
        months_since_added: {
          $dateDiff: {
            startDate: "$date_added",
            endDate: "$$NOW",
            unit: "month"
          }
        }
      }
    },
      // Filter the results according to the "staleness" threshold (default 1 month)
    {
      $match: {
        months_since_added: {
          $gt: staleTime
        }
      }
    },
      // Count the results
    {
      $count: "stale_vehicles_count"
    }
  ])

  const stale_vehicles_res = await stale_vehicles_count_query;
  //(stale_vehicles_res)
  let stale_vehicles_count = null;
  if (stale_vehicles_res.length === 0) {
    stale_vehicles_count = 0
  }
  else {
    stale_vehicles_count = stale_vehicles_res[0].stale_vehicles_count
  }
  // Send the result in the payload
  res.status(200).json({
    success: true,
    staleVehiclesCount: stale_vehicles_count
  });
});


// @desc        Get inventory count per vehicle property
// @route       GET /api/v1/inventory/dealership/:dealershipId/visual3/:property
// @access      Private
exports.getVehiclesDashboardV3 = asyncHandler(async (req, res, next) => {

  // grab the dealership_ID from the body and verify that the dealership exists
  const dealership = await Dealership.findById(req.params.dealershipId);

  // no dealership found
  if (!dealership) {
    return next(
      new ErrorResponse(`This dealership ID ${req.params.dealershipId} does not exist. Cannot return a list of vehicls without a valid dealership.`, 404)
    );
  }

  //Validate the property entered

  let prop = req.params.property
  let query = Vehicle.find({ dealership: req.params.dealershipId, delivered: { $ne: true } }).distinct('properties.' + prop);
  let results = await query;

  end_results = [];
  for (let i = 0; i < results.length; i++) {
    let filter = { dealership: req.params.dealershipId, delivered: { $ne: true } };
    filter['properties.' + prop] = results[i];
    let query2 = Vehicle.count(filter);
    let value_count = await query2;
    let prop_object = {};
    prop_object.value = results[i];
    prop_object.count = value_count;
    end_results.push(prop_object);
  }

  res.status(200).json({
    success: true,
    payload: end_results,
  });
});

// @desc        Get a specific vehicle
// @route       GET /api/v1/inventory/vehicle/:vehicleId
// @access      Private
exports.getVehicle = asyncHandler(async (req, res, next) => {
  let vehicle = await Vehicle.findById(req.params.vehicleId).populate('zone');

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

  // try to update the vehicle
  const newVehicle = await Vehicle.findByIdAndUpdate(req.params.vehicleId, req.body, {
    runValidators: true,
    new: true
  }).populate('zone');
  // if successful, check the old properties and the new ones to see what was changed and create events accordingly
  if (!newVehicle) {
    return next(new ErrorResponse(`Vehicle with id ${req.params.vehicleId} was unable to be updated.`, 404));
  }

  // return data
  res.status(200).json({ success: true, payload: newVehicle });
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
  res.status(201).json({
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

  //Check if a vehicle has a sale object then delete it.
  if (!!vehicle.sale) {
    const sale = await Sale.findById(vehicle.sale);
    sale.remove();
  }
  //TODO: Delete anything related to the vehicle. This can be done in the Vehicle model using middleware.
  vehicle.remove();

  res.status(200).json({
    success: true,
    payload: {}
  })
});