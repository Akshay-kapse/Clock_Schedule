import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = ({ onNext }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/userpassword/forgot-password`,
        { email }
      );
      setMessage(res.data.message);
      navigate("/verify-code", { state: { email } });
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#0C67A0] flex justify-center items-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Clock<span className="text-black">Schedule</span>
        </h2>
        <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
          Forgot Password
        </h3>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 border rounded-md mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700"
          >
            Send Reset Code
          </button>
        </form>
        {message && (
          <p className="text-sm text-gray-600 text-center mt-4">{message}</p>
        )}
        <p className="text-sm text-gray-600 text-center mt-4">
          Remembered your password?{" "}
          <span
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={() => (window.location.href = "/login")}
          >
            Go back to Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
