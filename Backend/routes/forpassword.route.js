import express from "express";

import {
  forgotPassword,
  verifyCode,
  resetPassword,
} from "../controller/forpassword.controller.js";
const router = express.Router();

// Define authentication routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-code", verifyCode);
router.post("/reset-password", resetPassword);

export default router;
