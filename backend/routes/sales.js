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

const {
  createHistory
} = require('../controllers/historyController');

// get authentication middleware
const { protect, hasPermissions } = require('../middleware/auth');

router.route('/')
  .post(protect, createEvent, createHistory, createSale)

router.route('/:saleId')
  .delete(protect, createHistory, deleteSale)
  .put(protect, createEvent, createHistory, updateSale)
  .get(protect, getSale)

router.route('/dealership/:dealershipId')
  .get(protect, getSales)

module.exports = router;