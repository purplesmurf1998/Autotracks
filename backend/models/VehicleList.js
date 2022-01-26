const mongoose = require('mongoose')

const VehicleListSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Vehicle list must have an owner']
  },
  title: {
    type: String,
    required: [true, 'Vehicle list must have a title']
  },
  vehicles: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Vehicle'
  }],
  date_created: {
    type: Date,
    default: Date.now
  },
  last_modified: Date,
  notes: String,
});

module.exports = mongoose.model('VehicleList', VehicleListSchema);