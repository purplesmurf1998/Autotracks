const express = require('express');
const router = express.Router();

const {
  getComments,
  editComment,
  deleteComment,
  createComment
} = require('../controllers/commentsController');

const {
  createHistory
} = require('../controllers/historyController');

// get authentication middleware
const { protect, hasPermissions } = require('../middleware/auth');

router.route('/vehicle/:vehicleId')
  .get(protect, getComments)
  .post(protect, createHistory, createComment);

router.route('/comment/:commentId')
  .put(protect, createHistory, editComment)
  .delete(protect, createHistory, deleteComment);

module.exports = router;