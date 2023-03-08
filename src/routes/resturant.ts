import express from "express";
import {
  updateMeal,
  createMeal,
  deleteMeal,
  updateMealImage,
  listMeals,
} from "../controllers/resturant";

const router = express.Router();

router.get("/meals", listMeals);
router.get("/meals/:id", listMeals);
router.post("/meals", createMeal);
router.put("/meals/:id", updateMeal);
router.patch("/meals/:id/update-image", updateMealImage);
router.delete("/meals/:id", deleteMeal);

export default router;
