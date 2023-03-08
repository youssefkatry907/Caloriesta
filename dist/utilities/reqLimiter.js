"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const redis_1 = __importDefault(require("../database/redis"));
const reqLimiter = new rate_limiter_flexible_1.RateLimiterRedis({
    storeClient: redis_1.default,
    keyPrefix: "middleware",
    points: 50,
    duration: 20, // per 20 second by IP
});
const reqLimiterMiddleware = (req, res, next) => {
    reqLimiter
        .consume(req.ip)
        .then(() => {
        next();
    })
        .catch(() => {
        res.status(429).json({
            message: "Too many requested",
        });
    });
};
exports.default = reqLimiterMiddleware;
