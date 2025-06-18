import express from "express";
import { createSchedule, deleteSchedule, getSchedule, updateSchedule } from "../controller/day.controller.js";

const router = express.Router();

// Create a new schedule for a goal
router.post("/:goalId/schedule", createSchedule);

// Fetch all schedules for a specific goal
router.get("/:goalId/fetchschedule", getSchedule);

// Update a specific schedule for a goal by task id
router.put("/:goalId/updateschedule/:id", updateSchedule);

// Delete a specific schedule for a goal by task id
router.delete("/:goalId/deleteschedule/:id", deleteSchedule);

export default router;
