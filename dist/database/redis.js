"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("redis"));
const redisClient = redis_1.default.createClient({
    host: "127.0.0.1",
    port: 6379,
    enable_offline_queue: false,
});
redisClient.on("error", (err) => console.log(err));
exports.default = redisClient;
