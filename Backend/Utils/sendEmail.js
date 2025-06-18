import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // ✅ Ensure environment variables are loaded

const sendEmail = async (to, code) => {
  try {
    // ✅ Use environment variables for email credentials
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // ✅ Use .env variables
        pass: process.env.EMAIL_PASS, // ✅ Use app password securely
      },
    });

    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to,
      subject: "🔒 Password Reset Code",
      text: `Your code is: ${code}`, // Plain text fallback
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
          <h2 style="color: #333;">🔒 Password Reset Request</h2>
          <p style="font-size: 16px;">Hello,</p>
          <p style="font-size: 16px;">
            You recently requested to reset your password. Use the code below to proceed:
          </p>
          <div style="display: inline-block; padding: 15px 30px; font-size: 24px; font-weight: bold; background: #007bff; color: #fff; border-radius: 5px;">
            ${code}
          </div>
          <p style="font-size: 16px; margin-top: 20px;">
            This code will expire in <strong>10 minutes</strong>. If you did not request this, please ignore this email.
          </p>
          <p style="font-size: 14px; color: #777; margin-top: 20px;">
            - Your App Team
          </p>
        </div>
      `,
    };

    // ✅ Send email & handle errors
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Email sending failed. Please try again.");
  }
};

export default sendEmail;
