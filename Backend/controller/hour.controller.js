import Hourschedule from "../models/hourschedule.model.js";
import mongoose from "mongoose";
// Create Schedule

export const createSchedule = async (req, res) => {
  try {
    // Extract goalId from request parameters (URL params)
    const { goalId } = req.params;

    // Validate if the goalId is a valid MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(goalId)) {
      return res.status(400).json({ error: "Invalid goalId format" });
    }

    // Extract necessary fields from the request body
    const { text, startTime, endTime, completed } = req.body;

    // Check if all required fields (text, startTime, endTime) are provided in the request body
    if (!text || !startTime || !endTime) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Convert startTime and endTime (which are expected to be ISO strings) into JavaScript Date objects
    const startTimeDate = new Date(startTime);  // Create Date object for startTime
    const endTimeDate = new Date(endTime);      // Create Date object for endTime

    // Ensure that the start time is before the end time
    if (startTimeDate >= endTimeDate) {
      return res.status(400).json({ error: "End time must be after start time." });
    }

    // Create a new schedule document with the extracted and validated data
    const newSchedule = new Hourschedule({
      goalId,           // Attach the goalId to the schedule
      text,             // Store the description/text of the schedule
      startTime: startTimeDate,  // Store the start time as a Date object
      endTime: endTimeDate,      // Store the end time as a Date object
      completed: completed,      // Store the completion status (boolean)
    });

    console.log("Schedule object created:", newSchedule);  // Log the created schedule object

    // Save the new schedule document to the database
    await newSchedule.save();

    console.log("Schedule successfully saved:", newSchedule);  // Log successful save

    // Send a success response with the newly created schedule object
    res.status(201).json({ message: "New Schedule Created", newSchedule });
  } catch (error) {
    // Log and send an error response if something goes wrong
    console.error("Error occurred while saving schedule:", error);
    res.status(500).json({ error: "Error creating schedule" });
  }
};


// Get Schedule
export const getSchedule = async (req, res) => {
  // Extract goalId from the request parameters
  const { goalId } = req.params;

  try {
    // Fetch schedules from the database filtered by the goalId
    const schedule = await Hourschedule.find({ goalId });

    // Check if no schedules are found for the given goalId
    if (!schedule.length) {
      // Respond with a 404 status if no schedules are found
      return res.status(404).json({ message: "No schedule found for this goal." });
    }

    // If schedules are found, return them with a success response
    res.status(200).json({
      message: "Schedule fetched successfully",
      schedule, // Include the fetched schedules in the response
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching schedule:", error.message);

    // Respond with a 500 status for server errors
    res.status(500).json({ message: "Error occurred in fetching schedule." });
  }
};


// Update Schedule
export const updateSchedule = async (req, res) => {
  try {
    // Extract the fields from the request body
    const { text, completed, startTime, endTime } = req.body;

    // Extract `id` and `goalId` from the request parameters
    const { id, goalId } = req.params;

    // Check if `goalId` is provided
    if (!goalId) {
      return res.status(400).json({ message: "'goalId' is required." });
    }

    // Helper function to validate time format (24-hour or 12-hour formats like "HH:MM" or "H:MM")
    const isValidTimeFormat = (time) => {
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // Matches time in "HH:MM" format
      return timeRegex.test(time);
    };

    // Validate `startTime` format
    if (startTime && !isValidTimeFormat(startTime)) {
      return res.status(400).json({
        message: "Invalid format for startTime. Use 'HH:MM' or 'H:MM' (24-hour).",
      });
    }

    // Validate `endTime` format
    if (endTime && !isValidTimeFormat(endTime)) {
      return res.status(400).json({
        message: "Invalid format for endTime. Use 'HH:MM' or 'H:MM' (24-hour).",
      });
    }

    // Ensure that `startTime` is earlier than `endTime` if both are provided
    if (startTime && endTime) {
      // Create Date objects to compare the times
      const startTimeObj = new Date(`1970-01-01T${startTime}:00Z`);
      const endTimeObj = new Date(`1970-01-01T${endTime}:00Z`);
      if (startTimeObj >= endTimeObj) {
        return res
          .status(400)
          .json({ message: "startTime must be earlier than endTime." });
      }
    }

    // Check if the task exists for the provided `id` and `goalId`
    const existingTask = await Hourschedule.findOne({ _id: id, goalId });
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found for this goal." });
    }

    // Validate `completed` field (must be a boolean if provided)
    if (completed !== undefined && typeof completed !== "boolean") {
      return res.status(400).json({ message: "'completed' must be a boolean value." });
    }

    // Update the schedule with the new values from the request body
    const updatedSchedule = await Hourschedule.findByIdAndUpdate(
      id, // ID of the schedule to update
      { text, completed, startTime, endTime }, // Fields to update
      { new: true } // Option to return the updated document
    );

    // Check if the update was successful
    if (!updatedSchedule) {
      return res.status(404).json({ message: "Task not found or update failed." });
    }

    // Send a success response with the updated schedule
    res.status(200).json({
      message: "Schedule updated successfully",
      updatedSchedule,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error updating schedule:", error.message);

    // Respond with a 500 status for server errors
    res.status(500).json({ message: "Error occurred while updating schedule." });
  }
};



// Delete Schedule
export const deleteSchedule = async (req, res) => {
  // Extract `id` (schedule ID) and `goalId` (associated goal ID) from the request parameters
  const { id, goalId } = req.params;

  // Log the IDs received for debugging purposes
  console.log("Backend received Goal ID:", goalId);
  console.log("Backend received Task ID:", id);

  try {
    // Search for the schedule in the database by its ID and associated goal ID
    const schedule = await Hourschedule.findOne({ _id: id, goalId });

    // If the schedule does not exist, respond with a 404 status and a message
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    // If the schedule exists, delete it from the database
    await Hourschedule.deleteOne({ _id: id, goalId });

    // Respond with a success message
    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error deleting schedule:", error.message);

    // Respond with a 500 status if an internal server error occurs
    res.status(500).json({ message: "Error occurred while deleting schedule." });
  }
};

