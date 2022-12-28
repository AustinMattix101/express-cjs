const { getAPI, getCamunitedAPI } = require("../controllers/api.js");
const { corsWithOptions } = require("../middlewares/cors.js");
const { Router} = require("express");
const apiRouter = Router();

apiRouter
    .route("/")
    .options(corsWithOptions)
    .get(getAPI);

apiRouter
    .route("/camunited")
    .options(corsWithOptions)
    .get(getCamunitedAPI);

module.exports = apiRouter;