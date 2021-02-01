const TrackModel = require('../models/track.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const md5 = require('md5');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');
const util = require('util');
const GpxParser = require('../utils/GpxParser');
///////////////////
// var parser = require('fast-xml-parser');
// var he = require('he');
// var ParserXML = require("fast-xml-parser").j2xParser;
///////////////////
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
    // look for record in table
    console.log('req.params.hashString', req.params.hashString);
    const track = await TrackModel.findOne({
      hashString: req.params.hashString,
    });
    if (!track) {
      throw new HttpException(404, 'Track not found');
    }
    res.send(track);

    // if ok, load it
    // асинхронное чтение
    // fs.readFile('hello.gpx', 'utf8', function (error, data) {
    //   console.log('Асинхронное чтение файла');
    //   // if (error) throw error;

    // });

    // const file = `${__dirname}/../../gpx/${req.params.hashString}.gpx`;
    // res.download(file, `track_${req.params.hashString}.gpx`);
  };

  getTrackPoints = async (req, res, next) => {
    // look for record in table
    console.log('req.params.hashString', req.params.hashString);
    const track = await TrackModel.findOne({
      hashString: req.params.hashString,
    });
    if (!track) {
      throw new HttpException(404, 'Track not found');
    }
    const readFile = util.promisify(fs.readFile);

    let xmlData = await readFile(__dirname + `/../../gpx/${req.params.hashString}_2.gpx`);

    xmlData = xmlData.toString();

    const gpxParser = new GpxParser();
    let jsondata = gpxParser.loadGpx(xmlData);
    console.log(jsondata);
    jsondata = gpxParser.prepare();
    res.send(jsondata);
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
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(422).send('Error');
    }
    // Generate unique identificator 'hashString'
    const hashString = this.generateHash();
    const uploadPath = __dirname + process.env.UPLOAD_DIR + hashString + '.gpx';

    // Get data from uploaded file
    const gpxFile = req.files.gpxFile.data.toString();

    // Create
    const gpxParser = new GpxParser();
    gpxParser.loadGpx(gpxFile);
    gpxParser.prepare();
    const gpxOutput = gpxParser.createXmlGpx();

    const writeFile = util.promisify(fs.writeFile);
    await writeFile(uploadPath, gpxOutput);

    res.status(201).send({ hashString, ...gpxParser.getMetadata() });
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

    const message = !affectedRows ? 'User not found' : affectedRows && changedRows ? 'User updated successfully' : 'Updated faild';

    res.send({ message, info });
  };

  deleteTrack = async (req, res, next) => {
    const result = await TrackModel.delete(req.params.id);
    if (!result) {
      throw new HttpException(404, 'Track not found');
    }
    res.send('Track has been deleted');
  };

  deleteMultipleTracks = async (req, res, next) => {
    console.log('req.body', req.body);
    const result = await TrackModel.deleteMultiple(req.body);
    if (!result) {
      throw new HttpException(404, 'Tracks not found');
    }
    res.send('Tracks has been deleted');
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
