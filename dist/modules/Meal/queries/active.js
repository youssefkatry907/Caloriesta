"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function active(req) {
    if (req.query["active"]) {
        return {
            isActive: req.query["active"] == "true" ? true : false,
        };
    }
    else
        return false;
}
exports.default = active;
