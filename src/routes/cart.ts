import express from "express";
import {
  getUserCart,
  addItem,
  updatItemQuantity,
  updateItemQuantity,
  flushUserCart,
  removeItem,
  validateCoupon,
} from "../controllers/cart";
import { createOrder } from "../controllers/order";
import { isCustomer } from "../middlewares";


const router = express.Router();

router.get("/", isCustomer, getUserCart);
router.post("/:id", isCustomer, addItem);
router.post("/:id/checkout", isCustomer, createOrder);
router.post("/:id/coupon", isCustomer, validateCoupon);
router.patch("/:id", isCustomer, updatItemQuantity);
router.patch("/:id/update-quantity", isCustomer, updateItemQuantity);
router.delete("/:id/item", isCustomer, removeItem);
router.delete("/:id/flush", isCustomer, flushUserCart);

export default router;
