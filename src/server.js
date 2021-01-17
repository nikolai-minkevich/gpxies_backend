const express = require("express");
const dotenv = require('dotenv');
const cors = require("cors");
const HttpException = require('./utils/HttpException.utils');
const errorMiddleware = require('./middleware/error.middleware');
const userRouter = require('./routes/user.route');
const trackRouter = require('./routes/track.route');
const path = require('path');
const fileUpload = require('express-fileupload');

// Init express
const app = express();
// Init environment
dotenv.config({ path: __dirname + '/../.env' });
// parse requests of content-type: application/json
// parses incoming requests with JSON payloads

app.use(express.json());

// enabling cors for all requests by using cors middleware
app.use(cors());
app.options("*", cors());


// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control, Key, Access-Control-Allow-Origin");
//   next();
// });

app.use(fileUpload());

const port = Number(process.env.PORT || 3331);

// set static directories
app.use(express.static(path.join(__dirname, 'public')));

app.use(`/users`, userRouter);
app.use(`/tracks`, trackRouter);

// 404 error
app.use('*', (req, res, next) => {
  console.log(req.body);
  const err = new HttpException(404, 'Endpoint Not Found');
  next(err);
});

// Error middleware
app.use(errorMiddleware);

// starting the server
app.listen(port, () =>
  console.log(`🚀 Server running on port ${port}!`));

module.exports = app;