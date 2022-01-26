const mongoose = require('mongoose');

const VehicleSaleSchema = new mongoose.Schema({
  dealership: {
    type: mongoose.Schema.ObjectId,
    ref: 'Dealership',
    required: [true, ' Sale must be associated to a dealership']
  },
  vehicle: {
    type: mongoose.Schema.ObjectId,
    ref: 'Vehicle',
    required: [true, ' Sale must be associated to a vehicle']
  },
  deposit_amount: {
      type: Number,
      default: 0.00,
      min: [0.00, ' Deposit amount cannot be negative']
  },
  sale_amount: {
    type: Number,
    default: 0.00,
    min: [0.00, ' Sale amount cannot be negative']
  },
  approved_by: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, ' Vehicle sale must be associated with a manager']
  },
  sales_rep: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, ' Vehicle sale must have a sales representative associated']
  },
  notes: String,
  date_of_sale: {
      type: Date, 
      default: Date.now
  },
  date_approved: Date,
})

module.exports = mongoose.model('VehicleSale', VehicleSaleSchema);