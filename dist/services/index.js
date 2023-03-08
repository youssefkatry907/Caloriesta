"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
axios_1.default.defaults.baseURL =
    process.env.NODE_ENV == "development"
        ? "http://localhost:8084/system/api/v2"
        : "http://localhost:8084/system/api/v2";
axios_1.default.defaults.headers.common["x-app-token"] = "motajerSystemToken";
axios_1.default.defaults.headers.common["Content-Type"] =
    "application/x-www-form-urlencoded";
const endPoint = axios_1.default;
exports.default = endPoint;
