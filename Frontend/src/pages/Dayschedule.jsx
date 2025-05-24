import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeftIcon } from "@heroicons/react/solid";
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
  // const [goalDate, setGoalDate] = useState("");

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
  useEffect(() => {
    const fetchGoalDetails = async () => {
      try {
        setLoading(true); // Set loading true while fetching
        const response = await axios.get(
          `http://localhost:4001/api/dayschedule/${goalId}/fetchschedule`,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        setSchedule(response.data.tasks || []);
        setCompletedTasks(response.data.tasks.filter((task) => task.completed));
        setLoading(false); // Set loading false after fetching
      } catch (error) {
        setError("Failed to fetch goal details.");
        setLoading(false); // Set loading false in case of error
      }
    };

    if (goalId) fetchGoalDetails();
  }, [goalId]);

  const scheduleCreate = async () => {
    if (!newTask || !startDate || !endDate) {
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
      await axios.post(
        `http://localhost:4001/api/dayschedule/${goalId}/schedule/`,
        {
          text: newTask,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          completed: false,
        },
        { withCredentials: true }
      );

      // Directly update the schedule state without fetching again
      const newSchedule = {
        _id: Date.now().toString(), // Unique ID for the new task
        text: newTask,
        startDate,
        endDate,
        completed: false,
      };

      setSchedule((prevSchedule) => [...prevSchedule, newSchedule]);
      setNewTask("");
      setStartDate("");
      setEndDate("");
      setError(null);
      toast.success("Schedule added successfully!");
    } catch (error) {
      toast.error("Failed to add schedule.");
      console.log(error);
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
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(
        `http://localhost:4001/api/dayschedule/${goalId}/deleteschedule/${taskId}`,
        { withCredentials: true }
      );
      setSchedule((prevSchedule) =>
        prevSchedule.filter((s) => s._id !== taskId)
      );
      toast.success("Schedule deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete schedule.");
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();

  return (
    <div className="bg-[#2f363e] min-h-screen w-full flex justify-center items-start p-4">
      <div className="bg-[#262b32] w-full max-w-lg lg:max-w-2xl xl:max-w-3xl rounded-lg shadow-lg flex flex-col mx-auto p-6 h-[85vh]">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-gray-700 text-white p-2 rounded-full shadow-md hover:bg-gray-600 transition ease-in-out duration-300"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div className="sticky top-0 bg-[#262b32] z-10">
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
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-3 border border-gray-600 bg-gray-700 text-white rounded-md w-full"
                />
              </div>
              <div className="flex flex-col w-1/2">
                <label className="text-sm text-gray-300 mb-1">End Time</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-3 border border-gray-600 bg-gray-700 text-white rounded-md w-full"
                />
              </div>
            </div>
            <button
              onClick={scheduleCreate}
              className="text-white bg-blue-600 hover:bg-blue-500 p-3 rounded-md transition duration-200 transform hover:scale-105"
            >
              Add Schedule
            </button>
          </div>
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
                      Start: {formatDate(s.startDate)} | End:{" "}
                      {formatDate(s.endDate)}
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
