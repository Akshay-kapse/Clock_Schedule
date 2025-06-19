import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const VerifyCode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || ""; // Get email from state
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
  
    if (!email) {
      setMessage("Email is missing. Please enter your email again.");
      return;
    }
  
    try {
      console.log("Verifying code with email:", email, "and code:", code);  // Debug log
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/userpassword/verify-code`,
        {
          email: email.trim(),
          code: code.trim(),
        }
      );
  
      console.log("Backend Response:", res.data);  
      console.log("Backend Response:", res.data.success);  
  
      if (res.data.message === "Code verified successfully") {
        toast.success("Code verified successfully!");
        navigate("/reset-password", { state: { email } });
      } else {
        setMessage(res.data.message || "Invalid code");
      }
    } catch (error) {
      console.error("Verification Error:", error.response?.data);
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0C67A0]">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          ClockSchedule
        </h2>
        <h3 className="text-lg font-semibold text-gray-700 text-center mb-4">
          Verify Code
        </h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          A verification code has been sent to your email:
        </p>
        <p className="text-center font-semibold text-gray-700 mb-6">{email}</p>
        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter your code"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700"
          >
            Verify Code
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default VerifyCode;
