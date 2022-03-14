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

const {
  createEvent
} = require('../controllers/eventsController');

const {
  createHistory
} = require('../controllers/historyController');

// get authentication middleware
const { protect, hasRoles } = require('../middleware/auth');

router.route('/')
  .post(protect, hasRoles('Administration', 'Management', 'Sales Rep'), createEvent, createHistory, createSale)

router.route('/:saleId')
  .delete(protect, hasRoles('Administration', 'Management', 'Sales Rep'), createHistory, deleteSale)
  .put(protect, hasRoles('Administration', 'Management', 'Sales Rep'), createEvent, createHistory, updateSale)
  .get(protect, getSale)

router.route('/dealership/:dealershipId')
  .get(protect, hasRoles('Administration', 'Management', 'Sales Rep'), getSales)

module.exports = router;