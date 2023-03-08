"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../../database/mongo"));
function discount(req) {
    if (req.query["resturant"]) {
        return {
            resturant: mongo_1.default.Types.ObjectId(req.query["resturant"]),
        };
    }
    else
        return false;
}
exports.default = discount;
