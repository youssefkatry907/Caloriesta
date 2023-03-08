"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../database/mongo"));
/**
 * order status
 * 1 -------> pending
 * 2 -------> in Deliver
 * 3 -------> compeleted
 * 4 -------> canceled
 */
const Order = new mongo_1.default.Schema({
    code: String,
    cart: { type: mongo_1.default.SchemaTypes.ObjectId, ref: "Cart" },
    resturant: { type: mongo_1.default.SchemaTypes.ObjectId, ref: "Cart" },
    user: { type: mongo_1.default.SchemaTypes.ObjectId, ref: "User" },
    total: Number,
    shippingAddress: {
        address: String,
        flatNo: String,
        block: String,
        street: String,
        lat: Number,
        lng: Number,
    },
    payment: String,
    status: { type: Number, enum: [1, 2, 3, 4] },
}, { timestamps: true });
exports.default = mongo_1.default.model("Order", Order);
