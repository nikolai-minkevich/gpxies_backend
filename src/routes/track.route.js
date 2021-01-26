const express = require('express');
const router = express.Router();
const trackController = require('../controllers/track.controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createTrackSchema, updateTrackSchema } = require('../middleware/validators/trackValidator.middleware');


router.get('/', auth(), awaitHandlerFactory(trackController.getAllTracks)); // localhost:3000/api/v1/users
router.get('/id/:hashString', auth(), awaitHandlerFactory(trackController.getTrackById)); // localhost:3000/api/v1/users/id/1
router.get('/download/:hashString', auth(), awaitHandlerFactory(trackController.downloadTrackById)); // localhost:3000/api/v1/users/id/1
router.get('/username/:id', auth(), awaitHandlerFactory(trackController.getTracksByUserId)); // localhost:3000/api/v1/users/usersname/julia
router.post('/upload', auth(), awaitHandlerFactory(trackController.uploadTrack));
router.post('/', auth(), createTrackSchema, awaitHandlerFactory(trackController.createTrack)); // localhost:3000/api/v1/users
router.patch('/id/:id', auth(), updateTrackSchema, awaitHandlerFactory(trackController.updateTrack)); // localhost:3000/api/v1/users/id/1 , using patch for partial update
router.delete('/id/:id', auth(), awaitHandlerFactory(trackController.deleteTrack)); // localhost:3000/api/v1/users/id/1

module.exports = router;