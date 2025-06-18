import express from "express";

import {
  createSchedule,
  deleteSchedule,
  getSchedule,
  updateSchedule,
} from "../controller/hour.controller.js";

const router = express.Router();

// Create a new schedule
router.post("/:goalId/schedule", createSchedule);

// Fetch all schedules
router.get("/:goalId/fetchschedule", getSchedule);

// Update a schedule
router.put("/:goalId/updateschedule/:id", updateSchedule);

// Delete a schedule
router.delete("/:goalId/deleteschedule/:id", deleteSchedule);

export default router;
