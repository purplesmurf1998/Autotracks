// @desc    Create a new user
// @route   POST /api/v1/users
// @access  Public
exports.createUser = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'Create a new user'
    });
}

// @desc    Get a a list of users based on query parameters
// @route   GET /api/v1/users
// @access  Authenticated
exports.getUsers = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'Get a a list of users based on query parameters'
    });
}

// @desc    Get a specific user
// @route   GET /api/v1/users/:userId
// @access  Authenticated
exports.getUser = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: `Get a specific user with ID: ${req.params.userId}`
    });
}

// @desc    Get a specific user
// @route   PUT /api/v1/users/:userId
// @access  Authenticated
exports.updateUser = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: `Update a specific user with ID: ${req.params.userId}`
    });
}

// @desc    Delete a specific user
// @route   DELETE /api/v1/users/:userId
// @access  Authenticated
exports.deleteUser = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: `Delete a specific user with ID: ${req.params.userId}`
    });
}