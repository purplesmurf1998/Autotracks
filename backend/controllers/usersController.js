const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const advancedFilter = require('../utils/advancedFilter');

// @desc    Create a new user
// @route   POST /api/v1/users
// @access  Public
exports.createUser = asyncHandler(async (req, res, next) => {
    // create new user with the data passed in the request body
    const user = new User(req.body);

    // send response
    await user.save();
    res.status(200).json({
        success: true,
        user
    });
});

// @desc    Get a a list of users based on query parameters
// @route   GET /api/v1/users
// @access  Authenticated
exports.getUsers = asyncHandler(async (req, res, next) => {
    // get the formatted query based on the advnaced filtering
    const query = advancedFilter(User, req.query);
    
    // run query in mongoose
    const users = await query;

    // send response
    res.status(200).json({
        success: true,
        data: users
    });
});

// @desc    Get a specific user
// @route   GET /api/v1/users/:userId
// @access  Authenticated
exports.getUser = asyncHandler(async (req, res, next) => {
    // find the user with the id provided in the request params
    const user = await User.findById(req.params.userId);

    // if user not found, send an error response
    if (!user) {
        return next(
            new ErrorResponse(`User with id ${req.params.userId} not found.`, 500)
        );
    }

    // send response
    res.status(200).json({
        success: true,
        data: user
    })
});

// @desc    Get a specific user
// @route   PUT /api/v1/users/:userId
// @access  Authenticated
exports.updateUser = asyncHandler(async (req, res, next) => {
    // find the user with the id provided in the request params and update
    // with the data passed in the body
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
        new: true,
        runValidators: true
    });

    // if no user is returned, user was not found and send an error response
    if (!user) {
        return next(
            new ErrorResponse(`User with id: ${req.params.userId} not found.`, 400)
        );
    }

    // send response
    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Delete a specific user
// @route   DELETE /api/v1/users/:userId
// @access  Authenticated
exports.deleteUser = asyncHandler(async (req, res, next) => {
    // find the user with the id provided in the request params and delete
    const user = await User.findByIdAndDelete(req.params.userId);

    // if no user is returned, user was not found and send an error response
    if (!user) {
        return next(
            new ErrorResponse(`User with id: ${req.params.userId} not found.`, 401)
        );
    }

    // send response
    res.status(200).json({
        success: true,
        data: {}
    });
});