import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftIcon,
  PlusIcon,
  CheckCircleIcon,
  TrashIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Schedule() {
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading as true
  const [newTask, setNewTask] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timeLeftForGoal, setTimeLeftForGoal] = useState("");
  const [completedTasks, setCompletedTasks] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { goal, goalDate, id: goalId } = location.state || {}; // `goalId` from `location.state`

  // Fetch goal details
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
  const fetchSchedules = async () => {
    if (!goalId) return;
    setLoading(true);
    setError(null);
    try {
      // setLoading(true); // Set loading true while fetching
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/dayschedule/${goalId}/fetchschedule`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Fetched schedules:", response.data.schedule);
      setSchedule(response.data.tasks || []);
      setCompletedTasks(
        response.data.tasks?.filter((task) => task.completed) || []
      );
    } catch (error) {
      setError("Failed to fetch schedule.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSchedules();
  }, []);

  const scheduleCreate = async () => {
    if (!newTask.trim() || !startDate || !endDate) {
      setError("Please fill in all fields.");
      return;
    }

    const goalDateTime = new Date(goalDate);
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    const now = new Date();

    if (startDateTime <= now || endDateTime <= now) {
      toast.error("Start date and end date must be after the present date.");
      return;
    }

    if (startDateTime > goalDateTime || endDateTime > goalDateTime) {
      toast.error(
        "Start date and end date must be before or equal to the goal date."
      );
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/dayschedule/${goalId}/schedule/`,
        {
          text: newTask,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          completed: false,
        },
        { withCredentials: true }
      );

      await fetchSchedules(); // Only this to update schedule state

      setNewTask("");
      setStartDate("");
      setEndDate("");
      setError(null);
      toast.success("Schedule added successfully!");
    } catch (error) {
      toast.error("Failed to add schedule.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
        `${import.meta.env.VITE_BACKEND_URL}/api/dayschedule/${goalId}/updateschedule/${taskId}`,
        { completed: updatedCompletionStatus },
        { withCredentials: true }
      );
      toast.success("Task updated successfully!");
      fetchSchedules();
    } catch (error) {
      setError("Failed to update task status");
      console.error(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/dayschedule/${goalId}/deleteschedule/${id}`,
        { withCredentials: true }
      );
      toast.success("Schedule deleted successfully!");

      // Remove the deleted task from the local schedule state
      setSchedule((prevSchedule) =>
        prevSchedule.filter((task) => task._id !== id)
      );

      // ✅ Re-fetch schedules from the server to ensure everything is in sync
      await fetchSchedules();
    } catch (error) {
      toast.error("Failed to delete schedule.");
      console.error(error);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
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
            className="flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Goals
          </motion.button>

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              className="flex items-center justify-center gap-3 mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <CalendarDaysIcon className="w-8 h-8 text-purple-300" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                Day Schedule
              </h1>
            </motion.div>
            <div className="glass-card rounded-2xl p-4 mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">
                Goal: <span className="text-purple-300">{goal}</span>
              </h2>
              <p className="text-gray-300">
                Target Date: {new Date(goalDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Time Remaining: {timeLeftForGoal}
              </p>
            </div>
          </div>

          {/* Add Task Form */}
          <motion.div
            className="glass-card rounded-3xl p-6 sm:p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <PlusIcon className="w-6 h-6 text-purple-300" />
              <h2 className="text-xl font-semibold text-white">Add New Task</h2>
            </div>

            <div className="space-y-6">
              {/* Task Input */}
              <div>
                <label className="form-label">Task Description</label>
                <input
                  type="text"
                  placeholder="Enter task name..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Date Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="form-input"
                  />
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
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Schedule List */}
          <motion.div
            className="glass-card rounded-3xl p-6 sm:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <CalendarDaysIcon className="w-6 h-6 text-purple-300" />
              <h2 className="text-xl font-semibold text-white">
                Daily Tasks
              </h2>
              <span className="status-badge info">
                {schedule.length} tasks
              </span>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
              <AnimatePresence>
                {schedule.length === 0 ? (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <CalendarDaysIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">
                      No daily tasks scheduled yet
                    </p>
                    <p className="text-gray-500 text-sm">
                      Add your first task to get started!
                    </p>
                  </motion.div>
                ) : (
                  schedule.map((task, index) => {
                    if (!task || task.completed === undefined) return null;

                    const isOverdue = new Date(task.endDate) < new Date();

                    return (
                      <motion.div
                        key={task._id}
                        className={`p-4 rounded-2xl border transition-all duration-300 ${
                          task.completed
                            ? "bg-green-500/20 border-green-500/30"
                            : isOverdue
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
                                  : "text-white"
                              }`}
                            >
                              {task.text}
                            </h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <CalendarDaysIcon className="w-4 h-4" />
                                {formatDate(task.startDate)} - {formatDate(task.endDate)}
                              </span>
                              <span
                                className={`status-badge ${
                                  isOverdue ? "error" : "info"
                                }`}
                              >
                                {isOverdue ? "Overdue" : "Active"}
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
                              onClick={() => deleteTask(task._id)}
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
        </motion.div>
      </div>
    </div>
  );
}

export default Schedule;
