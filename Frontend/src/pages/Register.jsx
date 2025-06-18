import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
// import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // New state
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    const payload = { username, email, password };

    try {
      const { data } = await axios.post(
        "http://192.168.31.150:4001/api/user/register",
        payload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(data.message || "User Registered Successfully");

      if (data.token) {
        localStorage.setItem("jwt", data.token);
      } else {
        throw new Error("Token missing from server response");
      }

      setEmail("");
      setUsername("");
      setPassword("");
      navigate("/home");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Please fill required fields"
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen m-0 bg-[#0C67A0] font-sans">
      <div className="container flex items-center justify-center h-full w-full">
        <div className="bg-white p-5 rounded-lg shadow-md w-72">
          <form onSubmit={handleRegister}>
            <div className="flex justify-center items-center mb-5">
              <div className="mx-5 font-semibold text-xl">
                Clock<span className="font-bold text-blue-500">Schedule</span>
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="mb-5 text-xl font-semibold">Registration Form</h2>

              <label className="mb-1 text-sm">Email</label>
              <input
                className="p-2 mb-3 border border-gray-300 rounded"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email"
              />

              <label className="mb-1 text-sm">Username</label>
              <input
                className="p-2 mb-3 border border-gray-300 rounded"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Your Username"
              />


              <label className="mb-1 text-sm">Password</label>
              <div className="relative">
                <input
                  className="p-2 pr-10 mb-3 w-full border border-gray-300 rounded"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-2.5 right-2 text-gray-600"
                >
                  {showPassword ? (
                    // Eye Off SVG
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-.69.07-1.36.203-2M6.29 6.29a9.956 9.956 0 00-1.9 2.665M9 9a3 3 0 104.243 4.243M15 15l3.536 3.536M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    // Eye SVG
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <button
                type="submit"
                className="p-2 bg-[#033452] text-white rounded cursor-pointer hover:bg-[#02223f]"
              >
                Register
              </button>

              <p className="mt-4 text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500 hover:underline">
                  Login Now
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
