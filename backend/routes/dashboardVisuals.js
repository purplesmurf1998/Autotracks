const express = require('express');
const router = express.Router({ mergeParams: true });

const {
    getSalesByTime
} = require('../controllers/saleController');

// get authentication middleware
const { protect } = require('../middleware/auth');

router.route('/visual3')
    .get(protect, getSalesByTime)

module.exports = router;