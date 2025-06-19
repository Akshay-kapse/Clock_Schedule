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

  useEffect(() => {
    const savedSchedule = localStorage.getItem("schedule");
    if (savedSchedule) {
      setSchedule(JSON.parse(savedSchedule));
    }
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

  // 🟢 Sort the schedule list: upcoming tasks at top, expired tasks at bottom
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
    <div className="bg-[#2f363e] min-h-screen w-full flex justify-center items-start p-2 sm:p-4">
      <div className="bg-[#262b32] w-full max-w-md sm:max-w-lg lg:max-w-2xl xl:max-w-3xl rounded-lg shadow-lg flex flex-col mx-auto p-4 sm:p-6 h-[85vh]">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mt-10 mb-4 text-center">
          <span className="font-extrabold text-blue-500">Schedule</span>
        </h1>

        {/* Input section */}
        <div className="flex flex-col gap-4 sm:gap-6 mb-4 sm:mb-6">
          <input
            type="text"
            placeholder="Enter task name"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="p-2 sm:p-3 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none w-full placeholder-gray-400"
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
            <div className="flex flex-col w-full sm:w-1/2">
              <label className="text-xs sm:text-sm text-gray-300 mb-1">
                Start Time
              </label>
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

            <div className="flex flex-col w-full sm:w-1/2">
              <label className="text-xs sm:text-sm text-gray-300 mb-1">
                End Time
              </label>
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
            className="bg-blue-600 text-white p-2 sm:p-3 rounded-md hover:bg-blue-500 transition ease-in-out duration-300 text-sm sm:text-base"
          >
            Add Schedule
          </button>

          <h2 className="text-lg sm:text-xl font-bold text-gray-300 mb-2 sm:mb-4">
            Your Schedule
          </h2>
        </div>

        {/* Schedule list */}
        <div className="space-y-3 sm:space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 flex-1">
          {sortedSchedule.length === 0 ? (
            <p className="text-gray-300 text-center text-sm sm:text-base">
              No schedule.
            </p>
          ) : (
            sortedSchedule.map((s) => {
              if (!s || s.completed === undefined) {
                console.error("Invalid task:", s);
                return null;
              }

              return s.text ? (
                <div
                  key={s._id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-[#1c232b] p-3 sm:p-4 rounded-lg gap-2"
                >
                  <div>
                    <p className="text-gray-300 text-sm sm:text-base">
                      {s.text}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {formatTime(s.startTime)} - {formatTime(s.endTime)} |{" "}
                      {calculateTimeLeft(s.endTime)}
                    </p>
                  </div>
                  <div className="flex gap-2 text-sm sm:text-base">
                    <button
                      onClick={() => toggleCompleteStatus(s._id)}
                      className="text-green-500"
                    >
                      {s.completed ? "✔️ Completed" : "Mark Complete"}
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
