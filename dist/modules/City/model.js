"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../database/mongo"));
const City = new mongo_1.default.Schema({
    name: {
        ar: {
            type: String,
        },
        en: {
            type: String,
        },
    },
    phoneCode: String,
    phoneLength: Number,
    code: String,
    cover: String,
    sort: Number,
    currency: {
        name: { en: String, ar: String },
        code: String,
    },
    regions: [
        {
            name: { ar: String, en: String },
            code: String,
            sort: Number || String,
        },
    ],
    pointPrice: Number
}, {
    timestamps: true,
});
exports.default = mongo_1.default.model("City", City);
