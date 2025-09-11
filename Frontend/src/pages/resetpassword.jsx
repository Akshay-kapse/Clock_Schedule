// import { useLocation, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// const ResetPassword = () => {
//   const location = useLocation();

//   const email = location.state?.email || ""; // Make sure email exists here
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleReset = async (e) => {
//     e.preventDefault(); // Prevent default form submission behavior

//   const email = location.state?.email || "";
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const navigate = useNavigate();

//   const handleReset = async (e) => {
//     e.preventDefault();


//     if (!email || !password) {
//       toast.error("Email and password are required.");
//       return;
//     }

  
//     console.log("Sending Reset Request:", { email, newPassword: password });

//     if (password !== confirmPassword) {
//             toast.error("Passwords do not match. Please try again.");
//             return;
//           }
  
//     // try {
//     //   const res = await axios.post(
//     //     "http://localhost:4001/api/userpassword/reset-password",
//     //     { email, newPassword: password }
//     //   );
  
//     //   console.log("Reset Response:", res.data);
//     //   console.log("Reset Response:", res.data.success);
  
//     //   if (res.data.success) {
//     //     toast.success("Password reset successfully!");
//     //     navigate("/login")


//     // if (password !== confirmPassword) {
//     //   toast.error("Passwords do not match. Please try again.");
//     //   return;
//     // }

//     try {
//       const res = await axios.post(
//         `${import.meta.env.VITE_BACKEND_UR}/api/userpassword/reset-password`,
//         { email, newPassword: password }
//       );

//       if (res.data.success) {
//         toast.success("Password reset successfully!");
//         navigate("/login");

//       } else {
//         toast.error(res.data.message || "Failed to reset password");
//       }
//     } catch (error) {
//       console.error("Reset Password Error:", error.response?.data);

//       console.log(error)
//       toast.error(error.response?.data?.message || "Something went wrong");
//     }
//   };
  

//       toast.error(error.response?.data?.message || "Something went wrong");
//     }
//   };


//   return (
//     <div className="min-h-screen bg-[#0C67A0] flex justify-center items-center">
//       <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
//         <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
//           Clock<span className="text-black">Schedule</span>
//         </h2>
//         <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
//           Reset Password
//         </h3>
//         <form onSubmit={handleReset}>


//           {/* Email Field */}

//           <div className="mb-4">
//             <label className="block text-gray-700 mb-2" htmlFor="email">
//               Email Address
//             </label>
//             <input
//               type="email"
//               id="email"

//               className="w-full p-3 border rounded-md mb-4"

//               className="w-full p-3 border rounded-md bg-gray-100 cursor-not-allowed"

//               value={email}
//               disabled
//               required
//             />
//           </div>

//           <input
//             type="password"
//             placeholder="Enter new password"
//             className="w-full p-3 border rounded-md mb-4"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Confirm new password"
//             className="w-full p-3 border rounded-md mb-4"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700"


//           {/* Password Field */}
//           <div className="mb-4 relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Enter new password"
//               className="w-full p-3 border rounded-md pr-10"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <span
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 cursor-pointer"
//             >
//               {showPassword ? (
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-.69.07-1.36.203-2M6.29 6.29a9.956 9.956 0 00-1.9 2.665M9 9a3 3 0 104.243 4.243M15 15l3.536 3.536M3 3l18 18"
//                   />
//                 </svg>
//               ) : (
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                   />
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                   />
//                 </svg>
//               )}
//             </span>
//           </div>

//           {/* Confirm Password Field */}
//           <div className="mb-1 relative">
//             <input
//               type={showConfirmPassword ? "text" : "password"}
//               placeholder="Confirm new password"
//               className="w-full p-3 border rounded-md pr-10"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//             />
//             <span
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 cursor-pointer"
//             >
//               {showConfirmPassword ? (
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-.69.07-1.36.203-2M6.29 6.29a9.956 9.956 0 00-1.9 2.665M9 9a3 3 0 104.243 4.243M15 15l3.536 3.536M3 3l18 18"
//                   />
//                 </svg>
//               ) : (
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                   />
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                   />
//                 </svg>
//               )}
//             </span>
//           </div>

//           {/* Password Mismatch Warning */}
//           {confirmPassword && password !== confirmPassword && (
//             <p className="text-sm text-red-500 mb-4">Passwords do not match</p>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"

//           >
//             Reset Password
//           </button>
//         </form>

//         {message && (
//           <p className="text-sm text-gray-600 text-center mt-4">{message}</p>


//         {/* Message Display */}
//         {message && (
//           <p className="text-sm text-center mt-4 text-gray-700">{message}</p>

//         )}
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;


import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const location = useLocation();
  const email = location.state?.email || ""; // Email passed from previous page
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/userpassword/reset-password`,
        { email, newPassword: password }
      );

      if (res.data.success) {
        toast.success("Password reset successfully!");
        navigate("/login");
      } else {
        toast.error(res.data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Reset Password Error:", error.response?.data);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
//     <div className="min-h-screen bg-[#0C67A0] flex justify-center items-center">
//       <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
//         <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
//           Clock<span className="text-black">Schedule</span>
//         </h2>
//         <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
//           Reset Password
//         </h3>

//         <form onSubmit={handleReset}>
//           {/* Email */}
//           <div className="mb-4">
//             <label className="block text-gray-700 mb-2" htmlFor="email">
//               Email Address
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               disabled
//               className="w-full p-3 border rounded-md bg-gray-100 cursor-not-allowed"
//               required
//             />
//           </div>

//           {/* Password */}
//           <div className="mb-4 relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Enter new password"
//               className="w-full p-3 border rounded-md pr-10"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <span
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 cursor-pointer"
//             >
//               {showPassword ? "Hide" : "Show"}
//             </span>
//           </div>

//           {/* Confirm Password */}
//           <div className="mb-4 relative">
//             <input
//               type={showConfirmPassword ? "text" : "password"}
//               placeholder="Confirm new password"
//               className="w-full p-3 border rounded-md pr-10"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//             />
//             <span
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 cursor-pointer"
//             >
//               {showConfirmPassword ? "Hide" : "Show"}
//             </span>
//           </div>

//           {/* Password mismatch warning */}
//           {confirmPassword && password !== confirmPassword && (
//             <p className="text-sm text-red-500 mb-4">
//               Passwords do not match
//             </p>
//           )}

//           {/* Submit */}
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
//           >
//             Reset Password
//           </button>
//         </form>

//         {/* Message display */}
//         {message && (
//           <p className="text-sm text-center mt-4 text-gray-700">{message}</p>
//         )}
//       </div>
//     </div>
//   );
// };

  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 border border-gray-100"
      >
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">🔐</span>
          </div>
          <h2 className="text-3xl font-extrabold text-blue-600 mb-2">
            Url<span className="text-gray-900">Shorter</span>
          </h2>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Reset Your Password
          </h3>
          <p className="text-gray-600 text-sm">
            Create a new secure password for your account
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-6">
          {/* Email (readonly) */}
          <div>
            <label 
              htmlFor="email"
              className="block text-gray-700 mb-2 text-sm font-semibold"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email || ""}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed text-gray-600"
            />
          </div>

          {/* New Password */}
          <div>
            <label 
              htmlFor="password"
              className="block text-gray-700 mb-2 text-sm font-semibold"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                disabled={loading}
                required
                minLength={6}
                aria-describedby="password-help"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer text-lg p-1 rounded-md hover:bg-gray-100 transition-colors"
                disabled={loading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <p id="password-help" className="text-xs text-gray-500 mt-1">
              Must be at least 6 characters long
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label 
              htmlFor="confirmPassword"
              className="block text-gray-700 mb-2 text-sm font-semibold"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                disabled={loading}
                required
                aria-describedby="confirm-password-help"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer text-lg p-1 rounded-md hover:bg-gray-100 transition-colors"
                disabled={loading}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <p id="confirm-password-help" className="text-xs text-gray-500 mt-1">
              Re-enter your new password
            </p>
          </div>

          {/* Password mismatch warning */}
          {confirmPassword && password !== confirmPassword && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm flex items-center space-x-2"
            >
              <span>⚠️</span>
              <span>Passwords do not match</span>
            </motion.div>
          )}

          {/* Submit button */}
          <motion.button
            type="submit"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Resetting...</span>
              </>
            ) : (
              <>
                <span>Reset Password</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center pt-6 border-t border-gray-200">
          <span
            onClick={() => (window.location.href = "/login")}
            className="text-sm text-gray-500 hover:text-gray-700 hover:underline transition-colors cursor-pointer"
          >
            ← Back to Login
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default ResetPassword;
