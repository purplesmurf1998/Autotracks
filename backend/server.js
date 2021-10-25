/*===============================================================

MAIN ENTRY POINT TO EXPRESS SERVER

This file is where we create the server, set up the routes,
set up the middleware and all other configs our server will
have. The file should finish by running the server and listening
on a certain PORT number.

=================================================================*/
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/error');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authenticationRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const dealershipsRoutes = require('./routes/dealerships');

// load in environment variables from config.env
// this lets us access env. variables by using proccess.env.[VARIABLE_NAME]
dotenv.config({ path: './config/config.env' });

// set up PORT number from env. variables, 5000 by default
const PORT = process.env.PORT || 5000;

// create the server app
const app = express();

// connect to mongoose
mongoose.connect(process.env.MONGODB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

// apply CORS to routes
app.use(cors());

// needed to be able to parse request body
app.use(express.json());

// needed to be able to parse request cookies
app.use(cookieParser());

// mount the routes to the app
app.use('/api/v1/auth', authenticationRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/dealerships', dealershipsRoutes);

// mount error handler middleware
app.use(errorHandler);

// launch server app by listening on the PORT
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  mongoose.connection.once("open", function () {
    console.log("Connected successfully to MongoDB");
  });
})

mongoose.connection.on("error", console.error.bind(console, "connection error: "));