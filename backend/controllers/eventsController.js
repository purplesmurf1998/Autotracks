const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Event = require('../models/Event');
const Vehicle = require('../models/Vehicle');
const Sale = require('../models/VehicleSale');

// @desc        Create an event for a specific vehicle
// @access      Private
exports.createEvent = asyncHandler(async (req, res, next) => {
  // This endpoint is used for creating new events for users
  
  var body = {};
  //Transaction API Events
  if (req.originalUrl.indexOf('/api/v1/inventory/details/sale') > -1) {
    if (req.method=='POST')
    {
      //fetch vehicle details
      const vehicle = await Vehicle.findById(req.body.vehicle);
      // return error if no vehicle found
      if (!vehicle) {
        return next(new ErrorResponse(`Vehicle not found with id ${req.params.vehicleId}`, 404));
      }
      body = {
        event_type: 'vehicle_sale_pending',
        dealership: req.body.dealership,
        vehicle: req.body.vehicle,
        user: `${req.user.first_name} ${req.user.last_name}`,
        title: 'New Transaction',
        viewers: [req.user._id],
        description: `A new transaction has been created for the vehicle with vin: ${vehicle.vin} by ${req.user.first_name} ${req.user.last_name}`,
      }
    }
    // When a transaction has been approved. EventType=vehicle_approved
    else if (req.method=='PUT') {
      const sale = await Sale.findById(req.params.saleId)
      // return error if no sale found
      if (!sale) {
        return next(new ErrorResponse(`Sale not found with id ${req.params.saleId}`, 404));
      }
      const vehicle = await Vehicle.find({ sale: req.params.saleId });
      // return error if no vehicle found
      if (!vehicle) {
        return next(new ErrorResponse(`Vehicle not found with id ${req.params.vehicleId}`, 404));
      }
      if (!!req.body.date_approved) {
        body = {
          event_type: 'vehicle_approved',
          dealership: vehicle[0].dealership,
          vehicle: vehicle[0]._id,
          user: `${req.user.first_name} ${req.user.last_name}`,
          title: 'Transaction Approved',
          viewers: [req.user._id],
          description: `A sale request has been approved for the vehicle with vin: ${vehicle[0].vin} by ${req.user.first_name} ${req.user.last_name}`,
        }
      }
      else if (!!req.body.sale_amount) {
        body = {
          event_type: 'transaction_modified',
          dealership: vehicle[0].dealership,
          vehicle: vehicle[0]._id,
          user: `${req.user.first_name} ${req.user.last_name}`,
          title: 'Transaction Modified',
          viewers: [req.user._id],
          description: `A transaction has been modified for the vehicle with vin: ${vehicle[0].vin} by ${req.user.first_name} ${req.user.last_name}`,
        }
      }
    }
  }

  //Vehicle API Events
  else if (req.originalUrl.indexOf('/api/v1/inventory/vehicle/') > - 1) {
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    // return error if no vehicle found
    if (!vehicle) {
      return next(new ErrorResponse(`Vehicle not found with id ${req.params.vehicleId}`, 404));
    }
    if (req.method == 'DELETE') {
      body = {
        event_type: 'vehicle_deleted',
        dealership: vehicle.dealership,
        vehicle: vehicle._id,
        user: `${req.user.first_name} ${req.user.last_name}`,
        title: 'Vehicle Deleted',
        viewers: [req.user._id],
        description: `A vehicle with vin: ${vehicle.vin} has been deleted by ${req.user.first_name} ${req.user.last_name}`,
      }
    }
    else if (req.method == 'PUT') {
      if (req.body.delivered) {
        body = {
          event_type: 'vehicle_delivered',
          dealership: vehicle.dealership,
          vehicle: vehicle._id,
          user: `${req.user.first_name} ${req.user.last_name}`,
          title: 'Vehicle Delivered',
          viewers: [req.user._id],
          description: `A vehicle with vin: ${vehicle.vin} has been marked delivered by ${req.user.first_name} ${req.user.last_name}`,
        }
      }
      //vehicle moved
      else if (req.body.zone) {
        body = {
          event_type: 'vehicle_moved',
          dealership: vehicle.dealership,
          vehicle: vehicle._id,
          user: `${req.user.first_name} ${req.user.last_name}`,
          title: 'Vehicle Moved',
          viewers: [req.user._id],
          description: `A vehicle with vin: ${vehicle.vin} has been moved by ${req.user.first_name} ${req.user.last_name}`,
        }
      }
      //Change the if condition later
      else if (vehicle.missing != req.body.missing) {
        if (req.body.missing) {
          body = {
            event_type: 'vehicle_missing',
            dealership: vehicle.dealership,
            vehicle: vehicle._id,
            user: `${req.user.first_name} ${req.user.last_name}`,
            title: 'Vehicle Missing',
            viewers: [req.user._id],
            description: `A vehicle with vin: ${vehicle.vin} has been marked missing by ${req.user.first_name} ${req.user.last_name}`,
          }
        }
        else {
          body = {
            event_type: 'vehicle_found',
            dealership: vehicle.dealership,
            vehicle: vehicle._id,
            user: `${req.user.first_name} ${req.user.last_name}`,
            title: 'Vehicle Found',
            viewers: [req.user._id],
            description: `A vehicle with vin: ${vehicle.vin} has been marked found by ${req.user.first_name} ${req.user.last_name}`,
          }
        }
      }
    }
  }

  //if body is defined, then create the event
  if (Object.keys(body).length !== 0) {
    await Event.create(body);
    return next();
  }
  next();
});

// @desc        Get all events from a specific dealership
// @route       GET /api/v1/events/dealership/:dealershipId
// @access      Private
exports.getEvents = asyncHandler(async (req, res, next) => {
  // This endpoint is used for fetching the new events for users
  // User's frontend will call the api at a set interval with the input types as
  // filters, looking for new events only with the input types they are subscribed to.

  let events;
  let user_name = `${req.user.first_name} ${req.user.last_name}`;
  if (!req.query.eventType) {
    // no event types passed, get all types of events
    events = await Event.find({ dealership: req.params.dealershipId, user: { $ne: user_name } }).sort({ timestamp: -1 });
  } else {
    // separate the event types into an array
    const eventTypes = req.query.eventType.split(',')
    // get the events that have the event types passed
    events = await Event.find({ dealership: req.params.dealershipId, event_type: { $in: eventTypes }, user: { $ne: user_name } }).sort({ timestamp: -1 });
  }

  res.status(200).json({
    success: true,
    payload: events
  });
});

// @desc        Get all unread events from a specific dealership for a specific user
// @route       GET /api/v1/events/dealership/:dealershipId/user/:userId
// @access      Private
exports.getUnReadEvents = asyncHandler(async (req, res, next) => {
  // specify a user and get all the unread events for that specific user

  // get the user
  const user = req.user;
  // get the event types the user is subscribed to
  const eventTypes = req.user.subscribed_events;
  // find the events in the dealership with the specific event types where the viewers array does not contain
  // the user's id
  const events = await Event.find(
    {
      dealership: req.params.dealershipId,
      event_type: { $in: eventTypes },
      viewers: { $nin: user._id }
    }
  ).sort({ timestamp: -1 });

  res.status(200).json({
    success: true,
    payload: events,
    count: events.length
  });
})

// @desc        Update an unread event to add the user who viewed it.
// @route       PUT /api/v1/events/:eventId/user/:userId
// @access      Private
exports.markEventAsRead = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const event = await Event.findById(req.params.eventId);

  // if no event found, return 404
  if (!event) {
    return next(
      new ErrorResponse(`Event not found.`, 404)
    );
  }

  // add the user ID to the list of viewers
  if (!event.viewers.includes(user._id)) {
    event.viewers.push(user._id);
  }

  await Event.findByIdAndUpdate(req.params.eventId, event, {
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    payload: event
  });
});
