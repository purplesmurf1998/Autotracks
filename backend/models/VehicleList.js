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
VehicleListSchema.pre('save', async function (next) {
  this.last_modified = new Date();
  console.log(this.last_modified);
});

module.exports = mongoose.model('VehicleList', VehicleListSchema);