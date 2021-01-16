const express = require("express");
const dotenv = require('dotenv');
const cors = require("cors");
const HttpException = require('./utils/HttpException.utils');
const errorMiddleware = require('./middleware/error.middleware');
const userRouter = require('./routes/user.route');
const trackRouter = require('./routes/track.route');
const path = require("path");

// Init express
const app = express();
// Init environment
dotenv.config({ path: path.join(__dirname,'/../.env')})
// parse requests of content-type: application/json
// parses incoming requests with JSON payloads
app.use(express.json());
// enabling cors for all requests by using cors middleware
app.use(cors());
// Enable pre-flight
app.options("*", cors());
// Add static files
const port = Number(process.env.PORT || 3331);

// set static directories
app.use(express.static(path.join(__dirname, 'public')));
// send /public/index.html 
// app.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname, gi'/public/index.html'));
// });

app.use(`/users`, userRouter);
app.use(`/tracks`, trackRouter);

// 404 error
app.use('*', (req, res, next) => {
    console.log("res", res);
    console.log("res", res);
    const err = new HttpException(404, 'Endpoint Not Found');
    next(err);
});

// Error middleware
app.use(errorMiddleware);

// starting the server
app.listen(port, () =>
    console.log(`🚀 Server running on port ${port}!`));


module.exports = app;