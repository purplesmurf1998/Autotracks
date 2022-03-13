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
//hasPermissions need to be refactored to has roles, with a possibility of a complete removal
const { protect, hasRoles } = require('../middleware/auth');

// attach methods to the proper routes
router.route('/')
    .get(protect, hasRoles('Administration'), getDealerships)
    .post(protect, hasRoles('Administration'), createDealership);

router.route('/:dealershipId')
    .get(protect, getDealership)
    .put(protect, hasRoles('Administration'), updateDealership)
    .delete(protect, hasRoles('Administration'), deleteDealership);

// export the router so it can be used in the server.js file
module.exports = router;