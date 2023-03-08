"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function type(req) {
    if (req.query["type"]) {
        return {
            type: req.query["type"],
        };
    }
    else
        return false;
}
exports.default = type;
