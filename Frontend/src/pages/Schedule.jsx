import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
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

      if (!token) {
        toast.error("You need to log in first.");
        return;
      }

      // Send the POST request to create a new schedule
      const response = await axios.post(
        "http://localhost:4001/api/schedule/schedule/", // Correct endpoint
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
      setError(null);
      toast.success("Schedule created successfully!");
    } catch (error) {
      console.error("Error creating schedule:", error);
      toast.error("Failed to create schedule.");
    }
  };

  // Helper function to reset form fields
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
    </div>
  );
}

export default Schedule;
