const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Comment = require('../models/Comment');
const Vehicle = require('../models/Vehicle');

// @desc        Get all comments for a specific vehicle
// @route       GET /api/v1/comments/vehicle/:vehicleId
// @access      Private
exports.getComments = asyncHandler(async (req, res, next) => {
  
  const comments = await Comment.find({vehicle: req.params.vehicleId})
    .sort({timestamp: -1})
    .populate('author');

  res.status(200).json({
    success: true,
    payload: comments,
    count: comments.length
  });
});

// @desc        Create a new comment for a specific vehicle
// @route       POST /api/v1/comments/vehicle/:vehicleId
// @access      Private
exports.createComment = asyncHandler(async (req, res, next) => {
  
  let comment = await Comment.create(req.body);

  comment = await comment.populate('author');

  res.status(200).json({
    success: true,
    payload: comment
  });
});

// @desc        Edit a comment for a specific vehicle
// @route       PUT /api/v1/comments/comment/:commentId
// @access      Private
exports.editComment = asyncHandler(async (req, res, next) => {
  
  let comment = await Comment.findById(req.params.commentId).populate('author');

  const author = comment.author;
  const user = req.user;

  if (author._id.toString() != user._id.toString()) {
    return next(
      new ErrorResponse(`Unauthorized to make this edit.`, 401)
    );
  }

  if (!req.body.comment) {
    return next(
      new ErrorResponse(`Bad request. Comment must have content.`, 400)
    );
  }

  comment.comment = req.body.comment;
  comment.edited = true;
  comment.save();

  res.status(200).json({
    success: true,
    payload: comment
  });  
});

// @desc        Delete a comment for a specific vehicle
// @route       DELETE /api/v1/comments/comment/:commentId
// @access      Private
exports.deleteComment = asyncHandler(async (req, res, next) => {

  // delete the comment
  await Comment.findByIdAndDelete(req.params.commentId);

  res.status(200).json({
    success: true,
    payload: {}
  });  
});