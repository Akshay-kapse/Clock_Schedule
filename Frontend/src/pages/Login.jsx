
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form reload
  
    // Check for empty fields
    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }
  
    // Create JSON payload
    const payload = { email, password };
  
    try {
      // Send login request to the server
      const { data } = await axios.post(
        "http://localhost:4001/api/user/login",
        payload,
        {
          withCredentials: true, // If cookies are used
          headers: {
            "Content-Type": "application/json", // Set header to JSON
          },
        }
      );
  
      // Log server response for debugging
      console.log("Login Response:", data);
  
      // Notify user of successful login
      toast.success(data.message || "User logged in successfully");
  
      // Save the token to localStorage
      if (data.token) {
        localStorage.setItem("jwt", data.token); // Store token for authentication
        console.log("Token stored:", localStorage.getItem("jwt"));
      } else {
        throw new Error("Token missing from server response");
      }
  
      // Clear form fields
      setEmail("");
      setPassword("");
  
      // Navigate to the home page
      navigateTo("/");
    } catch (error) {
      // Log and display error message
      console.error("Login Error:", error);
      toast.error(
        error.response?.data?.message || "Please check your credentials"
      );
    }
  };
  

  return (
    <div className="flex items-center justify-center h-screen m-0 bg-[#0C67A0] font-sans">
      <div className="container flex items-center justify-center h-full w-full">
        <div className="bg-white p-5 rounded-lg shadow-md w-72">
          <form onSubmit={handleLogin}>
            <div className="flex justify-center items-center mb-5">
              <div className="mx-5 font-semibold text-xl">
                Clock<span className="font-bold text-blue-500">Schedule</span>
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="mb-5 text-xl font-semibold">Login Form</h2>

              <label className="mb-1 text-sm">Email</label>
              <input
                className="p-2 mb-3 border border-gray-300 rounded"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email"
              />

              <label className="mb-1 text-sm">Password</label>
              <input
                className="p-2 mb-3 border border-gray-300 rounded"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />

              <a
                href="#"
                className="text-blue-500 text-right mb-3 hover:underline"
              >
                Forgot Password?
              </a>

              <button
                type="submit"
                className="p-2 bg-[#033452] text-white rounded cursor-pointer hover:bg-[#02223f]"
              >
                Login
              </button>
              <p className="mt-4 text-center">
                New User?{" "}
                <Link to="/register" className="text-blue-500 hover:underline">
                  Sign Up Now
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;



import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:4001/api/user/login",
        { email, password },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );

      toast.success(data.message || "User logged in successfully");

      if (data.token) {
        localStorage.setItem("jwt", data.token);
      } else {
        throw new Error("Token missing from server response");
      }

      setEmail("");
      setPassword("");
      navigateTo("/home");
    } catch (error) {
      toast.error(error.response?.data?.message || "Please check your credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen m-0 bg-[#0C67A0] font-sans">
      <div className="container flex items-center justify-center h-full w-full">
        <div className="bg-white p-5 rounded-lg shadow-md w-72">
          <form onSubmit={handleLogin}>
            <div className="flex justify-center items-center mb-5">
              <div className="mx-5 font-semibold text-xl">
                Clock<span className="font-bold text-blue-500">Schedule</span>
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="mb-5 text-xl font-semibold">Login Form</h2>

              <label className="mb-1 text-sm">Email</label>
              <input
                className="p-2 mb-3 border border-gray-300 rounded"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email"
              />

              <label className="mb-1 text-sm">Password</label>
              <input
                className="p-2 mb-3 border border-gray-300 rounded"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />

              {/* ✅ Updated 'Forgot Password' Link */}
              <p
                // onClick={() => navigateTo("/forgot-password")}
                className="text-blue-500 text-right mb-3 hover:underline cursor-pointer"
              >
                <Link to="/forget-password">
                Forgot Password?
                </Link>
              </p>

              <button
                type="submit"
                className="p-2 bg-[#033452] text-white rounded cursor-pointer hover:bg-[#02223f]"
              >
                Login
              </button>
              <p className="mt-4 text-center">
                New User?{" "}
                <Link to="/register" className="text-blue-500 hover:underline">
                  Sign Up Now
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;





// import React, { useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
// =======
// import React, { useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useNavigate, Link } from "react-router-dom";
// >>>>>>> 02d70443653e45f092afcbd55b68c708d9b5175b

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

// =======
//   const [showPassword, setShowPassword] = useState(false);
// >>>>>>> 02d70443653e45f092afcbd55b68c708d9b5175b

//   const navigateTo = useNavigate();

//   const handleLogin = async (e) => {

//     e.preventDefault(); // Prevent form reload
  
//     // Check for empty fields
// =======
//     e.preventDefault();

// >>>>>>> 02d70443653e45f092afcbd55b68c708d9b5175b
//     if (!email || !password) {
//       toast.error("All fields are required");
//       return;
//     }

  
//     // Create JSON payload
//     const payload = { email, password };
  
//     try {
//       // Send login request to the server
//       const { data } = await axios.post(
//         "http://localhost:4001/api/user/login",
//         payload,
//         {
//           withCredentials: true, // If cookies are used
//           headers: {
//             "Content-Type": "application/json", // Set header to JSON
//           },
//         }
//       );
  
//       // Log server response for debugging
//       console.log("Login Response:", data);
  
//       // Notify user of successful login
//       toast.success(data.message || "User logged in successfully");
  
//       // Save the token to localStorage
//       if (data.token) {
//         localStorage.setItem("jwt", data.token); // Store token for authentication
//         console.log("Token stored:", localStorage.getItem("jwt"));
//       } else {
//         throw new Error("Token missing from server response");
//       }
  
//       // Clear form fields
//       setEmail("");
//       setPassword("");
  
//       // Navigate to the home page
//       navigateTo("/home");
//     } catch (error) {
//       // Log and display error message
//       console.error("Login Error:", error);
// =======

//     try {
//       const { data } = await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}/api/user/login`,
//         { email, password },
//         {
//           withCredentials: true,
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       toast.success(data.message || "User logged in successfully");

//       if (data.token) {
//         localStorage.setItem("jwt", data.token);
//       } else {
//         throw new Error("Token missing from server response");
//       }

//       setEmail("");
//       setPassword("");
//       navigateTo("/home");
//     } catch (error) {
// >>>>>>> 02d70443653e45f092afcbd55b68c708d9b5175b
//       toast.error(
//         error.response?.data?.message || "Please check your credentials"
//       );
//     }
//   };

  
  
// =======
// >>>>>>> 02d70443653e45f092afcbd55b68c708d9b5175b

//   return (
//     <div className="flex items-center justify-center h-screen m-0 bg-[#0C67A0] font-sans">
//       <div className="container flex items-center justify-center h-full w-full">

//         <div className="bg-white p-5 rounded-lg shadow-md w-72">
//           <form onSubmit={handleLogin}>
//             <div className="flex justify-center items-center mb-5">
//               <div className="mx-5 font-semibold text-xl">
//                 Clock<span className="font-bold text-blue-500">Schedule</span>
//               </div>
//             </div>
//             <div className="flex flex-col">
//               <h2 className="mb-5 text-xl font-semibold">Login Form</h2>

//               <label className="mb-1 text-sm">Email</label>
//               <input
//                 className="p-2 mb-3 border border-gray-300 rounded"
// =======
//         <div className="bg-white p-6 rounded-lg shadow-lg w-80 sm:w-96">
//           <form onSubmit={handleLogin}>
//             <div className="text-center mb-6">
//               <div className="text-2xl font-semibold">
//                 Clock<span className="text-blue-500 font-bold">Schedule</span>
//               </div>
//             </div>
//             <h2 className="mb-5 text-xl font-semibold text-center">Login Form</h2>

//             {/* Email */}
//             <div className="mb-4">
//               <label className="text-sm mb-1 block">Email</label>
//               <input
//                 className="w-full p-2 border border-gray-300 rounded"
// >>>>>>> 02d70443653e45f092afcbd55b68c708d9b5175b
//                 type="text"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter Your Email"
//               />


//               <label className="mb-1 text-sm">Password</label>
//               <input
//                 className="p-2 mb-3 border border-gray-300 rounded"
//                 type="password"
// =======
//             </div>

//             {/* Password with toggle */}
//             <div className="mb-4 relative">
//               <label className="text-sm mb-1 block">Password</label>
//               <input
//                 className="w-full p-2 border border-gray-300 rounded pr-10"
//                 type={showPassword ? "text" : "password"}
// >>>>>>> 02d70443653e45f092afcbd55b68c708d9b5175b
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Password"
//               />


//               {/* ✅ Updated 'Forgot Password' Link */}
//               <p
//                 // onClick={() => navigateTo("/forgot-password")}
//                 className="text-blue-500 text-right mb-3 hover:underline cursor-pointer"
//               >
//                 <Link to="/forget-password">
//                 Forgot Password?
//                 </Link>
//               </p>

//               <button
//                 type="submit"
//                 className="p-2 bg-[#033452] text-white rounded cursor-pointer hover:bg-[#02223f]"
//               >
//                 Login
//               </button>
//               <p className="mt-4 text-center">
//                 New User?{" "}
//                 <Link to="/register" className="text-blue-500 hover:underline">
//                   Sign Up Now
//                 </Link>
//               </p>
//             </div>
// =======
//               <span
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute top-9 right-3 text-gray-500 cursor-pointer"
//               >
//                 {showPassword ? (
//                   // Eye off icon
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-.69.07-1.36.203-2M6.29 6.29a9.956 9.956 0 00-1.9 2.665M9 9a3 3 0 104.243 4.243M15 15l3.536 3.536M3 3l18 18"
//                     />
//                   </svg>
//                 ) : (
//                   // Eye icon
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                     />
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                     />
//                   </svg>
//                 )}
//               </span>
//             </div>

//             {/* Forgot Password */}
//             <p className="text-blue-500 text-right text-sm mb-3 hover:underline">
//               <Link to="/forget-password">Forgot Password?</Link>
//             </p>

//             {/* Submit */}
//             <button
//               type="submit"
//               className="w-full bg-[#033452] text-white p-2 rounded hover:bg-[#02223f]"
//             >
//               Login
//             </button>

//             {/* Sign Up */}
//             <p className="mt-4 text-center text-sm">
//               New User?{" "}
//               <Link to="/register" className="text-blue-500 hover:underline">
//                 Sign Up Now
//               </Link>
//             </p>
// >>>>>>> 02d70443653e45f092afcbd55b68c708d9b5175b
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
