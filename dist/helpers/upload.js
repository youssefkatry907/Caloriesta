"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const formidable_1 = __importDefault(require("formidable"));
const fs_1 = __importDefault(require("fs"));
const extenstions = [".png", ".jpg", ".jpeg"];
function upload(pathName) {
    const uploadHandler = (0, formidable_1.default)({
        multiples: true,
        uploadDir: `./uploads/${pathName}`,
        maxFileSize: 1.5 * 1024 * 1024,
        maxFields: 4,
        keepExtensions: true,
    });
    if (!fs_1.default.existsSync(`./uploads/${pathName}`))
        fs_1.default.mkdirSync(`./uploads/${pathName}`, { recursive: true });
    return uploadHandler;
}
exports.default = upload;
