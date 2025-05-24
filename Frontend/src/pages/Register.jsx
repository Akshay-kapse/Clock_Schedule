import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize the navigate function

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent form reload

    if (!username || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    const payload = { username, email, password };

    try {
      const { data } = await axios.post(
        "http://localhost:4001/api/user/register", // Replace with your backend URL
        payload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json", // Set header to JSON
          },
        }
      );
      console.log(data);
      toast.success(data.message || "User Registered Successfully");

      if (data.token) {
        localStorage.setItem("jwt", data.token); // Store token for authentication
        console.log("Token stored:", localStorage.getItem("jwt"));
      } else {
        throw new Error("Token missing from server response");
      }

      // Clear the input fields
      setEmail("");
      setUsername("");
      setPassword("");
      navigate("/home");
    } catch (error) {
      console.log("Error fetching data:", error);
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
                Clock<span className="font-bold  text-blue-500">Schedule</span>
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
              <input
                className="p-2 mb-3 border border-gray-300 rounded"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />

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
