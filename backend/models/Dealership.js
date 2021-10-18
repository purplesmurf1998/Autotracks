const mongoose = require("mongoose");

const DealershipSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: [50, 'Name cannot be more than 25 characters long'],
    minlength: [5, 'Name must have at least 5 characters'],
    required: 'Name is required'
  },
  description: String,
  created_at: {
    type: Date,
    default: Date.now
  }
});

// cascade delete middleware for the dealership object
// anything related to Dealership must be deleted upon deletion
DealershipSchema.pre('remove', async function (next) {
  await this.model('User').deleteMany({ dealership: this._id });
  next();
});

const Dealership = mongoose.model("Dealership", DealershipSchema);

module.exports = Dealership;