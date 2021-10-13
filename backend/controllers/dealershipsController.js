// @desc    Create a new dealership
// @route   POST /api/v1/dealerships
// @access  Public
exports.createDealership = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'Create a new dealership'
    });
}

// @desc    Get a a list of dealerships based on query parameters
// @route   GET /api/v1/dealerships
// @access  Authenticated
exports.getDealerships = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'Get a a list of dealerships based on query parameters'
    });
}

// @desc    Get a specific dealership
// @route   GET /api/v1/dealerships/:dealershipId
// @access  Authenticated
exports.getDealership = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: `Get a specific dealership with ID: ${req.params.dealershipId}`
    });
}

// @desc    Get a specific dealership
// @route   PUT /api/v1/dealerships/:dealershipId
// @access  Authenticated
exports.updateDealership = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: `Update a specific dealership with ID: ${req.params.dealershipId}`
    });
}

// @desc    Delete a specific dealership
// @route   DELETE /api/v1/dealerships/:dealershipId
// @access  Authenticated
exports.deleteDealership = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: `Delete a specific dealership with ID: ${req.params.dealershipId}`
    });
}