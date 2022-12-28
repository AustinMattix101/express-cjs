const User = require("../models/User.js");
const ErrorResponse  = require("../utils/errorResponse.js");

async function PreferedTwoFA (req, res, next) {
    const { altid } = req.user;
    const { preferedTwoFA } = await User.findOne({ altid });

    try {
        if (!preferedTwoFA) {
            return next(new ErrorResponse( `2FA mode is off, Please turn it on then try again`, 403));
        }
        next();
    } catch (error) {
        return next(new ErrorResponse(`You are in a state which 2FA authentication is not enabled! ${error}`, 500));
    }
}

module.exports = PreferedTwoFA;