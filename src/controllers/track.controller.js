const TrackModel = require('../models/track.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const md5 = require('md5');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/../../.env' });

/******************************************************************************
 *                              Track Controller
 ******************************************************************************/
class TrackController {
  getAllTracks = async (req, res, next) => {
    let trackList = await TrackModel.find();
    if (!trackList.length) {
      throw new HttpException(404, 'Tracks not found');
    }

    res.send(trackList);
  };

  getTrackById = async (req, res, next) => {
    const track = await TrackModel.findOne({
      hashString: req.params.hashString,
    });
    if (!track) {
      throw new HttpException(404, 'Track not found');
    }
    res.send(track);
  };

  downloadTrackById = async (req, res, next) => {
    const track = await TrackModel.findOne({
      hashString: req.params.hashString,
    });
    if (!track) {
      throw new HttpException(404, 'Track not found');
    }
    const file = `${__dirname}/../../gpx/${req.params.hashString}.gpx`;
    res.setHeader(
      'Content-disposition',
      `attachment; filename=track_${req.params.hashString}.gpx`
    );
    res.setHeader('Content-type', 'application/gpx+xml');
    res.download(file, `track_${req.params.hashString}.gpx`);
  };

  getTracksByUserId = async (req, res, next) => {
    const track = await TrackModel.find({ user: req.params.id });
    if (!track) {
      throw new HttpException(404, 'Tracks not found');
    }

    res.send(track);
  };
  getTracksByUsername = async (req, res, next) => {
    const track = await TrackModel.find({ user: req.params.user });
    if (!track) {
      throw new HttpException(404, 'Tracks not found');
    }

    res.send(track);
  };

  createTrack = async (req, res, next) => {
    this.checkValidation(req);

    // Add user id in body from req.currentUser
    await this.addUserId(req);

    const result = await TrackModel.create(req.body);

    if (!result) {
      throw new HttpException(523, 'Something went wrong');
    }

    res.status(201).send({ ...req.body });
  };

  uploadTrack = async (req, res, next) => {
    let gpxFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(422).send('Error');
    }
    // Generate unique identificator 'hashString'
    const hashString = this.generateHash();

    gpxFile = req.files.gpxFile;
    uploadPath = __dirname + process.env.UPLOAD_DIR + hashString + '.gpx';

    // Use the mv() method to place the file somewhere on your server
    gpxFile.mv(uploadPath, function (err) {
      if (err) {
        throw new HttpException(422, 'Something went wrong');
      }

      res.status(201).send({ hashString });
    });
  };

  updateTrack = async (req, res, next) => {
    this.checkValidation(req);

    // do the update query and get the result
    // it can be partial edit
    const result = await TrackModel.update(req.body, req.params.id);

    if (!result) {
      throw new HttpException(404, 'Something went wrong');
    }

    const { affectedRows, changedRows, info } = result;

    const message = !affectedRows
      ? 'User not found'
      : affectedRows && changedRows
      ? 'User updated successfully'
      : 'Updated faild';

    res.send({ message, info });
  };

  deleteTrack = async (req, res, next) => {
    const result = await TrackModel.delete(req.params.id);
    if (!result) {
      throw new HttpException(404, 'Track not found');
    }
    res.send('Track has been deleted');
  };

  checkValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpException(400, 'Validation failed', errors);
    }
  };

  // hash track title
  generateHash = () => {
    //   if (req.body.title) {
    return md5(new Date().toISOString() + Math.random().toString());
    //   }
  };

  // add user id
  addUserId = async (req) => {
    if (req.currentUser.id) {
      req.body.user = req.currentUser.id;
    } else {
      throw new HttpException(401, 'Auth information is requied', errors);
    }
  };

  // Todo Add check user
  // checkUserId = async (req) => {
  //     if (req.currentUser.id)
  // }
}

/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new TrackController();
