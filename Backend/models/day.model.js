import mongoose from "mongoose";

// Define the Hourschedule schema
const dayscheduleSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    goalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the model from the schema
const Dayschedule = mongoose.model("Dayschedule", dayscheduleSchema);

export default Dayschedule;
