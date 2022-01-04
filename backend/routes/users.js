const express = require('express');
const router = express.Router();

// get the methods from the authenticationController
const {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser
} = require('../controllers/usersController');

// get authentication middleware
const { protect, hasPermissions } = require('../middleware/auth');

// attach methods to the proper routes
router.route('/')
    .get(protect, hasPermissions('View Staff Users'), getUser)//wrong function used here, should be getUsers
    .post(protect, hasPermissions('Add Staff Users'), createUser);

router.route('/:userId')
    .get(protect, hasPermissions('View Staff Users'), getUser)
    .put(protect, hasPermissions('Edit Staff Users'), updateUser)
    .delete(protect, hasPermissions('Delete Staff Users'), deleteUser);

// export the router so it can be used in the server.js file
module.exports = router;