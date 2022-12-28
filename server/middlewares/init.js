const User = require("../models/User.js");
const ErrorResponse = require("../utils/errorResponse.js");

// init Does user have been verfiy email and turn off isTwoFA available For > Log in

// init Does user have been verfiy email and turn on isTwoFA available For > Sign in

module.exports.InitOnlyEmailConfirmation = async function (req, res, next) {
    const { altid } = req.user;
    const { verifiedEmail } = await User.findOne({ altid });

    try {

      if (!verifiedEmail) {
        return next(new ErrorResponse(`Your registered Email is not verified yet! Make sure proccess is completed in order to continue...`, 403));
      } else {
        next();
      }
      
    } catch (error) {
        console.log(`Error: ${error}`);
        next(error);
    }
}

module.exports.InitpreferedTwoFAOption = async function (req, res, next) {
    const { altid } = req.user;
    const { preferedTwoFA, validationResetTime, validatedTwoFA } = await User.findOne({ altid });
  try {
    
    if (!preferedTwoFA) {

      next();
    } else {

      if (!validationResetTime) {

        return next(new ErrorResponse(`You are in a state which [Token] of 2FA (Two Factor) authentication is expired! Please valid your token to continue...`, 401));

      } else {

          if (!validatedTwoFA) {
              return next(new ErrorResponse(`You are in a state which 2FA (Two Factor) authentication is not validated! Please valid your authentication to continue...`, 401));
          } else {
              
              if (validationResetTime < Date.now()) {
                  return next(new ErrorResponse(`Your Two Factor Authentication Token is expired! Please Validated to continue...`, 401));
              } else {

                  next();
              }

          }

      }
    }

  } catch (error) {
    console.log(`Error: ${error}`);
    next(error);
  }
}