const multer = require('multer');
const { diskStorage } = require('multer');

const FilesArrivals = "server/public/files";
const SquareArrivals = "server/public/square";
const PhotosArrivals = "server/public/photos";
const VideosArrivals = "server/public/videos";
const MusicArrivals = "server/public/music";

module.exports.filesStorage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, FilesArrivals);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

module.exports.squareStorage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, SquareArrivals);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

module.exports.photosStorage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, PhotosArrivals);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

module.exports.videosStorage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, VideosArrivals);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

module.exports.musicStorage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, MusicArrivals);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});