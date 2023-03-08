"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../database/mongo"));
const Industry = new mongo_1.default.Schema({
    name: {
        ar: {
            type: String,
        },
        en: {
            type: String,
        },
    },
    code: String,
    cover: String,
    isNutrition: { type: Boolean, default: false },
    isIndividual: { type: Boolean, default: true },
    sort: Number,
}, {
    timestamps: true,
});
exports.default = mongo_1.default.model("Industry", Industry);
