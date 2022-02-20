const Dealership = require('../models/Dealership');
const Sale = require('../models/VehicleSale');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');

const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Create a sale instance
// @route   POST /api/v1/inventory/details/sale'
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
    // //Check if the approved_by field is a manager
    // const manager = await User.findById(req.body.approved_by);
    // if (manager && manager.role != "Management") {
    //     return next(
    //         new ErrorResponse(`A sale has already been created for this vehicle`, 400)
    //     );
    // }

    // create new sale object with the data passed in the request body
    const sale = await Sale.create(req.body);
    //Map this created sale to the vehicle
    await Vehicle.findByIdAndUpdate(req.body.vehicle, {sale: sale._id});
    
    // send response
    res.status(201).json({
        success: true,
        payload: sale
    });
});

// @desc    Get a sale instance
// @route   GET /api/v1/inventory/details/sale/:dealershipId'
// @access  Public
exports.getSales = asyncHandler(async (req, res, next) => {    
    // grab the dealership_ID from the body and verify that the dealership exists
    const dealership = await Dealership.findById(req.params.dealershipId);
    
    // no dealership found
    if (!dealership) {
        return next(
            new ErrorResponse(`This dealership ID ${req.params.dealershipId} with this not found. Cannot return a list of vehicls without a valid dealership.`, 404)
        );
    }

    const sales = await Sale.find({ dealership: req.params.dealershipId })
    .populate('vehicle sales_rep approved_by');

    // return error if no sale found
    if (!sales) {
        return next(new ErrorResponse(`An error occured while fetching transactions`, 404));
    }

    res.status(200).json({
    success: true,
    payload: sales
    })
});

// @desc    Get a sale instance
// @route   GET /api/v1/inventory/details/sale/:saleId'
// @access  Public
exports.getSale = asyncHandler(async (req, res, next) => {
    // find vehicle property to delete
    const sale = await Sale.findById(req.params.saleId)
    .populate('vehicle sales_rep approved_by');

    // return error if no sale found
    if (!sale) {
        return next(new ErrorResponse(`Sale not found with id ${req.params.saleId}`, 404));
    }

    res.status(200).json({
    success: true,
    payload: sale
    })
});

// @desc    Update a sale instance
// @route   PUT /api/v1/inventory/details/sale/:saleId'
// @access  Public
exports.updateSale = asyncHandler(async (req, res, next) => {
    // find vehicle property to delete
    const sale = await Sale.findByIdAndUpdate(req.params.saleId, req.body, {
        runValidators: true,
        new: true
    });
    // return error if no sale found
    if (!sale) {
        return next(new ErrorResponse(`Sale not found with id ${req.params.saleId}`, 404));
    }

    res.status(200).json({
        success: true,
        payload: sale
    })
});

// @desc    Delete a sale instance
// @route   Delete /api/v1/inventory/details/sale/:saleId'
// @access  Public
exports.deleteSale = asyncHandler(async (req, res, next) => {
    // find vehicle property to delete
    const sale = await Sale.findById(req.params.saleId);
    // return error if no sale found
    if (!sale) {
        return next(new ErrorResponse(`Sale not found with id ${req.params.saleId}`, 404));
    }

    //Map this created sale to the vehicle
    await Vehicle.updateOne({sale: req.params.saleId}, { $set: {sale: null} });

    //TODO: Delete anything related to the vehicle. This can be done in the Vehicle model using middleware.
    sale.remove();

    res.status(200).json({
    success: true,
    payload: {}
    })
});