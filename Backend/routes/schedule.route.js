import express from "express";
import { authenticateUser } from "../jwt/AuthToken.js";
import {createSchedule, deleteSchedule, getSchedule, updateSchedule} from "../controller/schedule.controller.js";

const router = express.Router();

router.post("/schedule", authenticateUser, createSchedule);

router.get("/fetch", authenticateUser ,getSchedule)

router.put("/update/:id",updateSchedule)

router.delete("/delete/:id",deleteSchedule)



export default router;