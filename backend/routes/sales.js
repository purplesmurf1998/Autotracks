const express = require('express');
const router = express.Router();

const {
    createSale,
    deleteSale,
    updateSale,
    getSale,
    getSales,
    getSalesByTime
} = require('../controllers/saleController');

// get authentication middleware
const { protect, hasPermissions } = require('../middleware/auth');

router.route('/')
  .post(protect, createSale)

router.route('/:saleId')
  .delete(protect, deleteSale)
  .put(protect, updateSale)
  .get(protect, getSale)

router.route('/dealership/:dealershipId')
  .get(protect, getSales)

module.exports = router;