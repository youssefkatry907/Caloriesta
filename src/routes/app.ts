import express from "express";
import * as screens from "../controllers/app/screens";
import * as other from "../controllers/app/other";
import * as filtration from "../controllers/app/filtration";
import { handleCityReq } from "../middlewares/handleReq";
import { getOrderDetails, getUserOrders, updateOrderStatus } from "../controllers/order";
import { getNotification, listNotifications, removeNotification, sendNotification } from "../controllers/Notifications";
import { getMessage, sendMessage, listMessages, deleteMessage } from "../controllers/chat";
import { initiatePayment, excutePayment } from "../services/myFatoorah/payment";

const router = express.Router();
// screens
router.get("/home", handleCityReq, screens.home);
router.get("/restaurants", handleCityReq, screens.restaurants);
router.get("/restaurants/:id", handleCityReq, screens.restaurants);
router.get("/meals-screen", handleCityReq, screens.mealsScreen);
router.get("/meals-screen/:id", handleCityReq, screens.mealsScreen);
router.get("/consultants", handleCityReq, screens.consultants);
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
router.get("/users", handleCityReq, filtration.users);
router.get("/users/:id", filtration.users);
router.get("/meals", handleCityReq, filtration.meals);

//Orders
router.get("/orders/:id/list", getUserOrders);
router.get("/orders/:id", getOrderDetails);
router.put("/orders/:orderId/:userId/:status", updateOrderStatus);

//Notifications
router.post("/notifications", sendNotification);
router.get("/notifications/:id", getNotification);
router.get("/notifications/:id/list", listNotifications);
router.delete("/notifications/:id", removeNotification);

//Chat
router.post("/chat", sendMessage);
router.get("/chat/:id", getMessage);
router.get("/chat/:id/list", listMessages);
router.delete("/chat/:id", deleteMessage);

//payment
// router.post("/payment", initiatePayment)
// router.post("/payment/excute", excutePayment);

export default router;
