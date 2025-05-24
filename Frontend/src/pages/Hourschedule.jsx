import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/solid";

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

  const navigate = useNavigate();
  const location = useLocation();
  const { goal, goalDate, id: goalId } = location.state || {};

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

  // Fetch goal details
  useEffect(() => {
    const fetchGoalDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4001/api/hourschedule/${goalId}/fetchschedule`,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        const { goal, goalDate } = response.data;
        console.log("Fetched goal date:", goalDate); // Log the goalDate
        setGoal(goal);
        // setGoalDate(response.data.goalDate);
      } catch (error) {
        setError("Failed to fetch goal details.");
      }
    };

    if (goalId) fetchGoalDetails();
  }, [goalId]);

  // Calculate time left for the goal

  // Fetch schedule
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!goalId) return;

      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:4001/api/hourschedule/${goalId}/fetchschedule`,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        setSchedule(response.data.schedule);
        setCompletedTasks(response.data.tasks.filter((task) => task.completed));
        setLoading(false); // Set loading false after fetching
      } catch (error) {
        setError("Failed to fetch schedule.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [goalId]);

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

    try {
      setLoading(true);

      // Send the request to create the task
      await axios.post(
        `http://localhost:4001/api/hourschedule/${goalId}/schedule/`,
        {
          text: newTask,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          completed: false,
        },
        { withCredentials: true }
      );

      // Update the local state without waiting for a re-fetch
      const newSchedule = {
        _id: Date.now().toString(), // Unique ID for the new task
        text: newTask,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        completed: false,
      };

      setSchedule((prevSchedule) => [...prevSchedule, newSchedule]);

      // Clear form fields
      setNewTask("");
      setStartHour("12");
      setStartMinute("00");
      setStartPeriod("AM");
      setEndHour("12");
      setEndMinute("00");
      setEndPeriod("AM");
      setError(null);
      toast.success("Schedule added successfully!");
    } catch (error) {
      setError("Failed to create schedule.");
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
        `http://localhost:4001/api/dayschedule/${goalId}/updateschedule/${taskId}`,
        { completed: updatedCompletionStatus },
        { withCredentials: true }
      );
    } catch (error) {
      setError("Failed to update task status");
      console.error(error);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `http://localhost:4001/api/hourschedule/${goalId}/deleteschedule/${id}`,
        { withCredentials: true }
      );

      setSchedule((prev) => prev.filter((s) => s._id !== id));
      toast.success("Schedule deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete schedule.");
    
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

    return timeLeft > 0
      ? `${Math.floor(timeLeft / (1000 * 60 * 60))}h ${Math.floor(
          (timeLeft / (1000 * 60)) % 60
        )}m left`
      : "Time's up";
  };

  return (
    <div className="bg-[#2f363e] min-h-screen w-full flex justify-center items-start p-4">
      <div className="bg-[#262b32] w-full max-w-lg lg:max-w-2xl xl:max-w-3xl rounded-lg shadow-lg flex flex-col mx-auto p-6 h-[85vh]">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-gray-700 text-white p-2 rounded-full shadow-md hover:bg-gray-600 transition ease-in-out duration-300"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Goal: <span className="text-blue-500">{goal}</span>
          </h2>
          <p className="text-md sm:text-lg text-gray-300">
            Goal Date: {new Date(goalDate).toLocaleDateString()}
          </p>
          <p className="text-sm sm:text-md text-gray-400 mt-2">
            Time left: {timeLeftForGoal}
          </p>
        </div>

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

        <div className="space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 h-full">
          {schedule.length === 0 ? (
            <p className="text-gray-300 text-center">
              No schedule found for this goal.
            </p>
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
                      onClick={() => deleteTask(s._id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : null;
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Schedule;
