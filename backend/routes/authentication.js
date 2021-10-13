const express = require('express');
const router = express.Router();

// get the methods from the authenticationController
const {
    signIn,
    logout
} = require('../controllers/authenticationController');

// attach methods to the proper routes
router.route('/signin').post(signIn);
router.route('/logout').get(logout);

// export the router so it can be used in the server.js file
module.exports = router;