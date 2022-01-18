const express = require('express');
const router = express.Router();

const {
    createSale,
    deleteSale,
} = require('../controllers/saleController');

// get authentication middleware
const { protect, hasPermissions } = require('../middleware/auth');

router.route('/')
  .post(protect, createSale)

router.route('/:saleId')
  .delete(protect, deleteSale);

module.exports = router;