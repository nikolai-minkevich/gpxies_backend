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
dotenv.config({ path: __dirname + '/../.env'});
// parse requests of content-type: application/json
// parses incoming requests with JSON payloads
app.use(express.json());
// enabling cors for all requests by using cors middleware
app.use(cors());
// Enable pre-flight
app.options("*", cors());

app.use(fileUpload());

const port = Number(process.env.PORT || 3331);

// set static directories
app.use(express.static(path.join(__dirname, 'public')));
// send /public/index.html 
// app.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname, gi'/public/index.html'));
// });



app.post('/upload', function(req, res) {
    let sampleFile;
    let uploadPath;
  
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
  
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + '/gpx/' + sampleFile.name;
  
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function(err) {
      if (err)
        return res.status(500).send(err);
  
      res.send('File uploaded!');
    });
  });


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