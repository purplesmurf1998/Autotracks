const express = require('express');
const router = express.Router();

const {
  getComments,
  editComment,
  deleteComment,
  createComment
} = require('../controllers/commentsController');

// get authentication middleware
const { protect, hasPermissions } = require('../middleware/auth');

router.route('/vehicle/:vehicleId')
  .get(protect, getComments)
  .post(protect, createComment);

router.route('/comment/:commentId')
  .put(protect, editComment)
  .delete(protect, deleteComment);

module.exports = router;