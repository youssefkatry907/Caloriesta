"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function discount(req) {
    if (req.query["discount"] && req.query["discount"] == 1) {
        return {
            "discount.value": { $gte: 1 },
        };
    }
    else
        return false;
}
exports.default = discount;
