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

// attach methods to the proper routes
router.route('/')
    .get(getUsers)
    .post(createUser);

router.route('/:userId')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

// export the router so it can be used in the server.js file
module.exports = router;