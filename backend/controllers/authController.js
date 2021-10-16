const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const advancedFilter = require('../utils/advancedFilter');

// @desc    Sign in user and return a valid JWT
// @route   POST /api/v1/auth/signin
// @access  Public
exports.signIn = asyncHandler(async (req, res, next) => {
    // get email and password from the body
    const { email, password } = req.body;

    // validate that email and password exist
    if (!email || !password) {
        return next(
            new ErrorResponse('Please provide an email and password.', 400)
        );
    }

    // check for user
    // use select to return the password in the user object
    const user = await User.findOne({ email }).select('+password');

    // validate that the user exists
    if (!user) {
        return next(
            new ErrorResponse('Invalid credentials.', 401)
        );
    }

    // validate the entered password to the user password
    const passwordMatch = await user.matchPassword(password);
    if (!passwordMatch) {
        return next(
            new ErrorResponse('Invalid credentials.', 401)
        );
    }

    // create user token
    const token = user.getSignedJwtToken();

    // send response
    res.status(200).json({
        success: true,
        token
    });
});

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
    // create the new user
    const user = await User.create(req.body);

    if (!user) {
        return next(
            new ErrorResponse('Something went wrong when registering new user.', 500)
        );
    }

    // create token for this user
    const token = user.getSignedJwtToken();

    res.status(201).json({
        success: true,
        data: user,
        token
    });
});