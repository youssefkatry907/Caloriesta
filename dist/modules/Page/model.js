"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../database/mongo"));
const Page = new mongo_1.default.Schema({
    about: {
        ar: String,
        en: String,
    },
    privacy: {
        ar: String,
        en: String,
    },
    conditions: {
        ar: String,
        en: String,
    },
    refund: {
        ar: String,
        en: String,
    },
}, {
    timestamps: true,
});
exports.default = mongo_1.default.model("Page", Page);
