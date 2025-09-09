import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";


import { motion, AnimatePresence } from "framer-motion";
import { 
  ClockIcon, 
  PlusIcon, 
  CheckCircleIcon, 
  TrashIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

import "react-toastify/dist/ReactToastify.css";

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

  // const navigateTo = useNavigate();

  useEffect(() => {
    // Load the schedule from localStorage if available


  useEffect(() => {

    const savedSchedule = localStorage.getItem("schedule");
    if (savedSchedule) {
      setSchedule(JSON.parse(savedSchedule));
    }

    
    // Fetch the latest schedule from the backend
    const fetchSchedule = async () => {
      const token = localStorage.getItem("jwt");
  
      if (!token) {
        toast.error("You need to log in first.");
        setSchedule([]);
        return;
      }
  
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:4001/api/schedule/fetch",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
  
        const fetchedSchedule = Array.isArray(response.data.schedule)
          ? response.data.schedule
          : [];
        setSchedule(fetchedSchedule);
        localStorage.setItem("schedule", JSON.stringify(fetchedSchedule)); // Save to localStorage
      } catch (error) {
        console.error("Failed to fetch schedule:", error);
        toast.error("Failed to fetch schedule from server.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchSchedule();
  }, []);
  
  useEffect(() => {
    // Save the current schedule to localStorage whenever it changes
    localStorage.setItem("schedule", JSON.stringify(schedule));
  }, [schedule]);
  

  const doesTaskOverlap = (newTaskStart, newTaskEnd) => {
    return schedule.some(
      (task) =>
        new Date(task.startTime) < new Date(newTaskEnd) &&
        new Date(task.endTime) > new Date(newTaskStart)
    );

  }, []);

  useEffect(() => {
    localStorage.setItem("schedule", JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      toast.error("You need to log in first.");
      setSchedule([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/schedule/fetch`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const fetchedSchedule = Array.isArray(response.data.schedule)
        ? response.data.schedule
        : [];
      setSchedule(fetchedSchedule);
      localStorage.setItem("schedule", JSON.stringify(fetchedSchedule));
    } catch (error) {
      console.error("Failed to fetch schedule:", error);
      toast.error("Failed to fetch schedule from server.");
    } finally {
      setLoading(false);
    }
  };

  const doesTaskOverlap = (start, end) => {
    return schedule.some((s) => {
      const existingStart = new Date(s.startTime);
      const existingEnd = new Date(s.endTime);
      const noOverlap = end <= existingStart || start >= existingEnd;
      return !noOverlap;
    });

  };

  const scheduleCreate = async () => {
    if (!newTask || !startHour || !endHour) {
      setError("Please fill in all fields.");
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

      setError("Task overlaps with an existing schedule.");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("jwt"); // Retrieve the JWT token


      setError("This schedule overlaps with an existing task.");
      toast.error("This schedule overlaps with an existing task.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("jwt");

      if (!token) {
        toast.error("You need to log in first.");
        return;
      }


      // Send the POST request to create a new schedule
      const response = await axios.post(
        "http://localhost:4001/api/schedule/schedule/", // Correct endpoint

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/schedule/schedule/`,

        {
          text: newTask,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          completed: false,
        },
        {
          headers: {

            Authorization: `Bearer ${token}`, // Include JWT in the Authorization header
            "Content-Type": "application/json",
          },
        }
      );

      // Add the new schedule to the state
      const newSchedule = {
        text: newTask,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        completed: false,
      };

      setSchedule((prevSchedule) => [...prevSchedule, newSchedule]);
      resetForm(); // Reset form fields

            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const newSchedule = response.data.schedule || response.data;
      setSchedule((prev) => [...prev, newSchedule]);
      resetForm();

      setError(null);
      toast.success("Schedule created successfully!");
    } catch (error) {
      console.error("Error creating schedule:", error);
      toast.error("Failed to create schedule.");

    }
  };

  // Helper function to reset form fields

    } finally {
      setLoading(false);
    }
  };

  const toggleCompleteStatus = async (taskId) => {
    const taskToUpdate = schedule.find((s) => s && s._id === taskId);
    if (!taskToUpdate) return;

    try {
      const updatedCompletionStatus = !taskToUpdate.completed;

      setSchedule((prev) =>
        prev.map((s) =>
          s._id === taskId ? { ...s, completed: updatedCompletionStatus } : s
        )
      );

      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/schedule/schedule/${taskId}`,
        { completed: updatedCompletionStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Failed to update task status:", error);
      toast.error("Failed to update status.");
    }
  };

  const scheduleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/schedule/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          withCredentials: true,
        }
      );
      setSchedule((prev) => prev.filter((item) => item._id !== id));
      toast.success("Schedule deleted successfully!");
      await fetchSchedule();
    } catch (error) {
      toast.error("Failed to delete schedule.");
      console.error(error);
    }
  };


  const resetForm = () => {
    setNewTask("");
    setStartHour("12");
    setStartMinute("00");
    setStartPeriod("AM");
    setEndHour("12");
    setEndMinute("00");
    setEndPeriod("AM");
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

      const response = await axios.put(
        `http://localhost:4001/api/schedule/schedule/${taskId}`,
        { completed: updatedCompletionStatus },
        { withCredentials: true }
      );
      console.log("Update Response:", response);
    } catch (error) {
      console.error(
        "Failed to update task status:",
        error.response || error.message
      );
    }
  };

  const scheduleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4001/api/schedule/delete/${id}`, {
        withCredentials: true,
      });
      setSchedule(schedule.filter((s) => s._id !== id));
      toast.success("Schedule deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete schedule.");
      console.error(error);
    }
  };



  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

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


  const remainingSchedule = Array.isArray(schedule)
    ? schedule.filter((s) => !s.completed).length
    : 0;

  return (
    <div className="bg-[#2f363e] min-h-screen w-full flex justify-center items-start p-4">
      <div className="bg-[#262b32] w-full max-w-lg lg:max-w-2xl xl:max-w-3xl rounded-lg shadow-lg flex flex-col mx-auto p-6 h-[85vh]">
        {/* Header */}
        <h1 className="text-2xl  md:text-3xl font-bold mt-9 mb-5 text-center">
          <span className="font-extrabold text-blue-500">Schedule</span>
        </h1>

        {/* Task input section */}
        <div className="flex flex-col gap-6 mb-6">
          <input
            type="text"
            placeholder="Enter task name"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="p-3 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none w-full placeholder-gray-400"
          />

          <div className="flex gap-4">
            <div className="flex flex-col w-1/2">
              <label className="text-sm text-gray-300 mb-1">Start Time</label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                  className="w-1/3 p-2 rounded-md bg-gray-700 text-white border border-gray-600"
                />
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={startMinute}
                  onChange={(e) => setStartMinute(e.target.value)}
                  className="w-1/3 p-2 rounded-md bg-gray-700 text-white border border-gray-600"
                />
                <select
                  value={startPeriod}
                  onChange={(e) => setStartPeriod(e.target.value)}
                  className="w-1/3 p-2 rounded-md bg-gray-700 text-white border border-gray-600"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col w-1/2">
              <label className="text-sm text-gray-300 mb-1">End Time</label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={endHour}
                  onChange={(e) => setEndHour(e.target.value)}
                  className="w-1/3 p-2 rounded-md bg-gray-700 text-white border border-gray-600"
                />
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={endMinute}
                  onChange={(e) => setEndMinute(e.target.value)}
                  className="w-1/3 p-2 rounded-md bg-gray-700 text-white border border-gray-600"
                />
                <select
                  value={endPeriod}
                  onChange={(e) => setEndPeriod(e.target.value)}
                  className="w-1/3 p-2 rounded-md bg-gray-700 text-white border border-gray-600"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={scheduleCreate}
            className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-500 transition ease-in-out duration-300"
          >
            Add Schedule
          </button>

          <h2 className="text-xl font-bold text-gray-300 mb-4">
            Your Schedule
          </h2>
        </div>

        {/* Schedule list */}
        <div className="space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 h-full">
          {schedule.length === 0 ? (
            <p className="text-gray-300 text-center">No schedule.</p>
          ) : (
            schedule.map((s) => {
              if (!s || s.completed === undefined) {
                console.error("Invalid task:", s);
                return null; // Skip invalid task
              }

              // Render valid task
              return s.text ? (
                <div
                  key={s._id}
                  className="flex justify-between items-center bg-[#1c232b] p-4 rounded-lg"
                >
                  <div>
                    <p className="text-gray-300">{s.text}</p>
                    <p className="text-sm text-gray-500">
                      {formatTime(s.startTime)} - {formatTime(s.endTime)} |{" "}
                      {calculateTimeLeft(s.endTime)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleCompleteStatus(s._id)}
                      className="text-green-500"
                    >
                      {s.completed ? "✔️ Completed" : " Mark Complete"}
                    </button>
                    <button
                      onClick={() => scheduleDelete(s._id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : null;
            })
          )}
          <ToastContainer position="top-center" autoClose={3000} />
        </div>
      </div>

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
                Your Schedule
              </h1>
            </motion.div>
            <p className="text-gray-300 text-lg">Manage your daily tasks and stay organized</p>
          </div>

          {/* Add Task Form */}
          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 sm:p-8 mb-8 shadow-2xl"
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Task Description
                </label>
                <input
                  type="text"
                  placeholder="Enter your task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Time Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Time
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={startHour}
                      onChange={(e) => setStartHour(e.target.value)}
                      className="flex-1 px-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                        <option key={hour} value={hour} className="bg-gray-800">
                          {hour}
                        </option>
                      ))}
                    </select>
                    <select
                      value={startMinute}
                      onChange={(e) => setStartMinute(e.target.value)}
                      className="flex-1 px-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                        <option key={minute} value={minute.toString().padStart(2, '0')} className="bg-gray-800">
                          {minute.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <select
                      value={startPeriod}
                      onChange={(e) => setStartPeriod(e.target.value)}
                      className="px-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="AM" className="bg-gray-800">AM</option>
                      <option value="PM" className="bg-gray-800">PM</option>
                    </select>
                  </div>
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Time
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={endHour}
                      onChange={(e) => setEndHour(e.target.value)}
                      className="flex-1 px-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                        <option key={hour} value={hour} className="bg-gray-800">
                          {hour}
                        </option>
                      ))}
                    </select>
                    <select
                      value={endMinute}
                      onChange={(e) => setEndMinute(e.target.value)}
                      className="flex-1 px-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                        <option key={minute} value={minute.toString().padStart(2, '0')} className="bg-gray-800">
                          {minute.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <select
                      value={endPeriod}
                      onChange={(e) => setEndPeriod(e.target.value)}
                      className="px-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="AM" className="bg-gray-800">AM</option>
                      <option value="PM" className="bg-gray-800">PM</option>
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
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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
            className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <ClockIcon className="w-6 h-6 text-purple-300" />
              <h2 className="text-xl font-semibold text-white">Today's Tasks</h2>
              <span className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm font-medium">
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
                    <CalendarDaysIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No tasks scheduled yet</p>
                    <p className="text-gray-500 text-sm">Add your first task to get started!</p>
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
                            <h3 className={`font-medium text-lg ${
                              task.completed ? "text-green-300 line-through" : "text-white"
                            }`}>
                              {task.text}
                            </h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <ClockIcon className="w-4 h-4" />
                                {formatTime(task.startTime)} - {formatTime(task.endTime)}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                isExpired
                                  ? "bg-red-500/30 text-red-300"
                                  : "bg-blue-500/30 text-blue-300"
                              }`}>
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
        theme="dark"
      />

    </div>
  );
}


export default Schedule;

export default Schedule;

