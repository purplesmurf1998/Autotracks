const express = require('express');
const router = express.Router();

// get the methods from the authenticationController
const {
    signIn,
    logout,
<<<<<<< HEAD
    register,
    verify
=======
    register
>>>>>>> 0d32b0b ([AP-54] Jenkins and Docker setup complete)
} = require('../controllers/authController');

// get authentication middleware
const { protect } = require('../middleware/auth');

// attach methods to the proper routes
router.route('/signin').post(signIn);
router.route('/register').post(register);
router.route('/logout').get(protect, logout);
<<<<<<< HEAD
router.route('/verify').post(verify)
=======
>>>>>>> 0d32b0b ([AP-54] Jenkins and Docker setup complete)

// export the router so it can be used in the server.js file
module.exports = router;