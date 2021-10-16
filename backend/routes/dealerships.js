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
const { protect } = require('../middleware/auth');

// attach methods to the proper routes
router.route('/')
    .get(protect, getDealerships)
    .post(protect, createDealership);

router.route('/:dealershipId')
    .get(protect, getDealership)
    .put(protect, updateDealership)
    .delete(protect, deleteDealership);

// export the router so it can be used in the server.js file
module.exports = router;