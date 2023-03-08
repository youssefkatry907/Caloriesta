"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function country(req) {
    if (req.query["name"]) {
        return {
            stringQuery: { $regex: decodeURI(req.query["country"]), $options: "i" },
        };
    }
    else
        return false;
}
exports.default = country;
