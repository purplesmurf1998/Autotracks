const mongoose = require('mongoose')

const VehicleListSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Vehicle list must have an owner']
  },
  dealership: {
    type: mongoose.Schema.ObjectId,
    ref: 'Dealership',
    required: [true, 'Vehicle list must be associated to a dealership']
  },
  title: {
    type: String,
    required: [true, 'Vehicle list must have a title']
  },
  vehicles: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Vehicle',
    default: []
  }],
  date_created: {
    type: Date,
    default: Date.now
  },
  last_modified: Date,
  notes: String,
});

// Update the last modified field
VehicleListSchema.pre('save', async function (_next) {
  this.last_modified = new Date();
});

module.exports = mongoose.model('VehicleList', VehicleListSchema);