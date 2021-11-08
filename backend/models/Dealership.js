const mongoose = require("mongoose");

const DealershipSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: [50, 'Name cannot be more than 25 characters long'],
    minlength: [5, 'Name must have at least 5 characters'],
    required: 'Name is required'
  },
  description: String,
<<<<<<< HEAD
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: 'Dealership must have an admin account connected.'
  },
=======
>>>>>>> 0d32b0b ([AP-54] Jenkins and Docker setup complete)
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

<<<<<<< HEAD
const Dealership = mongoose.model('Dealership', DealershipSchema);
=======
const Dealership = mongoose.model("Dealership", DealershipSchema);
>>>>>>> 0d32b0b ([AP-54] Jenkins and Docker setup complete)

module.exports = Dealership;