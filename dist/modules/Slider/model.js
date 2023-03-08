"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../database/mongo"));
const Slider = new mongo_1.default.Schema({
    user: { type: mongo_1.default.SchemaTypes.ObjectId, ref: "User" },
    cover: {
        ar: String,
        en: String,
    },
    onlyCover: { type: Boolean, default: true },
    item: { type: mongo_1.default.SchemaTypes.ObjectId, ref: "Meal", require: false },
}, {
    timestamps: true,
});
exports.default = mongo_1.default.model("Slider", Slider);
