import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  goal: {
    type: String,
    required: true, // Ensures 'goal' is mandatory
  },

  goalDate: {
    type: Date, // 'Date' type for storing date format
    required: true, // Ensures 'goalDate' is mandatory
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Userlogin", // Reference to Userlogin model
    required: true, // Ensure every schedule has a userId
  },
});

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;

