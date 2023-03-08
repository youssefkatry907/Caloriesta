"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function price(req) {
    if (req.query["price_from"] && req.query["price_to"]) {
        return {
            finalPrice: {
                $gte: parseInt(req.query["price_from"]),
                $lte: parseInt(req.query["price_to"]),
            },
        };
    }
    else
        return false;
}
exports.default = price;
