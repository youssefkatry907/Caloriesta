import express from "express";

const router = express.Router();

import { initiatePayment, excutePayment } from "../services/myFatoorah/payment";

router.post('/initiatePayment', initiatePayment);
router.post('/excutePayment', excutePayment)

export default router;