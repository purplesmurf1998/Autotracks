const express = require('express');
const router = express.Router();

const {
    createSale,
} = require('../controllers/saleController');

// get authentication middleware
const { protect, hasPermissions } = require('../middleware/auth');

router.route('/')
  .post(protect, createSale);


module.exports = router;