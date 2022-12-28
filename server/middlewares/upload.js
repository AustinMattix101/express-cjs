const multer = require('multer');
const { filesStorage, musicStorage, photosStorage, squareStorage, videosStorage } = require('../config/multer');
const { filesFilter, musicFilter, photosFilter, squareFilter, videosFilter } = require('../utils/multer');

module.exports.UploadFiles = (key, maxCount) => multer({ storage: filesStorage, fileFilter: filesFilter }).array(key, maxCount);

module.exports.UploadPhotos = (key, maxCount) => multer({ storage: photosStorage, fileFilter: photosFilter }).array(key, maxCount);

module.exports.UploadSquare = (key, maxCount) => multer({ storage: squareStorage, fileFilter: squareFilter }).array(key, maxCount);

module.exports.UploadVideos = (key, maxCount) => multer({ storage: videosStorage, fileFilter: videosFilter }).array(key, maxCount);

module.exports.UploadMusic = (key, maxCount) => multer({ storage: musicStorage, fileFilter: musicFilter }).array(key, maxCount);
