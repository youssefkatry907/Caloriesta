"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../database/mongo"));
const Admin = new mongo_1.default.Schema({
    name: String,
    email: String,
    password: String,
    token: String,
}, {
    timestamps: true,
});
exports.default = mongo_1.default.model("Admin", Admin);
