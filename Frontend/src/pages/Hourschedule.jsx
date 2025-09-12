import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext.jsx";
import ScrollAnimation from "../components/ScrollAnimation.jsx";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  ClockIcon,
  PlusIcon,
  CheckCircleIcon,
  TrashIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

function Schedule() {
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [startHour, setStartHour] = useState("12");
  const [startMinute, setStartMinute] = useState("00");
  const [startPeriod, setStartPeriod] = useState("AM");
  const [endHour, setEndHour] = useState("12");
  const [endMinute, setEndMinute] = useState("00");
  const [endPeriod, setEndPeriod] = useState("AM");
  const [timeLeftForGoal, setTimeLeftForGoal] = useState("");
  const [completedTasks, setCompletedTasks] = useState([]);
  const { themeClasses } = useTheme();

  const navigate = useNavigate();
  const location = useLocation();
  const { goal, goalDate, id: goalId } = location.state || {};

  // Calculate time left for the goal
  useEffect(() => {
    const calculateTimeLeftForGoal = () => {
      const now = new Date();
      const goalDateTime = new Date(goalDate);
      const timeLeft = goalDateTime - now;

      if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
        setTimeLeftForGoal(`${days}d ${hours}h ${minutes}m left`);
      } else {
        setTimeLeftForGoal("Goal Date Reached");
      }
    };

    calculateTimeLeftForGoal();
    const intervalId = setInterval(calculateTimeLeftForGoal, 60000);

    return () => clearInterval(intervalId);
  }, [goalDate]);

  // Fetch schedule
  // ✅ Function to fetch schedules from backend
const fetchSchedule = async () => {
  if (!goalId) return;

  setLoading(true);
  setError(null);
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/hourschedule/${goalId}/fetchschedule`,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    // If schedule is empty, set [] instead of throwing error
    const fetchedSchedule = response.data.schedule || [];
    console.log("Fetched schedules:", fetchedSchedule);

    if (fetchedSchedule.length === 0) {
      setSchedule([]); // explicitly set empty array
    } else {
      setSchedule(fetchedSchedule);
      setCompletedTasks(
        response.data.tasks?.filter((task) => task.completed) || []
      );
    }
  } catch (error) {
    console.error("Error fetching schedules:", error);
    setError("Something went wrong while fetching schedules.");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchSchedule();
  }, []);

  const resetForm = () => {
    setNewTask("");
    setStartHour("12");
    setStartMinute("00");
    setStartPeriod("AM");
    setEndHour("12");
    setEndMinute("00");
    setEndPeriod("AM");
  };

  const doesTaskOverlap = (start, end) => {
    return schedule.some((s) => {
      const existingStart = new Date(s.startTime);
      const existingEnd = new Date(s.endTime);
      const noOverlap = end <= existingStart || start >= existingEnd;
      return !noOverlap;
    });
  };

  // Create a new task
  const scheduleCreate = async () => {
    if (!newTask.trim()) {
      setError("Task name cannot be empty.");
      return;
    }

    const start = new Date();
    start.setHours(
      startPeriod === "PM" && startHour !== "12"
        ? parseInt(startHour) + 12
        : parseInt(startHour)
    );
    start.setMinutes(parseInt(startMinute));

    const end = new Date();
    end.setHours(
      endPeriod === "PM" && endHour !== "12"
        ? parseInt(endHour) + 12
        : parseInt(endHour)
    );
    end.setMinutes(parseInt(endMinute));

    if (start >= end) {
      setError("End time must be after start time.");
      return;
    }

    if (doesTaskOverlap(start, end)) {
      setError("This schedule overlaps with an existing task.");
      toast.error("This schedule overlaps with an existing task.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/hourschedule/${goalId}/schedule/`,
        {
          text: newTask,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          completed: false,
        },
        { withCredentials: true }
      );

      const newSchedule = response.data.schedule || response.data;
      setSchedule((prev) => [...prev, newSchedule]);
      resetForm();
      setError(null);
      toast.success("Schedule created successfully!");
      fetchSchedule();
    } catch (error) {
      toast.error("Failed to create schedule.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle task completion status
  const toggleCompleteStatus = async (taskId) => {
    const taskToUpdate = schedule.find((s) => s && s._id === taskId);
    if (!taskToUpdate || typeof taskToUpdate.completed === "undefined") {
      console.error("Task not found or invalid:", taskToUpdate);
      return;
    }

    try {
      const updatedCompletionStatus = !taskToUpdate.completed;

      setSchedule((prevSchedule) =>
        prevSchedule.map((s) =>
          s._id === taskId ? { ...s, completed: updatedCompletionStatus } : s
        )
      );
      await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/dayschedule/${goalId}/updateschedule/${taskId}`,
        { completed: updatedCompletionStatus },
        { withCredentials: true }
      );

      toast.success("Task updated successfully!");
      fetchSchedule();
    } catch (error) {
      setError("Failed to update task status");
      console.error(error);
    }
  };

  // Delete a task
  const scheduleDelete = async (id) => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/hourschedule/${goalId}/deleteschedule/${id}`,
        { withCredentials: true }
      );
      // Optimistically remove deleted schedule from state
      setSchedule((prev) => prev.filter((item) => item._id !== id));
      toast.success("Schedule deleted successfully!");

      // Optionally refetch to stay in sync
      await fetchSchedule();
    } catch (error) {
      toast.error("Failed to delete schedule.");
      console.error(error);
    }
  };

  // Format time
  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Calculate time left for a task
  const calculateTimeLeft = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const timeLeft = end - now;
    if (timeLeft > 0) {
      const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
      return `${hours}h ${minutes}m left`;
    } else {
      return "Time's up";
    }
  };

  const sortedSchedule = [...schedule].sort((a, b) => {
    const now = new Date();
    const aEnd = new Date(a.endTime);
    const bEnd = new Date(b.endTime);

    const aExpired = aEnd <= now;
    const bExpired = bEnd <= now;

    if (aExpired && !bExpired) return 1;
    if (!aExpired && bExpired) return -1;

    const aStart = new Date(a.startTime);
    const bStart = new Date(b.startTime);
    return aStart - bStart;
  });

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
          {/* Back Button */}
          <motion.button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 mb-6 px-4 py-2 ${themeClasses.glass} border ${themeClasses.text} rounded-xl ${themeClasses.cardHover} transition-all duration-300`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Goals
          </motion.button>

          {/* Header */}
          <ScrollAnimation>
            <div className="text-center mb-8">
            <motion.div
              className="flex items-center justify-center gap-3 mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
                <div className={`p-3 ${themeClasses.glass} rounded-2xl border shadow-lg`}>
                  <ClockIcon className={`w-8 h-8 ${themeClasses.accent}`} />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                Hour Schedule
              </h1>
            </motion.div>
            <div className={`${themeClasses.glass} rounded-2xl border p-4 mb-6 shadow-lg`}>
              <h2 className={`text-xl font-semibold ${themeClasses.text} mb-2`}>
                Goal: <span className={themeClasses.accent}>{goal}</span>
              </h2>
              <p className={themeClasses.textSecondary}>
                Target Date: {new Date(goalDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Time Remaining: {timeLeftForGoal}
              </p>
            </div>
            </div>
          </ScrollAnimation>

          {/* Add Task Form */}
          <ScrollAnimation>
            <motion.div
              className={`${themeClasses.glass} rounded-3xl border p-6 sm:p-8 mb-8 shadow-2xl`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
            <div className="flex items-center gap-3 mb-6">
              <PlusIcon className={`w-6 h-6 ${themeClasses.accent}`} />
              <h2 className={`text-xl font-semibold ${themeClasses.text}`}>Add New Task</h2>
            </div>

            <div className="space-y-6">
              {/* Task Input */}
              <div>
                <label className="form-label">Task Description</label>
                <input
                  type="text"
                  placeholder="Enter your task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Time Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Time */}
                <div>
                  <label className="form-label">
                    Start Time
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={startHour}
                      onChange={(e) => setStartHour(e.target.value)}
                      className="form-input flex-1"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(
                        (hour) => (
                          <option
                            key={hour}
                            value={hour}
                            className="bg-gray-800"
                          >
                            {hour}
                          </option>
                        )
                      )}
                    </select>
                    <select
                      value={startMinute}
                      onChange={(e) => setStartMinute(e.target.value)}
                      className="form-input flex-1"
                    >
                      {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                        <option
                          key={minute}
                          value={minute.toString().padStart(2, "0")}
                          className="bg-gray-800"
                        >
                          {minute.toString().padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                    <select
                      value={startPeriod}
                      onChange={(e) => setStartPeriod(e.target.value)}
                      className="form-input"
                    >
                      <option value="AM" className="bg-gray-800">
                        AM
                      </option>
                      <option value="PM" className="bg-gray-800">
                        PM
                      </option>
                    </select>
                  </div>
                </div>

                {/* End Time */}
                <div>
                  <label className="form-label">
                    End Time
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={endHour}
                      onChange={(e) => setEndHour(e.target.value)}
                      className="form-input flex-1"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(
                        (hour) => (
                          <option
                            key={hour}
                            value={hour}
                            className="bg-gray-800"
                          >
                            {hour}
                          </option>
                        )
                      )}
                    </select>
                    <select
                      value={endMinute}
                      onChange={(e) => setEndMinute(e.target.value)}
                      className="form-input flex-1"
                    >
                      {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                        <option
                          key={minute}
                          value={minute.toString().padStart(2, "0")}
                          className="bg-gray-800"
                        >
                          {minute.toString().padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                    <select
                      value={endPeriod}
                      onChange={(e) => setEndPeriod(e.target.value)}
                      className="form-input"
                    >
                      <option value="AM" className="bg-gray-800">
                        AM
                      </option>
                      <option value="PM" className="bg-gray-800">
                        PM
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  className="flex items-center gap-2 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <ExclamationTriangleIcon className="w-5 h-5" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Add Button */}
              <motion.button
                onClick={scheduleCreate}
                disabled={loading}
                className={`w-full px-6 py-4 ${themeClasses.button} ${themeClasses.buttonHover} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="spinner"></div>
                    Adding Task...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <PlusIcon className="w-5 h-5" />
                    Add Task
                  </div>
                )}
              </motion.button>
            </div>
            </motion.div>
          </ScrollAnimation>

          {/* Schedule List */}
          <ScrollAnimation>
            <motion.div
              className={`${themeClasses.glass} rounded-3xl border p-6 sm:p-8 shadow-2xl`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
            <div className="flex items-center gap-3 mb-6">
              <ClockIcon className={`w-6 h-6 ${themeClasses.accent}`} />
              <h2 className={`text-xl font-semibold ${themeClasses.text}`}>Hourly Tasks</h2>
              <span className="status-badge info">
                {sortedSchedule.length} tasks
              </span>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
              <AnimatePresence>
                {sortedSchedule.length === 0 ? (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <ClockIcon className={`w-16 h-16 ${themeClasses.textSecondary} opacity-50 mx-auto mb-4`} />
                    <p className={`${themeClasses.textSecondary} text-lg`}>
                      No hourly tasks scheduled yet
                    </p>
                    <p className="text-gray-500 text-sm">
                      Add your first task to get started!
                    </p>
                  </motion.div>
                ) : (
                  sortedSchedule.map((task, index) => {
                    if (!task || task.completed === undefined) return null;

                    const isExpired = new Date(task.endTime) <= new Date();

                    return (
                      <motion.div
                        key={task._id}
                        className={`p-4 rounded-2xl border transition-all duration-300 ${
                          task.completed
                            ? "bg-green-500/20 border-green-500/30"
                            : isExpired
                            ? "bg-red-500/20 border-red-500/30"
                            : "bg-white/10 border-white/20 hover:bg-white/20"
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        layout
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <h3
                              className={`font-medium text-lg ${
                                task.completed
                                  ? "text-green-300 line-through"
                                  : themeClasses.text
                              }`}
                            >
                              {task.text}
                            </h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                            <div className={`flex items-center gap-4 mt-2 text-sm ${themeClasses.textSecondary}`}>
                              <span className="flex items-center gap-1">
                                <ClockIcon className="w-4 h-4" />
                                {formatTime(task.startTime)} -{" "}
                                {formatTime(task.endTime)}
                              </span>
                              <span
                                className={`status-badge ${
                                  isExpired ? "error" : "info"
                                }`}
                              >
                                {calculateTimeLeft(task.endTime)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <motion.button
                              onClick={() => toggleCompleteStatus(task._id)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                                task.completed
                                  ? "bg-green-500/30 text-green-300 hover:bg-green-500/40"
                                  : "bg-blue-500/30 text-blue-300 hover:bg-blue-500/40"
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <CheckCircleIcon className="w-4 h-4" />
                              {task.completed ? "Completed" : "Mark Done"}
                            </motion.button>

                            <motion.button
                              onClick={() => scheduleDelete(task._id)}
                              className="p-2 bg-red-500/30 text-red-300 hover:bg-red-500/40 rounded-xl transition-all duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <TrashIcon className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
            </motion.div>
          </ScrollAnimation>
        </motion.div>
      </div>
    </div>
  );
}

export default Schedule;
