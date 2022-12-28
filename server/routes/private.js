const { Router } = require("express");
const router = Router();
const { corsWithOptions } = require("../middlewares/cors.js");
const { getPrivateData } = require("../controllers/private.js");
const { protect } = require("../middlewares/auth.js");
const { 
    InitOnlyEmailConfirmation,
    InitpreferedTwoFAOption 
} = require("../middlewares/init.js");

router.route("/")
    .options(corsWithOptions)
    .get(
        protect, 
        InitOnlyEmailConfirmation, 
        InitpreferedTwoFAOption, 
        getPrivateData
    );

module.exports = router;