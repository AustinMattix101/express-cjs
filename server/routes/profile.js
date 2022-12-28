const { Router } = require('express');
const profilesRouter = Router();
const { protect, AdminProtect } = require("../middlewares/auth.js");
const { 
    InitOnlyEmailConfirmation,
    InitpreferedTwoFAOption 
} = require("../middlewares/init.js");
const { corsWithOptions } = require("../middlewares/cors.js");

const { findProfile, findProfileByUsername, writeProfile, updateProfile, clearProfile } = require("../controllers/profile.js");

const { updateProfileByUsername, deleteProfileByUsername } = require("../controllers/profile.js"); // Admin Only


profilesRouter
    .options(corsWithOptions)
    .get(
        '/',
        protect,
        InitOnlyEmailConfirmation, 
        InitpreferedTwoFAOption, 
        findProfile, 
        err => next(err)
    );

profilesRouter  // init email conf... 
    .options(corsWithOptions)
    .get(
        '/:username', 
        protect,
        InitOnlyEmailConfirmation,
        InitpreferedTwoFAOption,  
        findProfileByUsername,
        err => next(err)
    );

profilesRouter
    .options(corsWithOptions)
    .post(
        '/', 
        protect, 
        InitOnlyEmailConfirmation,
        InitpreferedTwoFAOption,
        writeProfile, 
        err => next(err)
    );

profilesRouter
    .options(corsWithOptions)
    .put(
        '/', 
        protect,
        InitOnlyEmailConfirmation,
        InitpreferedTwoFAOption, 
        updateProfile,
        err => next(err)
    );

profilesRouter
    .options(corsWithOptions)
    .delete(
        '/',
        protect,
        InitOnlyEmailConfirmation,
        InitpreferedTwoFAOption, 
        clearProfile,
        err => next(err)
    );

profilesRouter
    .options(corsWithOptions)
    .put(
        '/:username', 
        protect,
        InitOnlyEmailConfirmation,
        InitpreferedTwoFAOption,
        AdminProtect, 
        updateProfileByUsername,
        err => next(err)
    );

profilesRouter
    .options(corsWithOptions)
    .delete(
        '/:username',
        protect,
        InitOnlyEmailConfirmation,
        InitpreferedTwoFAOption,
        AdminProtect, 
        deleteProfileByUsername,
        err => next(err)
    );

module.exports = profilesRouter;