const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.ObjectId,
    ref: 'Vehicle',
    required: [true, 'A comment must be attached to a vehicle.']
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A comment must have an author.']
  },
  comment: {
    type: String,
    required: [true, 'Comment must have some content.']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;