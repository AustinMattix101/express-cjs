const ErrorResponse = require("../utils/errorResponse.js");

module.exports.filesFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(txt|json|js|jsx|ts|tsx|py|cpp|c|vb|vbs|cs|java|php|css|sass|xml|html|md|pdf|docx|bat|cmd|ps1|sh|zsh)$/)) {
        return cb(new ErrorResponse('You can upload only specific files extentions, learn more in documentation!', 400), false);
    } else {
        cb(null, true);
    }
}

module.exports.squareFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|ico|svg|eps)$/)) {
        return cb(new ErrorResponse('You can upload only specific support square image file extentions, learn more in documentation!', 400), false);
    } else {
        cb(null, true);
    }
}

module.exports.photosFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|ico|svg|eps)$/)) {
        return cb(new ErrorResponse('You can upload only specific support image file extentions, learn more in documentation!', 400), false);
    } else {
        cb(null, true);
    }
}

module.exports.videosFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(mp4|3pg|avi|f4v|flv|m4v|mkv|mov|mpeg|mpg|mts|ts|vob|webm|wmv)$/)) {
        return cb(new ErrorResponse('You can upload only specific support video file extentions, learn more in documentation!', 400), false);
    } else {
        cb(null, true);
    }
}

module.exports.musicFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(mp3|aac|m4a|ac3|wav|ogg|opus|flac|m4b|mp4)$/)) {
        return cb(new ErrorResponse('You can upload only specific support music file extentions, learn more in documentation!', 400), false);
    } else {
        cb(null, true);
    }
}