const express = require('express');
const router = express.Router();

const {
    createSale,
    deleteSale,
    updateSale,
    getSale,
    getSales,
} = require('../controllers/saleController');

const {
  createEvent
} = require('../controllers/eventsController');

// get authentication middleware
const { protect, hasPermissions } = require('../middleware/auth');

router.route('/')
  .post(protect, createEvent, createSale)

router.route('/:saleId')
  .delete(protect, deleteSale)
  .put(protect, createEvent, updateSale)
  .get(protect, getSale)

router.route('/dealership/:dealershipId')
  .get(protect, getSales)

module.exports = router;