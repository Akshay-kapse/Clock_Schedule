import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ClockIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/userpassword/forgot-password`,
        { email }
      );
      setMessage(res.data.message);
      navigate("/verify-code", { state: { email } });
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="glass-card rounded-3xl p-8 shadow-2xl">
          {/* Back Button */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/login"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Login
            </Link>
          </motion.div>

          {/* Logo */}
          <motion.div
            className="text-center mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg">
                <ClockIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold">
                <span className="text-white">Clock</span>
                <span className="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                  Schedule
                </span>
              </h1>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Forgot Password?</h2>
            <p className="text-gray-300 text-sm">
              Enter your email address and we'll send you a verification code to reset your password.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="form-label">
                <EnvelopeIcon className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="form-input"
                required
              />
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="spinner"></div>
                  Sending Code...
                </div>
              ) : (
                "Send Reset Code"
              )}
            </motion.button>

            {/* Message */}
            {message && (
              <motion.div
                className="text-center p-3 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-300 text-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                {message}
              </motion.div>
            )}

            {/* Login Link */}
            <motion.p
              className="text-center text-gray-300 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-purple-300 hover:text-purple-200 font-medium transition-colors duration-200"
              >
                Sign In
              </Link>
            </motion.p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;