import express from "express";
import { createGoal, deleteGoal, getGoal, updateGoal } from "../controller/goal.controller.js";
import { authenticate } from "../jwt/AuthToken.js";

const router = express.Router();

router.post("/target",authenticate, createGoal);

router.get("/fetch",authenticate, getGoal);

router.put("/update/:id",updateGoal)

router.delete("/delete/:id",deleteGoal)


export default router;
