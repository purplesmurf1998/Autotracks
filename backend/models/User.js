const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    maxlength: [25, 'First name cannot be more than 25 characters long'],
    minlength: [2, 'First name must have at least 5 characters'],
    required: 'First name is required'
  },
  last_name: {
    type: String,
    maxlength: [25, 'Last name cannot be more than 50 characters long'],
    minlength: [2, 'Last name must have at least 5 characters'],
    required: 'Last name is required'
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  role: {
    type: String,
    enum: ['Administration', 'Management', 'Sales', 'Reception', 'Backshop'],
    required: 'User must have a role'
  },

  permissions: {
    type: [String],
    enum: [
      'Add Dealerships',
      'View Dealerships',
      'Edit Dealerships',
      'Delete Dealerships',
      'Add Staff Users',
      'View Staff Users',
      'Edit Staff Users',
      'Delete Staff Users',
      'Add Vehicles',
      'View Vehicles',
      'Edit Vehicle Properties',
      'Edit Vehicle Locations',
      'Sell Vehicles',
      'Delete Vehicles'
    ],
    required: 'User must have a list of permissions, even if that list is empty.'
  },
  dealership: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dealership"
  },
  password: {
    type: String,
    required: 'Password is required',
    select: false
  },

  createDealershipCompleted: {
    type: Boolean,
    default: false
  },
  createUserCompleted: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({
    userId: this._id
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
}

// Math user entered password to hashed password in the database
UserSchema.methods.matchPassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
}

const User = mongoose.model("User", UserSchema);

module.exports = User;