import mongoose from "mongoose";

const HourscheduleSchema = new mongoose.Schema({
  text: { type: String, required: true },
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Goal",
    required: true,
  },
  completed: { type: Boolean, default: false },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  }
});

const Hourschedule = mongoose.model("Hourschedule", HourscheduleSchema);
export default Hourschedule;
