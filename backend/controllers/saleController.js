const Dealership = require('../models/Dealership');
const User = require('../models/User');
const Sale = require('../models/VehicleSale');

const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const advancedFilter = require('../utils/advancedFilter');

// @desc    Create a sale instance
// @route   POST /api/v1/inventory/details/sell'
// @access  Public
exports.createSale = asyncHandler(async (req, res, next) => {

    // create new sale object with the data passed in the request body
    const sale = await Sale.create(req.body);

    // send response
    res.status(201).json({
        success: true,
        payload: sale
    });
});