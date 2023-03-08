"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../database/mongo"));
const Package = new mongo_1.default.Schema({
    name: {
        ar: {
            type: String,
        },
        en: {
            type: String,
        },
    },
    details: { ar: String, en: String },
    code: String,
    icon: String,
    color: String,
    cities: [
        {
            city: { type: mongo_1.default.SchemaTypes.ObjectId, ref: "City" },
            wallet: { type: Number, default: 0 },
            price: Number,
        },
    ],
    sort: Number,
}, {
    timestamps: true,
});
exports.default = mongo_1.default.model("Package", Package);
