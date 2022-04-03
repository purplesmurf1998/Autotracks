const mongoose = require("mongoose");
const IO = require('../utils/serverIO');
const EventSchema = new mongoose.Schema({
  // type of the event
  event_type: {
    type: String,
    enum: [
      'vehicle_sale_pending',
      'vehicle_approved',
      'vehicle_delivered',
      'vehicle_missing',
      'vehicle_moved',
      'vehicle_found',
      'vehicle_deleted',
      'transaction_modified',
    ],
    required: [true, 'An event must have an event type.']
  },
  dealership: {
    type: mongoose.Schema.ObjectId,
    ref: 'Dealership',
    required: [true, 'An event must be associated to a dealership.']
  },
  // vehicle the event is attached to
  vehicle: {
    type: mongoose.Schema.ObjectId,
    ref: 'Vehicle',
    required: [true, 'An event must be associated to a vehicle.']
  },
  //User first and last name that initiated the event
  user: {
    type: String,
    required: [true, 'An event must be associated to a user.']
  },
  // title of the event / main label
  title: {
    type: String,
    required: [true, 'An event must have a title and a description.']
  },
  // more detailed description of the event
  description: {
    type: String,
    required: [true, 'An event must have a title and a description.']
  },
  // the observers that have viewed the event / message (to remove the notification in the front end)
  viewers: {
    type: [mongoose.Schema.ObjectId],
    ref: 'User',
    default: []
  },
  // timestamp of the event
  timestamp: {
    type: Date,
    default: Date.now
  }
});

EventSchema.post('save', async function (_next) {
  // socket.io emits the event type to the dealership's room so that
  // every running frontend inside the room gets a notification

  // simulates the notify() method
  IO.getInstance().notifySubscribers(this);
  // we also need to send an email to all the users inside the dealership
  // subscribed to the event type to alert them of the new event for those
  // that are subscribed but aren't connected

  // TODO: code that sends an email
});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;