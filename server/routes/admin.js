const { Router } = require ("express");
const router = Router();
const { corsWithOptions } = require("../middlewares/cors.js");
const { getAdminData } = require("../controllers/admin.js");
const { protect, AdminProtect } = require("../middlewares/auth.js");
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
        AdminProtect, getAdminData
    );

module.exports = router;