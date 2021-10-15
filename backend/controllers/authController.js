const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const advancedFilter = require('../utils/advancedFilter');

// @desc    Sign in user and return a valid JWT
// @route   POST /api/v1/auth/signin
// @access  Public
exports.signIn = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'Sign in user and return a valid JWT'
    });
}

// @desc    Logout user and clear JWT from browser/cookies
// @route   GET /api/v1/auth/logout
// @access  Authenticated
exports.logout = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'Logout user and clear JWT from browser/cookies'
    });
}

// @desc    Register a new user and return a valid JWT
// @route   POST /api/v1/auth/register
// @route   Public
exports.register = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);

    if (!user) {
        return next(
            new ErrorResponse('Something went wrong when registering new usre.', 500)
        );
    }

    res.status(201).json({
        success: true
    })
});