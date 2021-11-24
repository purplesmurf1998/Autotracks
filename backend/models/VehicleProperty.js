const mongoose = require('mongoose')

const VehiclePropertySchema = new mongoose.Schema({
  dealership: {
    type: mongoose.Schema.ObjectId,
    ref: 'Dealership',
    required: [true, 'Vehicle property model must be associated to a dealership']
  },
  headerName: {
    type: String,
    required: [true, 'Vehicle property must have a header name']
  },
  field: String,
  inputType: {
    type: String,
    enum: ['Text','Number', 'Currency', 'Date', 'Options', 'List'],
    required: [true, 'Vehicle property must have an input type']
  },
  options: [String],
  visible: {
    type: Boolean,
    default: true
  },
  position: {
    type: Number,
    required: [true, 'Vehicle property model must have a position']
  },
  isRequired: {
    type: Boolean,
    default: true
  },
  description: String
});

// Create the field from the headerName
VehiclePropertySchema.pre('save', async function (next) {
  // create field
  this.field = this.headerName.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });;
  next();
});

// Update the field from the headerName
VehiclePropertySchema.pre('findOneAndUpdate', async function (next) {
  // create field
  //console.log(this._update);
  if (this._update.headerName) {
    this._update.field = this._update.headerName.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });;
  }
  next();
});

module.exports = mongoose.model('VehicleProperty', VehiclePropertySchema);