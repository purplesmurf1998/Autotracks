const express = require('express');
const router = express.Router({ mergeParams: true });

const {
    getSalesByTime
} = require('../controllers/saleController');

// get authentication middleware
const { protect, hasPermissions } = require('../middleware/auth');

// add .get(protect, getSalesByTime) later
router.route('/visual3')
    .get(getSalesByTime)

module.exports = router;