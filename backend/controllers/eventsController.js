const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Event = require('../models/Event');

// @desc        Get all events from a specific dealership
// @route       GET /api/v1/events/dealership/:dealershipId
// @access      Private
exports.getEvents = asyncHandler(async (req, res, next) => {
  // This endpoint is used for fetching the new events for users
  // User's frontend will call the api at a set interval with the input types as
  // filters, looking for new events only with the input types they are subscribed to.

  let events;

  if (!req.query.eventType) {
    // no event types passed, get all types of events
    events = await Event.find({ dealership: req.params.dealershipId }).sort({ timestamp: 1 });
  } else {
    // separate the event types into an array
    const eventTypes = req.query.eventType.split(',')
    // get the events that have the event types passed
    events = await Event.find({ dealership: req.params.dealershipId, event_type: { $in: eventTypes } }).sort({ timestamp: 1 });
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
  ).sort({ timestamp: 1 });

  res.status(200).json({
    success: true,
    payload: events,
    count: events.length
  });
})

// @desc        Get all unread events from a specific dealership for a specific user
// @route       GET /api/v1/events/:eventId/user/:userId
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
  let viewers = event.viewers;
  viewers.push(user._id);
  event.viewers = viewers;
  // save the event
  event.save()

  res.status(201).json({
    success: true,
    payload: event
  });
});
