const { Router } = require('express');
const uploadRouter = Router();
const { protect } = require("../middlewares/auth.js");
const { corsWithOptions } = require("../middlewares/cors.js");
const {
    InitOnlyEmailConfirmation,
    InitpreferedTwoFAOption
} = require("../middlewares/init.js");

const { postUpload } = require("../controllers/upload.js");
const { UploadFiles, UploadMusic, UploadPhotos, UploadSquare, UploadVideos } = require("../middlewares/upload.js");

uploadRouter
    .route('/')
    .options(corsWithOptions)
    .post(
        protect,
        InitOnlyEmailConfirmation,
        InitpreferedTwoFAOption,
        UploadFiles('Files', 5),
        postUpload
    );

uploadRouter
    .route('/photo')
    .options(corsWithOptions)
    .post(
        protect,
        InitOnlyEmailConfirmation,
        InitpreferedTwoFAOption,
        UploadPhotos('Photos', 5),
        postUpload
    );

uploadRouter
    .route('/square')
    .options(corsWithOptions)
    .post(
        protect,
        InitOnlyEmailConfirmation,
        InitpreferedTwoFAOption,
        UploadSquare('Squares', 5),
        postUpload
    );

uploadRouter
    .route('/video')
    .options(corsWithOptions)
    .post(
        protect,
        InitOnlyEmailConfirmation,
        InitpreferedTwoFAOption,
        UploadVideos('Videos', 5),
        postUpload
    );

uploadRouter
    .route('/music')
    .options(corsWithOptions)
    .post(
        protect,
        InitOnlyEmailConfirmation,
        InitpreferedTwoFAOption,
        UploadMusic('Music', 5),
        postUpload
    );

module.exports = uploadRouter;