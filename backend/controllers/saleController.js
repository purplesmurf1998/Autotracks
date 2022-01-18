const Dealership = require('../models/Dealership');
const User = require('../models/User');
const Sale = require('../models/VehicleSale');
const Vehicle = require('../models/Vehicle');

const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const advancedFilter = require('../utils/advancedFilter');

// @desc    Create a sale instance
// @route   POST /api/v1/inventory/details/sell'
// @access  Public
exports.createSale = asyncHandler(async (req, res, next) => {

    //Check if there is a sale object for a given vehicle
    const sale_check = await Sale.findOne({vehicle: req.body.vehicle});

    // if a sale has already been created for this object return an error
    if (!!sale_check) {
        return next(
            new ErrorResponse(`A sale has already been created for this vehicle`, 400)
        );
    }
    // create new sale object with the data passed in the request body
    const sale = await Sale.create(req.body);
    //Map this created sale to the vehicle
    const newVehicle = await Vehicle.findByIdAndUpdate(req.body.vehicle, {sale: sale._id}, {
        runValidators: true,
        new: true
    });


    // send response
    res.status(201).json({
        success: true,
        payload: sale
    });
});