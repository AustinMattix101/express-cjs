"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("../controllers/api");
const cors_1 = require("../middlewares/cors");
const express_1 = require("express");
const apiRouter = (0, express_1.Router)();
apiRouter
    .route("/")
    .options(cors_1.corsWithOptions)
    .get(cors_1.cors, api_1.getAPI)
    .post(cors_1.cors, api_1.getAPI)
    .put(cors_1.cors, api_1.getAPI)
    .delete(cors_1.cors, api_1.getAPI);
apiRouter
    .route("/mattix")
    .options(cors_1.corsWithOptions)
    .get(cors_1.cors, api_1.getMattixAPI);
exports.default = apiRouter;
//# sourceMappingURL=api.js.map