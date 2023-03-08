import express from "express";

import {
  login,
  register,
  updateInfo,
  getInfo,
  getResetCode,
  validateResetCode,
  resetPassword,
  updateFiles,
  getAddress,
  addAddress,
  updateAddress,
  removeAddress
} from "../controllers/customer";
import { isCustomer } from "../middlewares";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/reset-password-code", getResetCode);
router.post("/validate-reset-code", validateResetCode);
router.post("/reset-password", resetPassword);
router.patch("/update-files", isCustomer, updateFiles);
router.get("/me", isCustomer, getInfo);
router.patch("/me", isCustomer, updateInfo);
router.put("/me", isCustomer, updateInfo);

//addresses
router.get("/addresses/:id", getAddress)
router.post("/addresses/:id", addAddress)
router.put("/addresses/:id/:index", updateAddress)
router.delete("/addresses/:id/:index", removeAddress)

export default router;
