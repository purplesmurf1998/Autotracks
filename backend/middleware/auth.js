const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// middleware to protect routes (check if authorized)
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // get the token from the headers
    token = req.headers.authorization.split(' ')[1];
  } 
  // else if (
  //   req.cookies.autotracksAuthToken
  // ) {
  //   // if no auth token in headers, check browser cookies
  //   token = req.cookies.autotracksAuthToken;
  // }

  // validate that token exists
  if (!token) {
    return next(
      new ErrorResponse('Not authorized to access this endpoint.', 401)
    )
  }

  try {
    // validate token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // find user inside the decoded token and attach it to the request
    // so that it can be used in protected routes
    req.user = await User.findById(decodedToken.userId);

    next();
  } catch (err) {
    return next(
      new ErrorResponse('Not authorized to access this endpoint.', 401)
    )
  }
});