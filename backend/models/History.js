const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.ObjectId,
    ref: 'Vehicle',
    required: [true, 'History comments must be associated to a specific vehicle']
  },
  log: {
    type: String,
    maxlength: [500, 'History comment cannot be more than 500 characters long'],
    minlength: [5, 'History comment must have at least 5 characters'],
    required: 'History comment is required'
  },
  timestamp: {
      type: Date,
      default: Date.now,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'History comments must be associated to a user']
  },
  logType: {
      //Critical, Warning, Info
      type: String,
      enum: ['Critical', 'Warning', 'Info'],
      default: 'Info',
  }
})

module.exports = mongoose.model('History', HistorySchema);