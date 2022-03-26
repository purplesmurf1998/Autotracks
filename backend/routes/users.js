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
const { protect, hasRoles } = require('../middleware/auth');

// attach methods to the proper routes
router.route('/')
    .get(protect, hasRoles('Administration', 'Management', 'Sales Rep'), getUsers)
    .post(protect, hasRoles('Administration', 'Management'), createUser);

router.route('/:userId')
    .get(protect, getUser)
    .put(protect, updateUser)
    .delete(protect, hasRoles('Administration', 'Management'), deleteUser);

// export the router so it can be used in the server.js file
module.exports = router;