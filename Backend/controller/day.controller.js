import Dayschedule from "../models/day.model.js"; // Import the DaySchedule model
import mongoose from "mongoose"; // Import mongoose for database operations

// Controller to create a new schedule
export const createSchedule = async (req, res) => {
  try {
    const { goalId } = req.params; // Extract goalId from request parameters

    // Validate goalId to ensure it's a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(goalId)) {
      return res.status(400).json({ error: "Invalid goalId format" });
    }

    // Validate required fields in the request body
    const { text, startDate, endDate, completed } = req.body;
    if (!text || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Ensure startDate is before endDate
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return res.status(400).json({ error: "startDate must be before endDate" });
    }

    // Create a new schedule document
    const newSchedule = new Dayschedule({
      goalId, // Associate the schedule with the provided goalId
      text, // Task description
      startDate, // Start date of the task
      endDate, // End date of the task
      completed, // Completion status of the task
    });

    // Save the new schedule to the database
    await newSchedule.save();

    // Respond with a success message and the created schedule
    res.status(201).json({
      message: "Schedule created successfully",
      schedule: newSchedule,
    });
  } catch (error) {
    // Log the error and respond with an internal server error message
    console.error("Error creating schedule:", error);
    res.status(500).json({ error: "Failed to create schedule" });
  }
};

// Controller to fetch schedules for a specific goal
export const getSchedule = async (req, res) => {
  const { goalId } = req.params; // Extract goalId from request parameters

  try {
    // Find all tasks associated with the given goalId and sort by startDate
    const tasks = await Dayschedule.find({ goalId }).sort({ startDate: 1 });

    // If no tasks are found, respond with a 404 status
    if (!tasks.length) {
      return res.status(404).json({ message: "No tasks found for this goal" });
    }

    // Respond with the tasks if found
    res.status(200).json({ message: "Tasks fetched successfully", tasks });
  } catch (error) {
    // Log the error and respond with an internal server error message
    console.error("Error occurred while fetching tasks:", error.message);
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
};

// Controller to update an existing schedule
export const updateSchedule = async (req, res) => {
  const { task, startDate, endDate, completed } = req.body; // Extract fields from request body
  const { id, goalId } = req.params; // Extract id and goalId from request parameters

  try {
    // Check if the task exists for the given id and goalId
    const existingTask = await Dayschedule.findOne({ _id: id, goalId });
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found for this goal" });
    }

    // Prepare updates based on the provided fields
    const updates = {};
    if (task) updates.text = task; // Update task description if provided
    if (startDate) updates.startDate = new Date(startDate); // Update startDate if provided
    if (endDate) updates.endDate = new Date(endDate); // Update endDate if provided
    if (completed !== undefined) updates.completed = completed; // Update completion status if provided

    // Update the schedule and return the updated document
    const updatedSchedule = await Dayschedule.findByIdAndUpdate(id, updates, { new: true });

    // Respond with a success message and the updated schedule
    res.status(200).json({ message: "Task updated successfully", updatedSchedule });
  } catch (error) {
    // Log the error and respond with an internal server error message
    console.error("Error updating task:", error.message);
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
};

// Controller to delete a schedule
export const deleteSchedule = async (req, res) => {
  const { id, goalId } = req.params; // Extract id and goalId from request parameters

  try {
    // Find and delete the schedule associated with the given id and goalId
    const task = await Dayschedule.findOneAndDelete({ _id: id, goalId });

    // If no matching task is found, respond with a 404 status
    if (!task) {
      return res.status(404).json({ message: "Task not found for this goal" });
    }

    // Respond with a success message
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    // Log the error and respond with an internal server error message
    console.error("Error deleting task:", error.message);
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
};
