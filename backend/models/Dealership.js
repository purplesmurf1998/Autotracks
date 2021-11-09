const mongoose = require("mongoose");

const DealershipSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: [50, 'Name cannot be more than 25 characters long'],
    minlength: [5, 'Name must have at least 5 characters'],
    required: 'Name is required'
  },
  description: String,
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: 'Dealership must have an admin account connected.'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  created_at_formatted: String
});

// cascade delete middleware for the dealership object
// anything related to Dealership must be deleted upon deletion
DealershipSchema.pre('remove', async function (next) {
  await this.model('User').deleteMany({ dealership: this._id });
  next();
});

// formated the created_at date before saving
DealershipSchema.pre('save', async function (next) {
  const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
  const dateObj = new Date(this.created_at);
  const month = monthNames[dateObj.getMonth()];
  const day = String(dateObj.getDate()).padStart(2, '0');
  const year = dateObj.getFullYear();
  const formatted_date = `${month} ${day}, ${year}`;

  this.created_at_formatted = formatted_date;
})


const Dealership = mongoose.model('Dealership', DealershipSchema);


module.exports = Dealership;