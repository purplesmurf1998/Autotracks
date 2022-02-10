const express = require('express');
const router = express.Router();

const {
    createLocationZone
} = require('../controllers/locationZoneController');

// get authentication middleware
const { protect, hasPermissions } = require('../middleware/auth');

router.route('/')
  .post(protect, createLocationZone)

module.exports = router;