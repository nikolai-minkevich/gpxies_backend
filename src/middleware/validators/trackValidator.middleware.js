const { body, check } = require('express-validator');
const Type = require('../../utils/trackTypes.utils');

//    	user	hashString	title	type	distance	created
exports.createTrackSchema = [
    // check('user')
    //     .exists()
    //     .withMessage('User id is required')
    //     .isNumeric()
    //     .withMessage('Must be a number'),
    check('title')
        .exists()
        .withMessage('Title is required'),
    check('type')
        .optional()
        .isIn([Type.Bike, Type.Hike, Type.Kayak, Type.Run, Type.Ski, Type.Other])
        .withMessage('Invalid type'),
    check('distance')
        .optional()
        .isNumeric()
        .withMessage('Must be a number')
];

exports.updateTrackSchema = [
    check('title')
        .exists()
        .withMessage('Title is required'),
    check('type')
        .optional()
        .isIn([Type.Bike, Type.Hike, Type.Kayak, Type.Run, Type.Ski, Type.Other])
        .withMessage('Invalid type'),
    check('distance')
        .optional()
        .isNumeric()
        .withMessage('Must be a number'),
    body()
        .custom(value => {
            return !!Object.keys(value).length;
        })
        .withMessage('Please provide required field to update')
        .custom(value => {
            const updates = Object.keys(value);
            const allowUpdates = ['title', 'type', 'distance'];
            return updates.every(update => allowUpdates.includes(update));
        })
        .withMessage('Invalid updates!')
];