import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Removes leading/trailing spaces
  },
  password: {
    type: String,
    required: true,
    select: false, // Ensure password is excluded by default
  },
  Code: {
    type: String,
    required: false,
  },
  expiresAt: {
    type: Date,
    required: false,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // default 24h expiry
  },
  resetCodeExpires: {
    type: Date,
  }, // Expiration time
  token: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Userlogin = mongoose.model("Userlogin", userSchema);
export default Userlogin;
