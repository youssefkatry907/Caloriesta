"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// create server
const app_1 = __importDefault(require("./app"));
const port = 9000;
const host = "127.0.0.1";
app_1.default.listen(port, host, () => {
    console.log(`Server is up and running on ${host}:${port}`);
});
