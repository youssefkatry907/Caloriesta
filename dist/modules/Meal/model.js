"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../database/mongo"));
const mongoose_aggregate_paginate_v2_1 = __importDefault(require("mongoose-aggregate-paginate-v2"));
const Meal = new mongo_1.default.Schema({
    resturant: { type: mongo_1.default.SchemaTypes.ObjectId, ref: "User" },
    name: {
        ar: {
            type: String,
        },
        en: {
            type: String,
        },
    },
    stringQuery: String,
    description: {
        ar: String,
        en: String,
    },
    category: {
        type: mongo_1.default.SchemaTypes.ObjectId,
        ref: "Category",
        required: [true, "Category is required"],
    },
    type: {
        type: String,
        enum: ["breakfast", "lunch", "dinner", "other"],
        default: "other",
    },
    sku: String,
    weight: { type: Number, default: 0 },
    calories: { type: Number, default: 0 },
    quantity: {
        type: Number,
        default: 0,
        min: [0, "at least zero"],
    },
    hints: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    image: String,
    offerCover: String,
    price: { type: Number, default: 1 },
    finalPrice: { type: Number, default: 1 },
    discount: {
        type: { type: String, enum: ["ratio", "fixed", "noDiscount"] },
        value: Number,
    },
    addons: [
        {
            name: { ar: String, en: String },
            price: { type: Number, default: 1 },
        },
    ],
    options: [
        {
            name: { ar: String, en: String },
            price: { type: Number, default: 1 },
        },
    ],
    rates: [
        {
            user: { type: mongo_1.default.SchemaTypes.ObjectId, ref: "User" },
            rate: { type: Number, enum: [0, 1, 2, 3, 4, 5], default: 0 },
            comment: String,
        },
    ],
    country: { type: String, required: [true, "Country is required"], default: "Egypt" },
    rate: { type: Number, enum: [0, 1, 2, 3, 4, 5], default: 0 },
    isActive: { type: Boolean, default: true },
    isInstant: { type: Boolean, default: true },
}, {
    timestamps: true,
});
Meal.plugin(mongoose_aggregate_paginate_v2_1.default);
exports.default = mongo_1.default.model("Meal", Meal);
