const History = require('../models/History');

const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Create a history instance
// @route   POST /api/v1/history/'
// @access  Public
exports.createHistory = asyncHandler(async (req, res, next) => {
    // create new history object with the data passed in the request body
    const history = await History.create(req.body);

    // send response
    res.status(201).json({
        success: true,
        payload: history
    });
});

// @desc    Get a history instance
// @route   GET /api/v1/history/vehicle/:vehicleId'
// @access  Public
exports.getHistory = asyncHandler(async (req, res, next) => {    
    // grab the vehicle_ID from the body and populate the table
    const history = await History.find({ vehicle: req.params.vehicleId })
    .populate('author');

    res.status(200).json({
        success: true,
        payload: history
    })
});
