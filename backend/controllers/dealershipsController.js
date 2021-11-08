const Dealership = require('../models/Dealership');

const User = require('../models/User');

const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const advancedFilter = require('../utils/advancedFilter');

// @desc    Create a new dealership
// @route   POST /api/v1/dealerships
// @access  Public
exports.createDealership = asyncHandler(async (req, res, next) => {

    // check that there is an admin user attached to the dealership
    if (!req.body.admin) {
        return next(
            new ErrorResponse('Dealership must be connected to an admin account.', 400)
        );
    }
    
    // grab the userId from the body and verify that the user is in fact an admin
    const user = await User.findById(req.body.admin);

    // no user found
    if (!user) {
        return next(
            new ErrorResponse('Admin user not found. Cannot create dealership.', 404)
        );
    }
    
    // user exists but isn't an admin
    if (user.role != 'Administration') {
        return next(
            new ErrorResponse('User creating the dealership is not an admin.', 400)
        )
    }
    // create new dealership with the data passed in the request body
    const dealership = await Dealership.create(req.body);

    // send response
    res.status(201).json({
        success: true,
        dealership
    });
});

// @desc    Get a a list of dealerships based on query parameters
// @route   GET /api/v1/dealerships
// @access  Authenticated
exports.getDealerships = asyncHandler(async (req, res, next) => {
    // run query in mongoose
    const dealerships = await advancedFilter(Dealership, req.query);

    // send response
    res.status(200).json({
        success: true,
        data: dealerships
    });
});

// @desc    Get a specific dealership
// @route   GET /api/v1/dealerships/:dealershipId
// @access  Authenticated
exports.getDealership = asyncHandler(async (req, res, next) => {
    let queryResponse = Dealership.findById(req.params.dealershipId);

    // populate specific fields if some have been entered
    if (req.query.populate) {
        const fields = req.query.populate.split(',').join(' ');
        queryResponse = queryResponse.populate(fields);
    }

    // find the dealership with the id provided in the request params
    const dealership = await queryResponse;

    // if dealership not found, send an error response
    if (!dealership) {
        return next(
            new ErrorResponse(`Dealership with id: ${req.params.dealershipId} not found.`, 404)
        );
    }

    // send response
    res.status(200).json({
        success: true,
        data: dealership
    });
});

// @desc    Get a specific dealership
// @route   PUT /api/v1/dealerships/:dealershipId
// @access  Authenticated
exports.updateDealership = asyncHandler(async (req, res, next) => {
    // find the dealership with the id provided in the request params and update
    // with the data passed in the body
    const dealership = await Dealership.findByIdAndUpdate(req.params.dealershipId, req.body, {
        new: true,
        runValidators: true
    });

    // if no dealership is returned, dealership was not found and send an error response
    if (!dealership) {
        return next(
            new ErrorResponse(`Dealership with id: ${req.params.dealershipId} not found.`, 404)
        );
    }

    // send response
    res.status(200).json({
        success: true,
        data: dealership
    });
});

// @desc    Delete a specific dealership
// @route   DELETE /api/v1/dealerships/:dealershipId
// @access  Authenticated
exports.deleteDealership = asyncHandler(async (req, res, next) => {
    // find the dealership with the id provided in the request params and delete
    const dealership = await Dealership.findByIdAndDelete(req.params.dealershipId);

    // if no dealership is returned, dealership was not found and send an error response
    if (!dealership) {
        return next(
            new ErrorResponse(`Dealership with id: ${req.params.dealershipId} not found.`, 401)
        );
    }

    // send response
    res.status(200).json({
        success: true,
        data: {}
    });
});