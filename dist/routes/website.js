"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const website_1 = require("../controllers/website");
const router = express_1.default.Router();
router.get("/", website_1.home);
exports.default = router;
