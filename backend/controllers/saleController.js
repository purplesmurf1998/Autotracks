const Dealership = require('../models/Dealership');
const Sale = require('../models/VehicleSale');
const Vehicle = require('../models/Vehicle');

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

// @desc    Get all sale instances from a dealership
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
// @route   Update /api/v1/inventory/details/sale/:saleId'
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
    const newVehicle = await Vehicle.updateOne({sale: req.params.saleId}, { $set: {sale: null} });

    //TODO: Delete anything related to the vehicle. This can be done in the Vehicle model using middleware.
    sale.remove();

    res.status(200).json({
    success: true,
    payload: {}
    })
});

// @desc    Returns the number of sales per time period, formatted as data points for the dashboard chart
// @route   GET /api/v1/inventory/details/sale/:dealershipId'
// @access  Public
exports.getSalesByTime = asyncHandler(async (req, res, next) => {
    // grab the dealership_ID from the body and verify that the dealership exists
    const dealership = await Dealership.findById(req.params.dealershipId);

    // no dealership found
    if (!dealership) {
        return next(
            new ErrorResponse(`This dealership ID ${req.params.dealershipId} with this not found. Cannot return a list of vehicls without a valid dealership.`, 404)
        );
    }

    // Get the sales from the dealership
    const sales = await Sale.find({ dealership: req.params.dealershipId })
        .populate('vehicle sales_rep approved_by');

    // If there aren't any sales, return an error
    if (!sales) {
        return next(new ErrorResponse(`An error occured while fetching transactions`, 404));
    }

    /*
    The logic will be to get all the sales from the start, then process them into 3 datasets here in the backend.
    These datasets will be returned by the payload and saved locally in the frontend on mount.
    */

    const salesByWeek = await Sale.find({ dealership: req.params.dealershipId })
        .projection({
            year: {$year: "$date_of_sale"},
            month: {$month: "$date_of_sale"},
            week: {$week: "$date_of_sale"}
        }).group({
            _id: {
                "year": "$year",
                "month": "$month",
                "week": "$week"
            },
            total: {
                $sum:1
            }
        }).sort({
            "_id.year":1,
            "_id.month":1,
            "_id.week:":1
        })

    const salesByMonth = await Sale.find({ dealership: req.params.dealershipId })
        .projection({
            year: {$year: "$date_of_sale"},
            month: {$month: "$date_of_sale"}
        }).group({
            _id: {
                "year": "$year",
                "month": "$month"
            },
            total: {
                $sum:1
            }
        }).sort({
            "_id.year":1,
            "_id.month":1
        })

    const salesByYear = await Sale.find({ dealership: req.params.dealershipId })
        .projection({
            year: {$year: "$date_of_sale"}
        }).group({
            _id: {
                "year": "$year"
            },
            total: {
                $sum:1
            }
        }).sort({
            "_id.year":1
        })

    const formattedSalesByWeek = formatPoints(salesByWeek, "week")
    const formattedSalesByMonth = formatPoints(salesByMonth, "month")
    const formattedSalesByYear = formatPoints(salesByYear, "year")
    const datasets = {
        formattedSalesByWeek,
        formattedSalesByMonth,
        formattedSalesByYear
    }

    res.status(200).json({
        success: true,
        payload: datasets
    })
});

function formatPoints(data, type) {
    let formattedPoints = []
    let dateString = ""
    switch (type) {
        case "week": {
            data.forEach(sale => {
                const salePoint = new Object()
                dateString = (
                    sale._id.year
                    +"-"
                    +sale._id.month
                    +"-"
                    +sale._id.week
                )
                salePoint.x = dateString
                salePoint.y = sale._id.count
                formattedPoints.push(salePoint)
                dateString = ""
            })
        }
        case "month": {
            data.forEach(sale => {
                const salePoint = new Object()
                dateString = (
                    sale._id.year
                    + "-"
                    + sale._id.month
                )
                salePoint.x = dateString
                salePoint.y = sale._id.count
                formattedPoints.push(salePoint)
                dateString = ""
            })
        }
        case "year": {
            data.forEach(sale => {
                const salePoint = new Object()
                dateString= (
                    sale._id.year
                )
                salePoint.x = dateString
                salePoint.y = sale._id.count
                formattedPoints.push(salePoint)
                dateString = ""
            })
        }
    }
    return formattedPoints
}