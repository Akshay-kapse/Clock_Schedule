import React, { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext.jsx";
import ScrollAnimation from "../components/ScrollAnimation.jsx";

import {
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon
} from "@heroicons/react/24/outline"; // or /solid depending on style

import { TbTarget } from "react-icons/tb"; // From Tabler Icons
import { ClockIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

const GoalPage = () => {
  const [goal, setGoal] = useState("");
  const [goalDate, setGoalDate] = useState("");
  const [goalsList, setGoalsList] = useState([]);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [showScheduleOptions, setShowScheduleOptions] = useState(false);
  const [selectedGoalItem, setSelectedGoalItem] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { themeClasses } = useTheme();

  const navigate = useNavigate();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      toast.error("Please login to fetch your goals.");
      return;
    }

    setLoading(true);
    try {
      const decodedUser = jwtDecode(token);
      setUser(decodedUser);

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/goal/fetch`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data?.goal) {
        setGoalsList(response.data.goal);
      }
    } catch (err) {
      console.error("Error fetching goals:", err?.response?.data || err.message);
      toast.error("Failed to fetch goals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt");

    if (!goal || !goalDate) {
      toast.error("Both goal and goal date are required.");
      return;
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const selectedDate = new Date(goalDate);

    if (selectedDate <= currentDate) {
      toast.error("Goal date must be in the future.");
      return;
    }

    const currentYear = currentDate.getFullYear();
    const enteredYear = selectedDate.getFullYear();
    if (enteredYear > currentYear + 10) {
      toast.error("Goal year must be within 10 years.");
      return;
    }

    setLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      if (isEditing) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/goal/update/${isEditing}`,
          { goal, goalDate },
          { headers }
        );
        toast.success("Goal updated successfully!");
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/goal/target`,
          { goal, goalDate },
          { headers }
        );
        toast.success("Goal added successfully!");
      }

      fetchGoals();
      setGoal("");
      setGoalDate("");
      setIsAddingGoal(false);
      setIsEditing(null);
    } catch (err) {
      console.error("Error saving goal:", err?.response?.data || err.message);
      toast.error("Failed to save goal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    const goalToEdit = goalsList.find((g) => g._id === id);
    if (!goalToEdit) return;

    setGoal(goalToEdit.goal);
    setGoalDate(goalToEdit.goalDate.slice(0, 10));
    setIsEditing(id);
    setIsAddingGoal(true);
  };

  const deleteGoal = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/goal/delete/${id}`);
      setGoalsList((prev) => prev.filter((g) => g._id !== id));
      toast.success("Goal deleted successfully!");
    } catch (err) {
      console.error("Error deleting goal:", err);
      toast.error("Failed to delete goal. Please try again.");
    }
  };

  const handleSchedule = (goalItem) => {
    setSelectedGoalItem(goalItem);
    setShowScheduleOptions(true);
  };

  const navigateToSchedule = (scheduleType) => {
    if (!selectedGoalItem) return;
    navigate(`/goalschedule/${selectedGoalItem._id}/${scheduleType}`, {
      state: {
        id: selectedGoalItem._id,
        goal: selectedGoalItem.goal,
        goalDate: selectedGoalItem.goalDate,
      },
    });
    setShowScheduleOptions(false);
  };

  const handleBack = () => {
    setIsAddingGoal(false);
    setShowScheduleOptions(false);
    setIsEditing(null);
    setGoal("");
    setGoalDate("");
  };

  const calculateDaysLeft = (goalDate) => {
    const now = new Date();
    const target = new Date(goalDate);
    const diffTime = target - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className={`min-h-screen ${themeClasses.bg} pt-20 transition-all duration-500`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {error && (
            <motion.div
              className="bg-red-500/20 border border-red-500/30 text-red-300 p-4 rounded-2xl mb-6 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          )}

          {isAddingGoal ? (
            <motion.div
              className={`${themeClasses.glass} rounded-3xl border p-6 sm:p-8 shadow-2xl`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <motion.button
                  onClick={handleBack}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeftIcon className="w-5 h-5 text-white" />
                </motion.button>
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${themeClasses.bgSecondary} rounded-xl`}>
                    <TbTarget className={`w-6 h-6 ${themeClasses.accent}`} />
                  </div>
                  <h2 className={`text-2xl font-bold ${themeClasses.text}`}>
                    {isEditing ? "Edit Goal" : "Create New Goal"}
                  </h2>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="form-label">
                    Goal Description
                  </label>
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="form-input"
                    placeholder="E.g., Learn React Development"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={goalDate}
                    onChange={(e) => setGoalDate(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className={`w-full px-6 py-4 ${themeClasses.button} ${themeClasses.buttonHover} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {isEditing ? "Updating..." : "Creating..."}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <TbTarget className="w-5 h-5" />
                      {isEditing ? "Update Goal" : "Create Goal"}
                    </div>
                  )}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {/* Header */}
              <ScrollAnimation>
                <div className="text-center">
                <motion.div
                  className="flex items-center justify-center gap-3 mb-4"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className={`p-3 ${themeClasses.glass} rounded-2xl border shadow-lg`}>
                    <TbTarget className={`w-8 h-8 ${themeClasses.accent}`} />
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                    Your Goals
                  </h1>
                </motion.div>
                <p className={`${themeClasses.textSecondary} text-lg`}>Set targets and achieve your dreams</p>
                </div>
              </ScrollAnimation>

              {/* Goals List */}
              <ScrollAnimation>
                <motion.div
                  className={`${themeClasses.glass} rounded-3xl border p-6 sm:p-8 shadow-2xl`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                {loading ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-300">Loading your goals...</p>
                  </div>
                ) : goalsList.length === 0 ? (
                  <div className="text-center py-12">
                    <TbTarget className={`w-16 h-16 ${themeClasses.textSecondary} opacity-50 mx-auto mb-4`} />
                    <p className={`${themeClasses.textSecondary} text-lg mb-2`}>No goals yet</p>
                    <p className={`${themeClasses.textSecondary} opacity-70 text-sm`}>Create your first goal to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                    <AnimatePresence>
                      {goalsList.map((goalItem, index) => {
                        const daysLeft = calculateDaysLeft(goalItem.goalDate);
                        const isOverdue = daysLeft < 0;
                        
                        return (
                          <motion.div
                            key={goalItem._id}
                            className={`p-6 rounded-2xl border transition-all duration-300 ${
                              isOverdue
                                ? "bg-red-500/20 border-red-500/30"
                                : "bg-white/10 border-white/20 hover:bg-white/20"
                            }`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1 }}
                            layout
                          >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              <div className="flex-1">
                                <h3 className={`text-xl font-semibold ${themeClasses.text} mb-2`}>
                                  {goalItem.goal}
                                </h3>
                                <div className={`flex flex-wrap items-center gap-4 text-sm ${themeClasses.textSecondary}`}>
                                  <span className="flex items-center gap-1">
                                    <CalendarIcon className="w-4 h-4" />
                                    {new Date(goalItem.goalDate).toLocaleDateString("en-GB")}
                                  </span>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    isOverdue
                                      ? "bg-red-500/30 text-red-300"
                                      : daysLeft <= 7
                                      ? "bg-yellow-500/30 text-yellow-300"
                                      : "bg-green-500/30 text-green-300"
                                  }`}>
                                    {isOverdue
                                      ? `${Math.abs(daysLeft)} days overdue`
                                      : daysLeft === 0
                                      ? "Due today"
                                      : `${daysLeft} days left`
                                    }
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <motion.button
                                  onClick={() => handleEdit(goalItem._id)}
                                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500/30 text-yellow-300 hover:bg-yellow-500/40 rounded-xl font-medium transition-all duration-300"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <PencilIcon className="w-4 h-4" />
                                  Edit
                                </motion.button>

                                <motion.button
                                  onClick={() => deleteGoal(goalItem._id)}
                                  className="flex items-center gap-2 px-4 py-2 bg-red-500/30 text-red-300 hover:bg-red-500/40 rounded-xl font-medium transition-all duration-300"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <TrashIcon className="w-4 h-4" />
                                  Delete
                                </motion.button>

                                <motion.button
                                  onClick={() => handleSchedule(goalItem)}
                                  className="flex items-center gap-2 px-4 py-2 bg-green-500/30 text-green-300 hover:bg-green-500/40 rounded-xl font-medium transition-all duration-300"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <CalendarIcon className="w-4 h-4" />
                                  Schedule
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}

                <motion.button
                  onClick={() => setIsAddingGoal(true)}
                  className={`w-full mt-6 px-6 py-4 ${themeClasses.button} ${themeClasses.buttonHover} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <PlusIcon className="w-5 h-5" />
                    Add New Goal
                  </div>
                </motion.button>
                </motion.div>
              </ScrollAnimation>
            </div>
          )}

          {/* Schedule Modal */}
          <AnimatePresence>
            {showScheduleOptions && (
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className={`${themeClasses.glass} rounded-3xl border p-6 sm:p-8 w-full max-w-md shadow-2xl`}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <motion.button
                      onClick={handleBack}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ArrowLeftIcon className="w-5 h-5 text-white" />
                    </motion.button>
                    <h2 className={`text-xl font-bold ${themeClasses.text}`}>Choose Schedule Type</h2>
                  </div>

                  <div className="space-y-4">
                    <motion.button
                      onClick={() => navigateToSchedule("day")}
                      className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <CalendarIcon className="w-5 h-5" />
                        Day Schedule
                      </div>
                    </motion.button>

                    <motion.button
                      onClick={() => navigateToSchedule("hour")}
                      className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <ClockIcon className="w-5 h-5" />
                        Hour Schedule
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={themeClasses.theme === 'light' ? 'light' : 'dark'}
      />
    </div>
  );
};

export default GoalPage;