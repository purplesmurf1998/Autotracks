const mongoose = require('mongoose');
const Comment = require('./Comment');
const History = require('./History');
const Event = require('./Event');
const VehicleSale = require('./VehicleSale');

const VehicleSchema = new mongoose.Schema({
  dealership: {
    type: mongoose.Schema.ObjectId,
    ref: 'Dealership',
    required: [true, 'Vehicle model must be associated to a dealership']
  },
  vin: {
    type: String,
    required: [true, 'Vehicle must have a \'Vehicle Identification Number\' (VIN)'],
    unique: true,
    minlength: [11, 'VIN must be 17 characters long, or at least 11 characters for vehicles manufactured before 1981'],
    maxlength: [17, 'VIN must be 17 characters long, or at least 11 characters for vehicles manufactured before 1981']
  },
  missing: {
    type: Boolean,
    default: false
  },
  delivered: {
    type: Boolean,
    default: false
  },
  date_delivered: Date,
  sale: {
    type: mongoose.Schema.ObjectId,
    ref: 'VehicleSale',
    default: null
  },
  date_added: {
    type: Date,
    default: Date.now
  },
  on_road_since: Date,
  properties: Object,
})

// cascade delete comments, history, vehiclesale
VehicleSchema.pre('remove', async function (next) {
  await Comment.deleteMany({ vehicle: this._id });
  await History.deleteMany({ vehicle: this._id });
  await VehicleSale.deleteMany({ vehicle: this._id });
  await Event.deleteMany({ vehicle: this._id });
});

module.exports = mongoose.model('Vehicle', VehicleSchema);