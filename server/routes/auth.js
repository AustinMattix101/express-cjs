const { Router } = require("express");
const router = Router();
const { 
    register, 
    login, 
    forgotpassword, 
    resetpassword, 
    getHello, 
    sendEmailConfirm,
    verifyEmail, 
    altPasswordConfirm,
    deleteAccountByUsername,
    changeEmail,
    findEmailByUsername,
    changeUsername, 
} = require("../controllers/auth.js");
const { 
    InitOnlyEmailConfirmation,
    InitpreferedTwoFAOption 
} = require("../middlewares/init.js");
const { corsWithOptions } = require("../middlewares/cors.js");
const { protect, AdminProtect } = require("../middlewares/auth.js");

router.route("/")
    .options(corsWithOptions)
    .get(getHello);

router.route("/register")
    .options(corsWithOptions)
    .post(register);

router.route("/login")
    .options(corsWithOptions)
    .post(login);

router.route("/forgotpassword")
    .options(corsWithOptions)
    .post(forgotpassword);

router.route("/resetpassword/:resetToken")
    .options(corsWithOptions)
    .put(resetpassword);

router.route("/sendconfirmemail")
    .options(corsWithOptions)
    .post(sendEmailConfirm);

router.route("/verifyemail")
    .options(corsWithOptions)
    .post(verifyEmail);

router.route("/findemail")
    .options(corsWithOptions)
    .post(findEmailByUsername);

router.route("/confirmpassword")
    .options(corsWithOptions)
    .post(
        protect,
        InitOnlyEmailConfirmation,
        InitpreferedTwoFAOption,
        altPasswordConfirm
    );

router.route("/delete/:username")
    .options(corsWithOptions)
    .delete(
        protect,
        InitOnlyEmailConfirmation,
        InitpreferedTwoFAOption,
        AdminProtect,
        deleteAccountByUsername
    );

router.route("/changeemail")
    .options(corsWithOptions)
    .put(
        protect,
        InitOnlyEmailConfirmation,
        InitpreferedTwoFAOption,
        changeEmail
    );

router.route("/changeusername")
    .options(corsWithOptions)
    .put(
        protect,
        InitOnlyEmailConfirmation,
        InitpreferedTwoFAOption,
        changeUsername
    );

module.exports = router;