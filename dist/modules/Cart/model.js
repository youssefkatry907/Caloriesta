"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../database/mongo"));
const Cart = new mongo_1.default.Schema({
    user: { type: mongo_1.default.SchemaTypes.ObjectId, ref: "User" },
    resturant: { type: mongo_1.default.SchemaTypes.ObjectId, ref: "User" || null },
    payment: { type: String, enum: ["cash", "visa"] },
    coupon: { type: mongo_1.default.SchemaTypes.ObjectId, ref: "Coupon" || null },
    items: [
        {
            product: { type: mongo_1.default.SchemaTypes.ObjectId, ref: "Meal" },
            price: Number,
            quantity: Number,
            total: Number,
            option: Object,
            addons: [Object],
        },
    ],
    financial: {
        taxFees: {
            price: Number,
            type: {
                type: String,
                enum: ["fixed", "ratio"],
            },
        },
        paymentFees: { type: Number, default: 0 },
        deliveryFees: { type: Number, default: 0 },
        couponDiscount: { type: Number, default: 0 },
        totalItemsCost: { type: Number, default: 0 },
    },
    total: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false },
}, {
    timestamps: true,
});
exports.default = mongo_1.default.model("Cart", Cart);
