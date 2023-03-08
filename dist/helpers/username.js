"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUsername = void 0;
function handleUsername(name) {
    return name.trim().replace(/ /g, "_").toLowerCase().slice(0, 15);
}
exports.handleUsername = handleUsername;
