const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const LocationZone = require('../models/LocationZone');
const Vehicle = require('../models/Vehicle');

// @desc    Create a location zone
// @route   POST /api/v1/locations/zones/
// @access  Public
exports.createLocationZone = asyncHandler(async (req, res, next) => {
  const { path } = req.body;

  // check that the path has a minimum of 3 vertices
  if (path.length < 3) {
    return next(
      new ErrorResponse('A zone must have a defined perimeter with at least 3 points.', 400)
    );
  }

  let locationBody = req.body;
  // append the center to the body
  locationBody.center = getPolyginCentroidAvg(path);

  const locationZone = await LocationZone.create(locationBody);

  res.status(201).json({
    success: true,
    payload: locationZone
  })
});

// @desc    Get location zones for a dealership
// @route   POST /api/v1/locations/zones/dealership/:dealershipId
// @access  Public
exports.getLocationZones = asyncHandler(async (req, res, next) => {
  let locationZones = await LocationZone.find({ dealership: req.params.dealershipId });

  for (let i = 0; i < locationZones.length; i++) {
    let vehicleCount = await Vehicle.countDocuments({ zone: locationZones[i]._id });
    locationZones[i].vehicleCount = vehicleCount;
    locationZones[i].save();
  }

  res.status(200).json({
    success: true,
    payload: locationZones
  })
});

// @desc    Delete a location zone from a dealership
// @route   DELETE /api/v1/locations/zones/:zoneId
// @access  Public
exports.deleteLocationZone = asyncHandler(async (req, res, next) => {
  await LocationZone.findByIdAndDelete(req.params.zoneId);

  res.status(200).json({
    success: true,
    payload: {}
  })
});

// @desc    Update a location zone name or description
// @route   PUT /api/v1/locations/zones/:zoneId
// @access  Public
exports.updateZoneNameDescription = asyncHandler(async (req, res, next) => {
  const zone = await LocationZone.findByIdAndUpdate(req.params.zoneId, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    payload: zone
  })
});

function getPolyginCentroidAvg(path) {
  // get the centroid of a polygon by taking the average of x, and the average of y

  let lngAverage = 0;
  let latAverage = 0;

  path.forEach(vertex => {
    lngAverage += vertex.lng;
    latAverage += vertex.lat;
  })

  lngAverage /= path.length;
  latAverage /= path.length;

  const center = {
    lat: latAverage,
    lng: lngAverage
  }

  return center;
}