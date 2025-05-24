import Goal from "../models/goals.model.js"; // Import the Goal model for database operations

export const createGoal = async (req, res) => {
  console.log("User ID from req.user:", req.user); // Debugging

  const { goal, goalDate } = req.body;
  const userId = req.user.userId; // Safely access id

  if (!goal || !goalDate) {
    return res
      .status(400)
      .json({ message: "Goal and goal date are required." });
  }

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized user." });
  }

  try {
    const newGoal = new Goal({
      goal,
      goalDate,
      userId, // Associate the user with the schedule
    });

    // Save the new schedule
    await newGoal.save();
    const goals = await Goal.find({ userId, goal, goalDate });
    res
      .status(201)
      .json({ message: "Goal created successfully", goal: newGoal });

    console.log(newGoal);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating goal", error });
  }
};

export const getGoal = async (req, res) => {
  try {
    const userId = req.user.userId;

    const goal = await Goal.find({ userId });
    res.status(200).json({ message: "Goal Fetched Successfully", goal });
    console.log(goal);
  } catch (error) {
    res.status(500).json({ message: "Error fetching goals", error });
  }
};

// Controller to update an existing goal
export const updateGoal = async (req, res) => {
  const { id } = req.params; // Extract the goal ID from request parameters
  const { goal, goalDate } = req.body; // Extract updated data from request body

  try {
    // Find the goal by ID and update it
    const updatedGoal = await Goal.findByIdAndUpdate(
      id,
      { goal, goalDate }, // Updated goal data
      { new: true } // Return the updated document
    );

    if (!updatedGoal) {
      // If no goal is found with the given ID
      return res.status(404).json({ message: "Goal not found" });
    }

    // Respond with the updated goal
    res.status(200).json({ message: "Goal updated successfully", updatedGoal });
  } catch (error) {
    // Handle errors during goal update
    res.status(500).json({ message: "Error updating goal", error });
  }
};

// Controller to delete a goal
export const deleteGoal = async (req, res) => {
  const { id } = req.params; // Extract the goal ID from request parameters

  try {
    // Find and delete the goal by ID
    const deletedGoal = await Goal.findByIdAndDelete(id);

    if (!deletedGoal) {
      // If no goal is found with the given ID
      return res.status(404).json({ message: "Goal not found" });
    }

    // Respond with a success message
    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    // Handle errors during goal deletion
    console.error("Error deleting goal:", error);
    res.status(500).json({ message: "Failed to delete goal" });
  }
};
