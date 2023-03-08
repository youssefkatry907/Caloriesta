"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function rate(req) {
    if (req.query["rate"]) {
        return {
            rate: {
                $gte: parseInt(req.query["rate"]),
            },
        };
    }
    else
        return false;
}
exports.default = rate;
