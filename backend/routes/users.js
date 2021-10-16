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
const { protect } = require('../middleware/auth');

// attach methods to the proper routes
router.route('/')
    .get(protect, getUsers)
    .post(protect, createUser);

router.route('/:userId')
    .get(protect, getUser)
    .put(protect, updateUser)
    .delete(protect, deleteUser);

// export the router so it can be used in the server.js file
module.exports = router;