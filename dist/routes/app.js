"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const screens = __importStar(require("../controllers/app/screens"));
const other = __importStar(require("../controllers/app/other"));
const filtration = __importStar(require("../controllers/app/filtration"));
const handleReq_1 = require("../middlewares/handleReq");
const router = express_1.default.Router();
// screens
router.get("/home", handleReq_1.handleCityReq, screens.home);
router.get("/restaurants", handleReq_1.handleCityReq, screens.restaurants);
router.get("/restaurants/:id", handleReq_1.handleCityReq, screens.restaurants);
router.get("/meals-screen", handleReq_1.handleCityReq, screens.mealsScreen);
router.get("/meals-screen/:id", handleReq_1.handleCityReq, screens.mealsScreen);
router.get("/consultants", handleReq_1.handleCityReq, screens.consultants);
router.get("/packages", screens.packages);
router.get("/packages/:id", screens.packages);
// others
router.get("/cities", other.cities);
router.get("/cities/:id", other.cities);
router.get("/industries", other.industries);
router.get("/industries/:id", other.industries);
router.get("/categories", other.categories);
router.get("/categories/:id", other.categories);
router.get("/pages", other.getPage);
router.post("/messages", other.sendMessage);
// Filtration
router.get("/users", handleReq_1.handleCityReq, filtration.users);
router.get("/users/:id", filtration.users);
router.get("/meals", handleReq_1.handleCityReq, filtration.meals);
exports.default = router;
