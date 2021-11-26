const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const VehicleProperty = require('../models/VehicleProperty')

// @desc        Get all vehicle property models for a specific dealership
// @route       GET /api/v1/dealerships/:dealershipId/vehicles/properties
// @access      Private
exports.getVehicleProperties = asyncHandler(async (req, res, next) => {
  console.log('*****GET VEHICLE PROPERTIES*****');
  // // copy req.query
  // const reqQuery = { ...req.query };
  // // fields to exclude from filtering;
  // const removeFields = ['select', 'sort'];
  // // loop over fields to remove them from reqQuery
  // removeFields.forEach(param => delete reqQuery[param]);
  console.log(req);
  let query = VehicleProperty.find({dealership: req.params.dealershipId});
  // sort results
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('position');
  }
  // run query
  const vehicleProperties = await query;

  res.status(200).json({
    success: true,
    count: vehicleProperties.length,
    payload: vehicleProperties
  });
});

// @desc        Create a new vehicle property model
// @route       POST /api/v1/dealerships/:dealershipId/vehicles/properties
// @access      Private
exports.createVehicleProperty = asyncHandler(async (req, res, next) => {
  console.log('*****CREATE VEHICLE PROPERTY*****');
  const newProperty = req.body;

  const numProperties = await VehicleProperty.find({ dealership: req.params.dealershipId });
  const position = numProperties.length + 1;
  newProperty.position = position;
  newProperty.dealership = req.params.dealershipId;
  //console.log(req);

  console.log(newProperty);
  const newVehicleProperty = await VehicleProperty.create(newProperty);

  res.status(200).json({ success: true, payload: newVehicleProperty })
});

// @desc        Update a specific vehicle property model
// @route       PUT /api/v1/dealerships/:dealershipId/vehicles/properties/:propertyId
// @access      Private
exports.updateVehicleProperty = asyncHandler(async (req, res, next) => {
  console.log('*****UPDATE VEHICLE PROPERTY*****');
  // find vehicle property model to update
  console.log(req.body);
  const vehicleProperty = await VehicleProperty.findByIdAndUpdate(req.params.propertyId, req.body, {
    new: true,
    runValidators: true
  });
  // return error if no vehicle found
  if (!vehicleProperty) {
    return next(new ErrorResponse(`Vehicle property not found with id ${req.params.propertyId}`, 404));
  }
  // return data
  res.status(200).json({ success: true, payload: vehicleProperty });
});

// @desc        Delete a specific vehicle
// @route       DELETE /api/v1/dealerships/:dealershipId/vehicles/properties/:propertyId
// @access      Private
exports.deleteVehicleProperty = asyncHandler(async (req, res, next) => {
  console.log('*****DELETE VEHICLE PROPERTY*****');
  // find vehicle property to delete
  const vehicleProperty = await VehicleProperty.findById(req.params.propertyId);
  // return error if no vehicle found
  if (!vehicleProperty) {
    return next(new ErrorResponse(`Vehicle property not found with id ${req.params.propertyId}`, 404));
  }
  const dealershipId = vehicleProperty.dealership;
  const oldPosition = vehicleProperty.position;
  // delete vehicle
  vehicleProperty.remove();
  // cascade positions for every property with a position above the deleted property's position
  const cascadeProperties = await VehicleProperty.find({ dealership: dealershipId, position: { $gt: oldPosition } }).sort('position');
  cascadeProperties.forEach(property => {
    property.position = property.position - 1;
    property.save();
  })
  // return data
  res.status(200).json({ success: true, payload: {} });
});

// @desc        Update the position of all vehicle properties in batch
// @route       PUT /api/v1/dealerships/:dealershipId/vehicles/properties/positions
// @access      Private
exports.updateVehiclePropertyPositions = asyncHandler(async (req, res, next) => {
  // body of the request should have the list of vehicle properties in the new order
  // go through the list and change the positions in the backend to their new index
  console.log('*****UPDATE VEHICLE PROPERTY POSITIONS*****');
  
  const vehicleProperties = req.body.properties;
  let newProperties = [];

  for (let i = 0; i < vehicleProperties.length; i++) {
    // find the vehicle property
    const property = await VehicleProperty.findByIdAndUpdate(
      vehicleProperties[i]._id,
      {
        position: i + 1
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!property) {
      return next(new ErrorResponse(`Vehicle property not found with id ${vehicleProperties[i]._id}`, 404));
    }

    // add the property to the new list
    newProperties.push(property);
  }

  res.status(200).json({ success: true, payload: newProperties });
});