"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_1 = require("../controllers/cart");
const order_1 = require("../controllers/order");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
router.get("/", middlewares_1.isCustomer, cart_1.getUserCart);
router.post("/:id", middlewares_1.isCustomer, cart_1.addItem);
router.post("/:id/checkout", middlewares_1.isCustomer, order_1.createOrder);
router.post("/:id/coupon", middlewares_1.isCustomer, cart_1.validateCoupon);
router.patch("/:id", middlewares_1.isCustomer, cart_1.updatItemQuantity);
router.patch("/:id/update-quantity", middlewares_1.isCustomer, cart_1.updateItemQuantity);
router.delete("/:id/item", middlewares_1.isCustomer, cart_1.removeItem);
router.delete("/:id/flush", middlewares_1.isCustomer, cart_1.flushUserCart);
exports.default = router;
