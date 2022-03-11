const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const advancedFilter = require('../utils/advancedFilter');

// @desc    Create a new user
// @route   POST /api/v1/users
// @access  Public
exports.createUser = asyncHandler(async (req, res, next) => {
    // make sure the user being created is not an admin
    if (req.body.role == 'Administration') {
        return next(
            new ErrorResponse('Admin accounts can only be registered from the register page.', 400)
        );
    }

    // make sure there is a dealership attached to this user
    if (!req.body.dealership) {
        return next(
            new ErrorResponse('Staff users need to be associated to a dealership.', 400)
        );
    }

    //The below code needs to be removed. As permissions are going to get removed
    // grab the user passed in the auth token and make sure they have "Add Staff Users" permission
    const loggedUser = req.user;
    var flag = loggedUser.permissions.includes("Add Staff Users");
    if (!loggedUser || !flag) {
        return next(
            new ErrorResponse('Unauthorized to make these changes', 401)
        );
    }

    // set the tutorials completed for staff users so they don't
    // get the notifications
    const body = req.body;
    body.createDealershipCompleted = true;
    body.createUserCompleted = true;
    body.promptPasswordChange = true;

    // create new user with the data passed in the request body
    const user = new User(body);

    // if the admin is creating their first staff account, set the tutorial flag to completed
    if (!loggedUser.createUserCompleted) {
        await User.findByIdAndUpdate(loggedUser._id, { createUserCompleted: true }, {
            new: true,
            runValidators: true
        });
    }

    // send response
    await user.save();
    res.status(201).json({
        success: true,
        payload: user
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
        payload: users
    });
});

// @desc    Get a specific user
// @route   GET /api/v1/users/:userId
// @access  Authenticated
exports.getUser = asyncHandler(async (req, res, next) => {
    let queryResponse = User.findById(req.params.userId);

    // populate specific fields if some have been entered
    if (req.query.populate) {
        const fields = req.query.populate.split(',').join(' ');
        queryResponse = queryResponse.populate(fields);
    }

    // find the dealership with the id provided in the request params
    const user = await queryResponse;

    // if user not found, send an error response
    if (!user) {
        return next(
            new ErrorResponse(`User with id ${req.params.userId} not found.`, 404)
        );
    }

    // send response
    res.status(200).json({
        success: true,
        payload: user
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
            new ErrorResponse(`User with id: ${req.params.userId} not found.`, 404)
        );
    }

    // send response
    res.status(200).json({
        success: true,
        payload: user
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
            new ErrorResponse(`User with id: ${req.params.userId} not found.`, 404)
        );
    }

    // send response
    res.status(200).json({
        success: true,
        payload: {}
    });
});
