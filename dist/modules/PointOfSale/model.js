"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../database/mongo"));
const PointOfSale = new mongo_1.default.Schema({
    name: {
        ar: { type: String },
        en: { type: String },
    },
    country: { type: String, required: true },
    manger: { type: mongo_1.default.SchemaTypes.ObjectId, ref: "Admin", required: true },
    //password: { type: String, required: true },
    address: { type: String, required: true },
    policy: { type: String, required: false, default: "No Policy Defined!" },
    meals: [{ type: mongo_1.default.SchemaTypes.ObjectId, ref: "Meal" }]
}, { timestamps: true });
exports.default = mongo_1.default.model("PointOfSale", PointOfSale);
