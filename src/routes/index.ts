import express from "express";
import appRoutes from "./app";
import adminRoutes from "./admin";
import customerRoutes from "./customer";
import resturantRoutes from "./resturant";
import websiteRoutes from "./website";
import cartRoutes from "./cart";
import handleReq from "../middlewares/handleReq";
import paymentRoutes from "../routes/payment"

const app = express();

app.use("/api/v1/app", appRoutes);
app.use("/api/v1/payment", paymentRoutes)
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/customer", handleReq, customerRoutes);
app.use("/api/v1/resturant", handleReq, resturantRoutes);
app.use("/api/v1/cart", handleReq, cartRoutes);
app.use("/", websiteRoutes);

export default app;
