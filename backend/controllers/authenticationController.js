// @desc    Sign in user and return a valid JWT
// @route   POST /api/v1/authentication/signin
// @access  Public
exports.signIn = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'Sign in user and return a valid JWT'
    });
}

// @desc    Logout user and clear JWT from browser/cookies
// @route   GET /api/v1/authentication/logout
// @access  Authenticated
exports.logout = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'Logout user and clear JWT from browser/cookies'
    });
}