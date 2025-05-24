import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const location = useLocation();
  const email = location.state?.email || ""; // Make sure email exists here
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }
  
    console.log("Sending Reset Request:", { email, newPassword: password });

    if (password !== confirmPassword) {
            toast.error("Passwords do not match. Please try again.");
            return;
          }
  
    try {
      const res = await axios.post(
        "http://localhost:4001/api/userpassword/reset-password",
        { email, newPassword: password }
      );
  
      console.log("Reset Response:", res.data);
      console.log("Reset Response:", res.data.success);
  
      if (res.data.success) {
        toast.success("Password reset successfully!");
        navigate("/login")
      } else {
        toast.error(res.data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Reset Password Error:", error.response?.data);
      console.log(error)
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  

  return (
    <div className="min-h-screen bg-[#0C67A0] flex justify-center items-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Clock<span className="text-black">Schedule</span>
        </h2>
        <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
          Reset Password
        </h3>
        <form onSubmit={handleReset}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border rounded-md mb-4"
              value={email}
              disabled
              required
            />
          </div>
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full p-3 border rounded-md mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            className="w-full p-3 border rounded-md mb-4"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700"
          >
            Reset Password
          </button>
        </form>
        {message && (
          <p className="text-sm text-gray-600 text-center mt-4">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
