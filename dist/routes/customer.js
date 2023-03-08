"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customer_1 = require("../controllers/customer");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
router.post("/login", customer_1.login);
router.post("/register", customer_1.register);
router.post("/reset-password-code", customer_1.getResetCode);
router.post("/validate-reset-code", customer_1.validateResetCode);
router.post("/reset-password", customer_1.resetPassword);
router.patch("/update-files", middlewares_1.isCustomer, customer_1.updateFiles);
router.get("/me", middlewares_1.isCustomer, customer_1.getInfo);
router.patch("/me", middlewares_1.isCustomer, customer_1.updateInfo);
router.put("/me", middlewares_1.isCustomer, customer_1.updateInfo);
exports.default = router;
