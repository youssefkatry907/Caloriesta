"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../database/mongo"));
const Coupon = new mongo_1.default.Schema({
    code: String,
    startDate: String,
    endDate: String,
    count: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    discountType: { type: String, enum: ["fixed", "ratio"] },
    cover: String,
    isActive: { type: Boolean, default: false },
    minOrder: { type: Number, default: 0 },
}, { timestamps: true });
exports.default = mongo_1.default.model("Coupon", Coupon);
