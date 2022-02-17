const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const LocationZone = require('../models/LocationZone');

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
  //locationBody.center = getPolygonCentroidSum(path);
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
  const locationZones = await LocationZone.find({ dealership: req.params.dealershipId });

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

function getPolygonCentroidSum(path) {
  // get the centroid of a polygon by using the formula in http://paulbourke.net/geometry/polygonmesh/centroid.pdf

  /*
    Calculating the center of mass of the outlined zone:

    Area of a polygon is defined as the following:
        A = 1/2 * SUM(x(i)y(y+1) - x(i+1)y(i)) for i=0 TO N-1
    
    X coordinate of the center is defined as the following:
        Cx = 1/(6A) * SUM((x(i) + x(i+1))*(x(i)y(i+1) - x(i+1)y(i))) for i=0 TO N-1
    Y coordinate of the center is defined as the following:
        Cy = 1/(6A) * SUM((y(i) + y(i+1))*(x(i)y(i+1) - x(i+1)y(i))) for i=0 TO N-1

    Y = latitude
    X = longitude
    */

  // get the first point in the path and add it as the last point
  path.push(path[0]);

  // calculate the area
  let zoneArea = 0
  let currentSum = 0;
  for (let i = 0; i < path.length - 1; i++) {
    let x = path[i].lng;
    let xPlusOne = path[i + 1].lng;
    let y = path[i].lat;
    let yPlusOne = path[i + 1].lat;

    currentSum = (x * yPlusOne) - (xPlusOne * y);
    zoneArea += currentSum;
  }

  zoneArea = zoneArea / 2;

  // calculate the center X coordinate
  let xCenter = 0;
  currentSum = 0;
  for (let i = 0; i < path.length - 1; i++) {
    let x = path[i].lng;
    let xPlusOne = path[i + 1].lng;
    let y = path[i].lat;
    let yPlusOne = path[i + 1].lat;

    currentSum = (x + xPlusOne) * ((x * yPlusOne) - (xPlusOne * y));
    xCenter += currentSum;
  }

  xCenter = xCenter / (6 * zoneArea);

  // calculate the center Y coordinate
  let yCenter = 0;
  currentSum = 0;
  for (let i = 0; i < path.length - 1; i++) {
    let x = path[i].lng;
    let xPlusOne = path[i + 1].lng;
    let y = path[i].lat;
    let yPlusOne = path[i + 1].lat;

    currentSum = (y + yPlusOne) * ((x * yPlusOne) - (xPlusOne * y));
    yCenter += currentSum;
  }

  yCenter = yCenter / (6 * zoneArea);

  // create the center object
  const center = {
    lat: yCenter,
    lng: xCenter
  }

  return center;
}