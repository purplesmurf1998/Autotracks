const mongoose = require("mongoose");
//const io = 
const EventSchema = new mongoose.Schema({
  // type of the event
  event_type: {
    type: String,
    enum: ['vehicle_sale_pending', 'vehicle_sold', 'vehicle_delivered', 'vehicle_missing', 'vehicle_moved', 'vehicle_found'],
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

EventSchema.post('save', async function (next) {
  // socket.io notifies every running frontend to fetch to the api
  require("../utils/serverIO").io().emit(this.event_type, this);
});

const Event = mongoose.model('Event', EventSchema);


module.exports = Event;