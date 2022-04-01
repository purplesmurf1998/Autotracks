const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const LocationZone = require('../models/LocationZone');
const Vehicle = require('../models/Vehicle');

let INF = 10000;

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

// @desc    Update a location zone name or description
// @route   POST /api/v1/locations/zones/locate-vehicle
// @access  Public
exports.isInsideZone = asyncHandler(async (req, res, next) => {
  // need the vehicleId
  // need the latitude
  // need the longited
  console.log(req.body);
  const {
    vehicleId,
    latitude,
    longitude
  } = req.body;

  if (!vehicleId || !latitude || !longitude) {
    return next(
      new ErrorResponse('Missing vehicleId, latitude or longitude', 400)
    );
  }

  // find the vehicle
  const vehicle = await Vehicle.findById(vehicleId);

  // grab the list of zone for the vehicle's dealership
  const zones = await LocationZone.find({ dealership: vehicle.dealership });

  // for each zone, calculate if the latitude and longitude exists inside the area of the zone
  // if so, return that zone
  // if not, return null

  let locatedZone = null;

  zones.forEach(zone => {
    if (pointInsideZone(latitude, longitude, zone)) {
      locatedZone = zone;
      return;
    }
  })

  res.status(200).json({
    success: true,
    payload: locatedZone
  })
})

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// Given three collinear points p, q, r,
// the function checks if point q lies
// on line segment 'pr'
function onSegment(p, q, r) {
  if (q.x <= Math.max(p.x, r.x) &&
      q.x >= Math.min(p.x, r.x) &&
      q.y <= Math.max(p.y, r.y) &&
      q.y >= Math.min(p.y, r.y)) {
        return true;
      }
      return false;
}

// To find orientation of ordered triplet (p, q, r).
// The function returns following values
// 0 --> p, q and r are collinear
// 1 --> Clockwise
// 2 --> Counterclockwise
function orientation(p,q,r) {
  let val = (q.y - p.y) * (r.x - q.x)
              - (q.x - p.x) * (r.y - q.y);

  if (val == 0) {
    return 0; // collinear
  }
  return (val > 0) ? 1 : 2; // clock or counterclock wise
}

// The function that returns true if
// line segment 'p1q1' and 'p2q2' intersect.
function doIntersect(p1,q1,p2,q2)
{
  // Find the four orientations needed for
  // general and special cases
  let o1 = orientation(p1, q1, p2);
  let o2 = orientation(p1, q1, q2);
  let o3 = orientation(p2, q2, p1);
  let o4 = orientation(p2, q2, q1);

  // General case
  if (o1 != o2 && o3 != o4)
  {
      return true;
  }

  // Special Cases
  // p1, q1 and p2 are collinear and
  // p2 lies on segment p1q1
  if (o1 == 0 && onSegment(p1, p2, q1))
  {
      return true;
  }

  // p1, q1 and p2 are collinear and
  // q2 lies on segment p1q1
  if (o2 == 0 && onSegment(p1, q2, q1))
  {
      return true;
  }

  // p2, q2 and p1 are collinear and
  // p1 lies on segment p2q2
  if (o3 == 0 && onSegment(p2, p1, q2))
  {
      return true;
  }

  // p2, q2 and q1 are collinear and
  // q1 lies on segment p2q2
  if (o4 == 0 && onSegment(p2, q1, q2))
  {
      return true;
  }

  // Doesn't fall in any of the above cases
  return false;
}

// Returns true if the point p lies
// inside the polygon[] with n vertices
function isInside(polygon,n,p)
{
  // There must be at least 3 vertices in polygon[]
  if (n < 3)
  {
    return false;
  }

  // Create a point for line segment from p to infinite
  let extreme = new Point(INF, p.y);

  // Count intersections of the above line
  // with sides of polygon
  let count = 0, i = 0;
  do
  {
    let next = (i + 1) % n;

    // Check if the line segment from 'p' to
    // 'extreme' intersects with the line
    // segment from 'polygon[i]' to 'polygon[next]'
    if (doIntersect(polygon[i], polygon[next], p, extreme))
    {
      // If the point 'p' is collinear with line
      // segment 'i-next', then check if it lies
      // on segment. If it lies, return true, otherwise false
      if (orientation(polygon[i], p, polygon[next]) == 0)
      {
        return onSegment(polygon[i], p, polygon[next]);
      }

      count++;
    }
    i = next;
  } while (i != 0);

  // Return true if count is odd, false otherwise
  console.log(count % 2);
  return (count % 2 === 1); // Same as (count%2 == 1)
}

function pointInsideZone(lat, lng, zone) {
  // convert lat, lng and zone into points and an array of points
  let p = new Point(lng, lat)

  let polygon = [];
  zone.path.forEach(point => {
    polygon.push(new Point(point.lng, point.lat));
  })

  let n = polygon.length;
  return isInside(polygon, n, p);
}