import React, { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
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

    try {
      const decodedUser = jwtDecode(token);
      setUser(decodedUser);

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/goal/fetch`,
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
      console.error(
        "Error fetching goals:",
        err?.response?.data || err.message
      );
      toast.error("Failed to fetch goals. Please try again.");
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

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      if (isEditing) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/goal/update/${isEditing}`,
          { goal, goalDate },
          { headers }
        );
        toast.success("Goal updated successfully!");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/goal/target`,
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
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}1/api/goal/delete/${id}`);
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
  };

  return (
    <div className="bg-gradient-to-b bg-gray-600 text-white flex items-center justify-center min-h-screen p-2 sm:p-4">
      {/* <div className="bg-gradient-to-b from-gray-800 to-gray-900 text-white flex items-center justify-center min-h-screen p-2 sm:p-4"> */}
      <div className="w-full max-w-md sm:max-w-xl">
        {error && (
          <div className="bg-red-500 text-white p-2 sm:p-3 rounded-lg mb-4 sm:mb-6 text-center text-sm sm:text-base">
            {error}
          </div>
        )}

        {isAddingGoal ? (
          <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-6 bg-white text-gray-900 rounded-lg shadow-lg space-y-4 sm:space-y-6"
          >
           
            <div class="flex flex-col md:flex-row items-center p-4 bg-white rounded shadow">
              <button
                onClick={handleBack}
                type="button"
                className="text-blue-500 mr-4 mb-2 md:mb-0"
              >
                {" "}
                <ArrowLeftIcon className=" h-5 w-5" />
              </button>
              <h2 class="text-lg font-semibold">
                {" "}
                {isEditing ? "Edit Your Goal" : "Add New Goal"}
              </h2>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <label className="block text-base sm:text-lg font-semibold text-gray-700">
                Goal
              </label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="E.g., Learn React"
              />
            </div>

            <div className="space-y-2 sm:space-y-3">
              <label className="block text-base sm:text-lg font-semibold text-gray-700">
                Goal Date
              </label>
              <input
                type="date"
                value={goalDate}
                onChange={(e) => setGoalDate(e.target.value)}
                className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 sm:py-3 rounded-lg hover:bg-blue-700 transition font-semibold text-sm sm:text-base"
            >
              {isEditing ? "Update Goal" : "Save Goal"}
            </button>
          </form>
        ) : (
          <div className="p-4 sm:p-6 bg-white text-gray-900 rounded-lg shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-blue-600">
              Your Goals
            </h2>
            {goalsList.length === 0 ? (
              <p className="text-center text-gray-500 text-sm sm:text-base">
                No goals yet. Click "Add New Goal" to get started.
              </p>
            ) : (
              <div className="space-y-3 sm:space-y-4 max-h-72 sm:max-h-80 overflow-y-auto">
                {goalsList.map((goalItem) => (
                  <div
                    key={goalItem._id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 bg-white rounded-lg shadow border space-y-3 sm:space-y-0"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-800 text-base">
                        {goalItem.goal}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {new Date(goalItem.goalDate).toLocaleDateString(
                          "en-GB"
                        )}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                      <button
                        onClick={() => handleEdit(goalItem._id)}
                        className="flex-1 min-w-[80px] bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-sm font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteGoal(goalItem._id)}
                        className="flex-1 min-w-[80px] bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm font-semibold"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleSchedule(goalItem)}
                        className="flex-1 min-w-[80px] bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm font-semibold"
                      >
                        Schedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => {
                setIsAddingGoal(true);
                toast.info("Add a new goal!");
              }}
              className="mt-6 sm:mt-6 w-full bg-blue-600 text-white py-3 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 text-sm sm:text-base"
            >
              Add New Goal
            </button>
          </div>
        )}

        {/* Schedule Modal */}
        {showScheduleOptions && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50 p-2 sm:p-0">
            {/* <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-xs">
              <button
                onClick={handleBack}
                className="absolute top-19 left-13 bg-gray-700 text-white p-2 rounded-full shadow-md hover:bg-gray-600 transition ease-in-out duration-300"
              >
                <ArrowLeftIcon className="h-4 w-4" />
              </button>
              <h2 className="text-lg sm:text-3xl font-bold text-center py-2 text-gray-800 mb-3">
                Choose a Schedule Type
              </h2> */}
            <div class="flex flex-col p-4 sm:p-6 rounded-lg shadow-lg bg-white space-y-3 md:space-y-0">
              {/* <!-- Top Row: Back button + Heading --> */}
              <div class="flex flex-col md:flex-row items-center md:justify-between">
                <div class="flex items-center mb-2 md:mb-0">
                  <button
                    onClick={handleBack}
                    type="button"
                    className="text-blue-500 mr-4 mb-2"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                  </button>
                  <h2 className="text-lg font-bold mb-1 md:mb-4 text-black">
                    Choose a Schedule Type
                  </h2>
                </div>
              </div>

              {/* <!-- Buttons --> */}
              <div className="space-y-3 w-full md:w-auto">
                <button
                  onClick={() => navigateToSchedule("day")}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                >
                  Day Schedule
                </button>
                <button
                  onClick={() => navigateToSchedule("hour")}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                >
                  Hour Schedule
                </button>
              </div>
            </div>
          </div>
        )}
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </div>
  );
};

export default GoalPage;
