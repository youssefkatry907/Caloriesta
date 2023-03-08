import express from "express";
import { home } from "../controllers/website";

const router = express.Router();

router.get("/", home);

export default router;
