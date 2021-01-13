const TrackModel = require('../models/track.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const md5 = require('md5');
const dotenv = require('dotenv');
dotenv.config();

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
        const track = await TrackModel.findOne({ id: req.params.id });
        if (!track) {
            throw new HttpException(404, 'Track not found');
        }

        res.send(track);
    };

    getTracksByUserId = async (req, res, next) => {
        const track = await TrackModel.find({ user: req.params.user });
        if (!track) {
            throw new HttpException(404, 'Tracks not found');
        }

        res.send(track);
    };

    createTrack = async (req, res, next) => {
        this.checkValidation(req);
        // Generate unique identificator 'hashString'
        await this.hashTitle(req);
        // Add user id in body from req.currentUser 
        await this.addUserId(req);

        const result = await TrackModel.create(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send({ ...req.body });


        // res.status(201).send(req.hashString);
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

        const message = !affectedRows ? 'User not found' :
            affectedRows && changedRows ? 'User updated successfully' : 'Updated faild';

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
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation failed', errors);
        }
    }

    // hash track title
    hashTitle = async (req) => {
        if (req.body.title) {
            req.body.hashString = await md5(req.body.title + new Date().toISOString() + Math.random().toString());
        }
    }

    // add user id
    addUserId = async (req) => {
        if (req.currentUser.id) {
            req.body.user = req.currentUser.id;
        } else {
            throw new HttpException(401, 'Auth information is requied', errors);
        }
    }

}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new TrackController;