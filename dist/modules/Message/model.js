"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../database/mongo"));
const Message = new mongo_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: false },
    phone: { type: String, required: true },
    message: { type: String, required: true },
}, {
    timestamps: true,
});
exports.default = mongo_1.default.model("Message", Message);
