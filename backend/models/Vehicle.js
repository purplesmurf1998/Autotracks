const mongoose = require('mongoose');

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

module.exports = mongoose.model('Vehicle', VehicleSchema);