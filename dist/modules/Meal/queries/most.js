"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function most(req) {
    let query = {};
    if (req.query.unactive)
        query["isActive"] = false;
    if (req.query.brokenCover)
        query["gallaries"] = [];
    if (req.query.mosthinted)
        query["hints"] = { $gte: 1 };
    if (req.query.mostOrders)
        query["orders"] = { $gte: 1 };
    if (req.query.lessQuantity)
        query["quantity"] = { $lte: 5 };
    if (Object.keys(query).length)
        return query;
    else
        return false;
}
exports.default = most;
