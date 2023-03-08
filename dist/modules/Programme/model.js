"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../database/mongo"));
const Programme = new mongo_1.default.Schema({
    user: { type: mongo_1.default.SchemaTypes.ObjectId, ref: "User" },
    title: {
        en: String,
        ar: String,
    },
    description: {
        en: String,
        ar: String,
    },
    details: [
        {
            day: String,
            categories: [{ name: String, details: String }],
        },
    ],
    code: String,
    days: String,
    price: { type: Number, default: 0 },
    purchasesCount: { type: Number, default: 0 },
    cover: String,
    file: String,
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
exports.default = mongo_1.default.model("Programme", Programme);
