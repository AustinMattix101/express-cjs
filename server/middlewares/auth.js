const jsonwebtoken = require('jsonwebtoken');
const { verify } = jsonwebtoken;
const User = require("../models/User.js");
const ErrorResponse = require("../utils/errorResponse.js");

module.exports.protect = async function (req, res, next) {
    let token;

    const headers = req.headers[`authorization`];

    if (headers && headers.startsWith("Bearer")) {
        // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNDFlYTFmNWEwOWJiZDZmNTQ1MmEwZiIsImlhdCI6MTY2NTI2NDE1OSwiZXhwIjoxNjY1MjY0NzU5fQ.f6Mm729KQicnx6YXdr7TFESSQgzRDJ3qBPPdY7OYGKQ
        token = headers.split(" ")[1];
    }

    if(!token) {
        return next(new ErrorResponse("No signed-token found!, Not authorized to access this route.", 401));
    }

    try {
        const decoded = verify(String(token), process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return next(new ErrorResponse("No user found with this given ID.", 404));
        }

        const { altid, username, email, ...other } = user;
        req.user = { altid, username, email };

        next();
    } catch (error) {
        return next(new ErrorResponse("Not authorized to access this route", 401));
    }
}

module.exports.AdminProtect = async function (req, res, next) {
    const { altid } = req.user;
    const { role } = await User.findOne({ altid });

    try {
        
        if (role !== `admin`) {
            return next(new ErrorResponse(`You are not authorized access this route only admins are allow!`, 403));
        }
        next();
    } catch (error) {
        return next(new ErrorResponse(`You are in a state which no role options in database!`, 500));
    }

}