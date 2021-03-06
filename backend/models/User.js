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
    enum: [
      "Administration",
      "Management",
      "Sales Rep",
      "Reception"
    ],
    required: 'User must have a role'
  },
  subscribed_events: {
    type: [String],
    enum: [
      'vehicle_sale_pending',
      'vehicle_approved',
      'vehicle_delivered',
      'vehicle_missing',
      'vehicle_moved',
      'vehicle_found',
      'vehicle_deleted',
      'transaction_modified',
    ],
    default: [
      'vehicle_sale_pending',
      'vehicle_approved',
      'vehicle_delivered',
      'vehicle_missing',
      'vehicle_moved',
      'vehicle_found',
      'vehicle_deleted',
      'transaction_modified',
    ]
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
  promptPasswordChange: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (_next) {
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