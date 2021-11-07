const express = require('express');
const router = express.Router();

// get the methods from the authenticationController
const {
    signIn,
    logout,
    register,
    verify,
    verifyPassword
} = require('../controllers/authController');

// get authentication middleware
const { protect } = require('../middleware/auth');

// attach methods to the proper routes
router.route('/signin').post(signIn);
router.route('/register').post(register);
router.route('/logout').get(protect, logout);
router.route('/verify').post(verify);
router.route('/password').post(protect, verifyPassword);

// export the router so it can be used in the server.js file
module.exports = router;