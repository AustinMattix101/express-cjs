"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMattixAPI = exports.getAPI = void 0;
function getAPI(_req, res, _next) {
    res.status(200).json({ message: `Welcome to Mattix API` });
}
exports.getAPI = getAPI;
function getMattixAPI(_req, res, _next) {
    res.status(200).json({
        message: `Welcome to Mattix Team API! ;)`
    });
}
exports.getMattixAPI = getMattixAPI;
//# sourceMappingURL=api.js.map