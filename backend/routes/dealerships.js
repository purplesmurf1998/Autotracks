const express = require('express');
const router = express.Router();

// get the methods from the authenticationController
const {
    getDealerships,
    getDealership,
    createDealership,
    updateDealership,
    deleteDealership
} = require('../controllers/dealershipsController');

// get authentication middleware
const { protect, hasPermissions } = require('../middleware/auth');

// attach methods to the proper routes
router.route('/')
    .get(protect, hasPermissions('View Dealerships'), getDealerships)
    .post(protect, hasPermissions('Add Dealerships'), createDealership);

router.route('/:dealershipId')
    .get(protect, hasPermissions('View Dealerships'), getDealership)
    .put(protect, hasPermissions('Edit Dealerships'), updateDealership)
    .delete(protect, hasPermissions('Delete Dealerships'), deleteDealership);

// export the router so it can be used in the server.js file
module.exports = router;