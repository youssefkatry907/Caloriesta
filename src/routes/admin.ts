import express from "express";
import { login, creatAdmin } from "../controllers/admin/auth";
import { statistics } from "../controllers/admin/statistics";
import {
  updateCity,
  createCity,
  deleteCity,
  updateCover,
} from "../controllers/admin/cities";
import {
  updatePackage,
  createPackage,
  deletePackage,
  updateCover as updatePackageCover,
} from "../controllers/admin/packages";
import {
  updateIndustry,
  createIndustry,
  deleteIndustry,
} from "../controllers/admin/industries";
import {
  updateCategory,
  createCategory,
  deleteCategory,
} from "../controllers/admin/categories";
import {
  updateMeal,
  createMeal,
  deleteMeal,
  updateMealImage,
  listMeals,
} from "../controllers/admin/meals";
import {
  createUser,
  updateUser,
  removeUser,
  toggleUserActive,
  toggleIsTop,
  listUser,
  updateUserFiles,
} from "../controllers/admin/users";
import {
  getSettings,
  updateSettings,
  updateFiles as updateSettingsFiles,
} from "../controllers/admin/settings";
import { updatePage } from "../controllers/admin/pages";
import { listMessages, removeMessage } from "../controllers/admin/messages";
import {
  createCoupon,
  deleteCoupon,
  listCoupons,
  updateCoupon,
} from "../controllers/admin/coupons";
import { getUserOrders, listOrders, updateOrder } from "../controllers/admin/orders"
import {
  listPointsOfSales,
  getPointOfSale,
  createPointOfSale,
  updatePointOfSale,
  deletePointOfSale,
  addMealToPoint,
  removeMealFromPoint

} from "../controllers/admin/points"

const router = express.Router();

router.get("/statistics", statistics);
router.post("/login", login);
router.post("/register", creatAdmin);

router.post("/cities", createCity);
router.put("/cities/:id", updateCity);
router.patch("/cities/:id/update-cover", updateCover);
router.delete("/cities/:id", deleteCity);

router.post("/packages", createPackage);
router.put("/packages/:id", updatePackage);
router.patch("/packages/:id/update-icon", updatePackageCover);
router.delete("/packages/:id", deletePackage);

router.get("/settings", getSettings);
router.put("/settings", updateSettings);
router.patch("/settings/updateFiles", updateSettingsFiles);

router.post("/industries", createIndustry);
router.put("/industries/:id", updateIndustry);
router.delete("/industries/:id", deleteIndustry);

router.get("/coupons", listCoupons);
router.get("/coupons/:id", listCoupons);
router.post("/coupons", createCoupon);
router.put("/coupons/:id", updateCoupon);
router.delete("/coupons/:id", deleteCoupon);

router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

router.get("/meals", listMeals);
router.get("/meals/:id", listMeals);
router.post("/meals", createMeal);
router.put("/meals/:id", updateMeal);
router.patch("/meals/:id/update-image", updateMealImage);
router.delete("/meals/:id", deleteMeal);

router.get("/messages", listMessages);
router.get("/messages/:id", listMessages);
router.delete("/messages/:id", removeMessage);

router.get("/users", listUser);
router.get("/users/:id", listUser);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.patch("/users/:id/active", toggleUserActive);
router.patch("/users/:id/is-top", toggleIsTop);
router.patch("/users/:id/files", updateUserFiles);
router.delete("/users/:id", removeUser);

router.patch("/pages", updatePage);

//orders
router.get("/orders", listOrders);
router.patch("/orders/:orderId/:userId/:status", updateOrder);


// Points Of Sales
router.get("/points", listPointsOfSales);
router.get("/points/:id", getPointOfSale);
router.post("/points", createPointOfSale);
router.put("/points/:id", updatePointOfSale);
router.delete("/points/:id", deletePointOfSale);

router.put("/points/:pointId/:mealId", addMealToPoint);
router.patch("/points/:pointId/:mealId", removeMealFromPoint);

export default router;
