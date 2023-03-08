"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPath = void 0;
function getPath() {
    return process.env.NODE_ENV === "development"
        ? "http://localhost:9000/"
        : "http://192.241.145.207/";
}
exports.getPath = getPath;
