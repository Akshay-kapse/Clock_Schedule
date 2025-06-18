import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  }, // Changed to String
  endTime: {
    type: String,
    required: true,
  }, // Changed to String
  completed: {
    type: Boolean,
    default: false,
  }, // Default to false
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Userlogin', // Reference to Userlogin model
    required: true, // Ensure every schedule has a userId
  },
});


const Schedule = mongoose.model("Schedule", scheduleSchema);
export default Schedule;
