const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  dealership: {
    type: mongoose.Schema.ObjectId,
    ref: 'Dealership',
    required: [true, 'Vehicle model must be associated to a dealership']
  },
  deposit: {
    type: Number,
    default: 0.00
  },
  soldBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    default: null
  },
  delivered: {
    type: Boolean,
    default: false
  },
  properties: Object
})

module.exports = mongoose.model('Vehicle', VehicleSchema);