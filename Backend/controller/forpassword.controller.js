import Userlogin from "../models/userlogin.model.js";
import sendEmail from "../Utils/sendEmail.js";
// import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";


const rateLimitMap = new Map(); // Store request timestamps

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const currentTime = Date.now();
  const expiresAt = new Date(currentTime + 10 * 60 * 1000); // Code expires in 10 mins

  if (!rateLimitMap.has(email)) rateLimitMap.set(email, []);

  const timestamps = rateLimitMap.get(email);
  const recentTimestamps = timestamps.filter(
    (timestamp) => currentTime - timestamp < 10 * 60 * 1000
  );

  if (recentTimestamps.length >= 10) {
    return res.status(429).json({
      message:
        "You have reached the limit of 10 codes in 10 minutes. Try later.",
    });
  }

  recentTimestamps.push(currentTime);
  rateLimitMap.set(email, recentTimestamps);

  const code = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit code
  try {
    await Userlogin.findOneAndUpdate(
      { email },
      { code, expiresAt },
      { upsert: true, new: true }
    );

    await sendEmail(email, code);

    res.status(200).json({ message: "Code sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send code" });
  }
};

export const verifyCode = async (req, res) => {
  const { email, enteredCode } = req.body;

  try {
    const record = await Userlogin.findOne({ email });

    if (!record) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    // Check if code is expired
    if (record.expiresAt < new Date()) {
      return res
        .status(400)
        .json({ message: "Code expired. Please request a new one." });
    }

    if (record.code === enteredCode) {  // ✅ Fixed: Checking correct field
      return res.json({ success: true, message: "Code verified successfully" });
    }

    return res.status(400).json({ message: "Invalid code" }); 
  } catch (error) {
    console.error("Error verifying code:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and new password required" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("🔍 Hashed Password:", hashedPassword); // ✅ Debugging Step

    // Update user password in the database & clear reset code
    const updatedUser = await Userlogin.findOneAndUpdate(
      { email },
      { password: hashedPassword, code: null, expiresAt: null },  // ✅ Clear reset code
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("❌ Reset Password Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
