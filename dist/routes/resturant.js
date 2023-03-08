"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const resturant_1 = require("../controllers/resturant");
const router = express_1.default.Router();
router.get("/meals", resturant_1.listMeals);
router.get("/meals/:id", resturant_1.listMeals);
router.post("/meals", resturant_1.createMeal);
router.put("/meals/:id", resturant_1.updateMeal);
router.patch("/meals/:id/update-image", resturant_1.updateMealImage);
router.delete("/meals/:id", resturant_1.deleteMeal);
exports.default = router;
