const History = require('../models/History');
const Vehicle = require('../models/Vehicle');
const Comment = require('../models/Comment');

const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Create a history instance
// @route   POST /api/v1/history/'
// @access  Public
exports.createHistory = asyncHandler(async (req, res, next) => {
    // create new history object for vehicle/sales/comments creation/deletion/modification

    // Vehicle APIs
    // DELETE /api/v1/inventory/vehicle/:vehicleId
    // PUT /api/v1/inventory/vehicle/:vehicleId

    //Transaction APIs
    // PUT /api/v1/inventory/details/sale/:saleId'
    // POST /api/v1/inventory/details/sale'

    var body = {};

    //Transaction API History
    if (req.originalUrl.indexOf('/api/v1/inventory/details/sale') > -1) {
        if (req.method=='POST') {
            //fetch vehicle details
            const vehicle = await Vehicle.findById(req.body.vehicle);
            body = {
                vehicle: req.body.vehicle,
                log: `A new transaction has been created for the vehicle with vin: ${vehicle.vin} by ${req.user.first_name} ${req.user.last_name}`,
                author: req.user._id
            }
        }
        else {
            const vehicle = await Vehicle.find({ sale: req.params.saleId });
            if (req.method=='DELETE') {
                body = {
                    vehicle: vehicle[0]._id,
                    log: `A sale request has been deleted for the vehicle with vin: ${vehicle[0].vin} by ${req.user.first_name} ${req.user.last_name}`,
                    author: req.user._id
                }
            }
            // When a transaction has been approved. EventType=vehicle_approved
            else if (req.method=='PUT') {
                if (!!req.body.date_approved) {
                    body = {
                        vehicle: vehicle[0]._id,
                        log: `A sale request has been approved for the vehicle with vin: ${vehicle[0].vin} by ${req.user.first_name} ${req.user.last_name}`,
                        author: req.user._id
                    }
                }
                else if (!!req.body.sale_amount) {
                    body = {
                        vehicle: vehicle[0]._id,
                        log: `A transaction has been modified for the vehicle with vin: ${vehicle[0].vin} by ${req.user.first_name} ${req.user.last_name}`,
                        author: req.user._id
                    }
                }
            }
        }
    }

    //Vehicle API History
    else if (req.originalUrl.indexOf('/api/v1/inventory') > - 1) {
        const vehicle = await Vehicle.findById(req.params.vehicleId);
        if (req.method == 'DELETE') {
            body = {
                vehicle: vehicle._id,
                author: req.user._id,
                log: `A vehicle with vin: ${vehicle.vin} has been deleted by ${req.user.first_name} ${req.user.last_name}`,
            }
        }
        else if (req.method == 'PUT') {
            if (req.body.delivered) {
                body = {
                    vehicle: vehicle._id,
                    author: req.user._id,
                    log: `A vehicle with vin: ${vehicle.vin} has been marked delivered by ${req.user.first_name} ${req.user.last_name}`,
                }
            }
            else if (vehicle.missing != req.body.missing) {
                if (req.body.missing) {
                    body = {
                        vehicle: vehicle._id,
                        author: req.user._id,
                        log: `A vehicle with vin: ${vehicle.vin} has been marked missing by ${req.user.first_name} ${req.user.last_name}`,
                    }
                }
                else {
                    body = {
                        vehicle: vehicle._id,
                        author: req.user._id,
                        log: `A vehicle with vin: ${vehicle.vin} has been marked found by ${req.user.first_name} ${req.user.last_name}`,
                    }
                }
            }
        }
    }

    //Comments API History
    else if (req.originalUrl.indexOf('/api/v1/comments/') > - 1) {
        if (req.method=='POST') {
            const vehicle = await Vehicle.findById(req.params.vehicleId);
            body = {
                vehicle: req.params.vehicleId,
                author: req.user._id,
                log: `A comment has been added on the vehicle with vin: ${vehicle.vin} by ${req.user.first_name} ${req.user.last_name}`,
            }
        }
        else {
            const comment = await Comment.findById(req.params.commentId);
            if (req.method=='DELETE') {
                body = {
                    vehicle: comment.vehicle,
                    author: req.user._id,
                    log: `A comment has been deleted on the vehicle with vin: ${vehicle.vin} by ${req.user.first_name} ${req.user.last_name}`,
                }
            }
            else if (req.method=='PUT') {
                body = {
                    vehicle: comment.vehicle,
                    author: req.user._id,
                    log: `A comment has been edited on the vehicle with vin: ${vehicle.vin} by ${req.user.first_name} ${req.user.last_name}`,
                }
            }
        }
    }

    //if body is defined, then create the event
    if (Object.keys(body).length !== 0) {
        const history = await History.create(body);
        return next();
    }
    next();
});

// @desc    Get a history instance
// @route   GET /api/v1/history/vehicle/:vehicleId'
// @access  Public
exports.getHistory = asyncHandler(async (req, res, next) => {    
    // grab the vehicle_ID from the body and populate the table
    const history = await History.find({ vehicle: req.params.vehicleId }).sort({timestamp: -1})
    .populate('author');

    res.status(200).json({
        success: true,
        payload: history
    })
});
