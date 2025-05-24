// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import { jwtDecode } from "jwt-decode";
// import "react-toastify/dist/ReactToastify.css";

// const GoalPage = () => {
//   const [goal, setGoal] = useState("");
//   const [goalDate, setGoalDate] = useState("");
//   const [goalsList, setGoalsList] = useState([]);
//   const [isAddingGoal, setIsAddingGoal] = useState(false);
//   const [showScheduleOptions, setShowScheduleOptions] = useState(false);
//   const [selectedGoalItem, setSelectedGoalItem] = useState(null);
//   const [isEditing, setIsEditing] = useState(null);
//   const [error, setError] = useState("");
//   const [user, setUser] = useState(null);
//   const [lastAction, setLastAction] = useState(null); // Track the last action

//   const navigate = useNavigate();

//   // Fetch goals from backend
//   const fetchGoals = async () => {
//     const token = localStorage.getItem("jwt");

//     if (!token) {
//       toast.error("Please login to fetch your goals.");
//       return;
//     }

//     try {
//       // Decode token to fetch user details
//       const decodedUser = jwtDecode(token); // Adjust the import based on your library version
//       setUser(decodedUser);

//       // Fetch the goals from the backend
//       const response = await axios.get("http://localhost:4001/api/goal/fetch", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         withCredentials: true,
//       });

//       // Update the goals list if response contains goals
//       if (response.data?.goal) {
//         setGoalsList(response.data.goal);
//       }
//     } catch (err) {
//       console.error(
//         "Error fetching goals:",
//         err?.response?.data || err.message
//       );
//       toast.error("Failed to fetch goals. Please try again.");
//     }
//   };

//   useEffect(() => {
//     fetchGoals();
//   }, []);

//   // Save or update goal
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const token = localStorage.getItem("jwt");

//     if (!goal || !goalDate) {
//       toast.error("Both goal and goal date are required.");
//       return;
//     }

//     // Validate if the goal year is within 10 years
//     const currentYear = new Date().getFullYear();
//     const enteredYear = new Date(goalDate).getFullYear();

//     if (enteredYear > currentYear + 10) {
//       toast.error("Goal year must be within 10 years from now.");
//       return;
//     }

//     try {
//       const headers = {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       };

//       if (isEditing) {
//         // Update an existing goal
//         await axios.put(
//           `http://localhost:4001/api/goal/update/${isEditing}`,
//           { goal, goalDate },
//           { headers }
//         );
//         toast.success("Goal updated successfully!");
//       } else {
//         // Add a new goal
//         await axios.post(
//           "http://localhost:4001/api/goal/target",
//           { goal, goalDate },
//           { headers }
//         );
//         toast.success("Goal added successfully!");
//       }

//       // Refresh goal list
//       fetchGoals();
//       // Reset form fields
//       setGoal("");
//       setGoalDate("");
//       setIsAddingGoal(false);
//       setIsEditing(null);
//     } catch (error) {
//       console.error(
//         "Error saving goal:",
//         error?.response?.data || error.message
//       );
//       toast.error("Failed to save goal. Please try again.");
//     }
//   };

//   // Delete goal
//   const deleteGoal = async (id) => {
//     try {
//       await axios.delete(`http://localhost:4001/api/goal/delete/${id}`);
//       setGoalsList((prevGoals) =>
//         prevGoals.filter((goalItem) => goalItem._id !== id)
//       );
//       toast.success("Goal deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting goal:", error);
//       toast.error("Failed to delete goal. Please try again.");
//     }
//   };

//   // Edit goal
//   const handleEdit = (id) => {
//     const goalToEdit = goalsList.find((g) => g._id === id);
//     if (!goalToEdit) return;

//     setGoal(goalToEdit.goal);
//     setGoalDate(goalToEdit.goalDate.slice(0, 10));
//     setIsEditing(id);
//     setIsAddingGoal(true);
//   };

//   // Schedule handling
//   const handleSchedule = (goalItem) => {
//     setSelectedGoalItem(goalItem);
//     setShowScheduleOptions(true);
//   };

//   const navigateToSchedule = (scheduleType) => {
//     if (!selectedGoalItem) return;

//     navigate(`/goalschedule/${selectedGoalItem._id}/${scheduleType}`, {
//       state: {
//         id: selectedGoalItem._id,
//         goal: selectedGoalItem.goal,
//         goalDate: selectedGoalItem.goalDate,
//       },
//     });

//     setShowScheduleOptions(false);
//   };

//   const handleBack = () => {
//     setIsAddingGoal(false); // Close the Add/Edit Goal form
//     setShowScheduleOptions(false); // Close the schedule modal if open
//     setIsEditing(null); // Reset editing state
//   };

//   return (
//     <div className="bg-gradient-to-b from-gray-800 to-gray-900 text-white flex items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 lg:p-10 relative">
//       {/* Main Container */}
//       <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
//         {/* Error Display */}
//         {error && (
//           <div className="bg-red-500 text-white p-3 rounded-lg mb-6 text-center">
//             {error}
//           </div>
//         )}

//         {/* Add/Edit Goal Form */}
//         {isAddingGoal ? (
//           <form
//             onSubmit={handleSubmit}
//             className="p-6 sm:p-8 bg-white text-gray-900 rounded-lg shadow-lg space-y-6"
//           >
//             {" "}
//             <button
//               onClick={handleBack}
//               className="bg-gray-700 text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 transition ease-in-out duration-300 flex items-center"
//             >
//               <span className="mr-2">⬅️</span> Back
//             </button>
//             <h2 className="text-2xl font-bold text-center text-blue-600">
//               {isEditing ? "Edit Goal" : "What's Your Goal"}
//             </h2>
//             <div>
//               <label className="block text-lg font-semibold text-gray-700 mb-1">
//                 Enter Your Goal
//               </label>
//               <input
//                 type="text"
//                 value={goal}
//                 onChange={(e) => setGoal(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none"
//                 placeholder="E.g., Learn React"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-lg font-semibold text-gray-700 mb-1">
//                 Goal Date
//               </label>
//               <input
//                 type="date"
//                 value={goalDate}
//                 onChange={(e) => setGoalDate(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none"
//                 required
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition ease-in-out duration-300"
//             >
//               {isEditing ? "Update Goal" : "Save Goal"}
//             </button>
//           </form>
//         ) : (
//           <div className="p-6 sm:p-8 bg-white text-gray-900 rounded-lg shadow-lg">
//             <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
//               Your Goals
//             </h2>
//             {goalsList.length === 0 ? (
//               <p className="text-center text-gray-500">
//                 No goals yet. Click "Add New Goal" to get started.
//               </p>
//             ) : (
//               <div className="space-y-4 max-h-80 overflow-y-auto">
//                 {goalsList.map((goalItem) => (
//                   <div
//                     key={goalItem._id}
//                     className="flex justify-between items-center p-4 bg-white rounded-lg shadow border"
//                   >
//                     <div>
//                       <h3 className="font-semibold text-gray-800">
//                         {goalItem.goal}
//                       </h3>
//                       <p className="text-gray-500">
//                         {new Date(goalItem.goalDate).toLocaleDateString(
//                           "en-GB"
//                         )}
//                       </p>
//                     </div>
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => handleEdit(goalItem._id)}
//                         className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
//                       >
//                         Edit
//                       </button>

//                       <button
//                         onClick={() => deleteGoal(goalItem._id)}
//                         className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
//                       >
//                         Delete
//                       </button>

//                       <button
//                         onClick={() => handleSchedule(goalItem)}
//                         className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
//                       >
//                         Schedule
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//             <button
//               onClick={() => {
//                 setIsAddingGoal(true);
//                 toast.info("Add a new goal!");
//               }}
//               className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition ease-in-out duration-300"
//             >
//               Add More Target
//             </button>
//           </div>
//         )}

//         {/* Schedule Modal */}
//         {showScheduleOptions && (
//           <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-80">
//               <div className=" top-4 left-4">
//                 <button
//                   onClick={handleBack}
//                   className="bg-gray-700 text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 transition ease-in-out duration-300 flex items-center"
//                 >
//                   <span className="mr-2">⬅️</span> Back
//                 </button>
//               </div>
//               <h2 className="text-xl font-bold mt-4 text-gray-800 mb-4">
//                 Choose a Schedule Type
//               </h2>

//               <div className="space-y-4">
//                 <button
//                   onClick={() => navigateToSchedule("day")}
//                   className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition ease-in-out duration-300"
//                 >
//                   Day Schedule
//                 </button>
//                 <button
//                   onClick={() => navigateToSchedule("hour")}
//                   className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition ease-in-out duration-300"
//                 >
//                   Hour Schedule
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//         <ToastContainer position="top-center" autoClose={3000} />
//       </div>
//     </div>
//   );
// };
// export default GoalPage;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import { jwtDecode } from "jwt-decode";
// import "react-toastify/dist/ReactToastify.css";

// const GoalPage = () => {
//   const [goal, setGoal] = useState("");
//   const [goalDate, setGoalDate] = useState("");
//   const [goalsList, setGoalsList] = useState([]);
//   const [isAddingGoal, setIsAddingGoal] = useState(false);
//   const [showScheduleOptions, setShowScheduleOptions] = useState(false);
//   const [selectedGoalItem, setSelectedGoalItem] = useState(null);
//   const [isEditing, setIsEditing] = useState(null);
//   const [error, setError] = useState("");
//   const [user, setUser] = useState(null);
//   const [lastAction, setLastAction] = useState(null); // Track the last action

//   const navigate = useNavigate();

//   const handleSaveGoal = (e) => {
//     e.preventDefault();

//     if (!goal || !goalDate) {
//       setError("Please enter both goal and goal date.");
//       return;
//     }

//     const selectedDate = new Date(goalDate);
//     const currentDate = new Date();

//     // Set currentDate time to 00:00:00 to avoid time comparison issues
//     currentDate.setHours(0, 0, 0, 0);

//     if (selectedDate <= currentDate) {
//       setError("Goal date must be after today.");
//       return;
//     }

//     // Clear any previous error
//     setError("");

//     // ✅ Submit the goal to backend here
//     console.log("Goal:", goal);
//     console.log("Goal Date:", goalDate);

//     // Reset form (optional)
//     setGoal("");
//     setGoalDate("");
//   };

//   // Fetch goals from backend
//   const fetchGoals = async () => {
//     const token = localStorage.getItem("jwt");

//     if (!token) {
//       toast.error("Please login to fetch your goals.");
//       return;
//     }

//     try {
//       // Decode token to fetch user details
//       const decodedUser = jwtDecode(token); // Adjust the import based on your library version
//       setUser(decodedUser);

//       // Fetch the goals from the backend
//       const response = await axios.get("http://localhost:4001/api/goal/fetch", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         withCredentials: true,
//       });

//       // Update the goals list if response contains goals
//       if (response.data?.goal) {
//         setGoalsList(response.data.goal);
//       }
//     } catch (err) {
//       console.error(
//         "Error fetching goals:",
//         err?.response?.data || err.message
//       );
//       toast.error("Failed to fetch goals. Please try again.");
//     }
//   };

//   useEffect(() => {
//     fetchGoals();
//   }, []);

//   // Save or update goal
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const token = localStorage.getItem("jwt");

//     if (!goal || !goalDate) {
//       toast.error("Both goal and goal date are required.");
//       return;
//     }

//     // Validate if the goal year is within 10 years
//     const currentYear = new Date().getFullYear();
//     const enteredYear = new Date(goalDate).getFullYear();

//     if (enteredYear > currentYear + 10) {
//       toast.error("Goal year must be within 10 years from now.");
//       return;
//     }

//     try {
//       const headers = {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       };

//       if (isEditing) {
//         // Update an existing goal
//         await axios.put(
//           `http://localhost:4001/api/goal/update/${isEditing}`,
//           { goal, goalDate },
//           { headers }
//         );
//         toast.success("Goal updated successfully!");
//       } else {
//         // Add a new goal
//         await axios.post(
//           "http://localhost:4001/api/goal/target",
//           { goal, goalDate },
//           { headers }
//         );
//         toast.success("Goal added successfully!");
//       }

//       // Refresh goal list
//       fetchGoals();
//       // Reset form fields
//       setGoal("");
//       setGoalDate("");
//       setIsAddingGoal(false);
//       setIsEditing(null);
//     } catch (error) {
//       console.error(
//         "Error saving goal:",
//         error?.response?.data || error.message
//       );
//       toast.error("Failed to save goal. Please try again.");
//     }
//   };

//   // Delete goal
//   const deleteGoal = async (id) => {
//     try {
//       await axios.delete(`http://localhost:4001/api/goal/delete/${id}`);
//       setGoalsList((prevGoals) =>
//         prevGoals.filter((goalItem) => goalItem._id !== id)
//       );
//       toast.success("Goal deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting goal:", error);
//       toast.error("Failed to delete goal. Please try again.");
//     }
//   };

//   // Edit goal
//   const handleEdit = (id) => {
//     const goalToEdit = goalsList.find((g) => g._id === id);
//     if (!goalToEdit) return;

//     setGoal(goalToEdit.goal);
//     setGoalDate(goalToEdit.goalDate.slice(0, 10));
//     setIsEditing(id);
//     setIsAddingGoal(true);
//   };

//   // Schedule handling
//   const handleSchedule = (goalItem) => {
//     setSelectedGoalItem(goalItem);
//     setShowScheduleOptions(true);
//   };

//   const navigateToSchedule = (scheduleType) => {
//     if (!selectedGoalItem) return;

//     navigate(`/goalschedule/${selectedGoalItem._id}/${scheduleType}`, {
//       state: {
//         id: selectedGoalItem._id,
//         goal: selectedGoalItem.goal,
//         goalDate: selectedGoalItem.goalDate,
//       },
//     });

//     setShowScheduleOptions(false);
//   };

//   const handleBack = () => {
//     setIsAddingGoal(false); // Close the Add/Edit Goal form
//     setShowScheduleOptions(false); // Close the schedule modal if open
//     setIsEditing(null); // Reset editing state
//   };

//   return (
//     <div className="bg-gradient-to-b from-gray-800 to-gray-900 text-white flex items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 lg:p-10 relative">
//       {/* Main Container */}
//       <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
//         {/* Error Display */}
//         {error && (
//           <div className="bg-red-500 text-white p-3 rounded-lg mb-6 text-center">
//             {error}
//           </div>
//         )}

//         {/* Add/Edit Goal Form */}
//         {isAddingGoal ? (
//           <form
//             onSubmit={handleSubmit}
//             className="p-6 sm:p-8 bg-white text-gray-900 rounded-lg shadow-lg space-y-6"
//           >
//             {" "}
//             <button
//               onClick={handleBack}
//               className="bg-gray-700 text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 transition ease-in-out duration-300 flex items-center"
//             >
//               <span className="mr-2">⬅️</span> Back
//             </button>
//             <h2 className="text-2xl font-bold text-center text-blue-600">
//               {isEditing ? "Edit Goal" : "What's Your Goal"}
//             </h2>
//             <div>
//               <label className="block text-lg font-semibold text-gray-700 mb-1">
//                 Enter Your Goal
//               </label>
//               <input
//                 type="text"
//                 value={goal}
//                 onChange={(e) => setGoal(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none"
//                 placeholder="E.g., Learn React"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-lg font-semibold text-gray-700 mb-1">
//                 Goal Date
//               </label>
//               {/* <input
//                 type="date"
//                 value={goalDate}
//                 onChange={(e) => setGoalDate(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none"
//                 required
//               /> */}
//               <input
//                 type="date"
//                 value={goalDate}
//                 onChange={(e) => setGoalDate(e.target.value)}
//                 className="w-full p-3 border rounded-lg mb-4"
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition ease-in-out duration-300"
//             >
//               {isEditing ? "Update Goal" : "Save Goal"}
//             </button>
//           </form>
//         ) : (
//           <div className="p-6 sm:p-8 bg-white text-gray-900 rounded-lg shadow-lg">
//             <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
//               Your Goals
//             </h2>
//             {goalsList.length === 0 ? (
//               <p className="text-center text-gray-500">
//                 No goals yet. Click "Add New Goal" to get started.
//               </p>
//             ) : (
//               <div className="space-y-4 max-h-80 overflow-y-auto">
//                 {goalsList.map((goalItem) => (
//                   <div
//                     key={goalItem._id}
//                     className="flex justify-between items-center p-4 bg-white rounded-lg shadow border"
//                   >
//                     <div>
//                       <h3 className="font-semibold text-gray-800">
//                         {goalItem.goal}
//                       </h3>
//                       <p className="text-gray-500">
//                         {new Date(goalItem.goalDate).toLocaleDateString(
//                           "en-GB"
//                         )}
//                       </p>
//                     </div>
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => handleEdit(goalItem._id)}
//                         className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
//                       >
//                         Edit
//                       </button>

//                       <button
//                         onClick={() => deleteGoal(goalItem._id)}
//                         className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
//                       >
//                         Delete
//                       </button>

//                       <button
//                         onClick={() => handleSchedule(goalItem)}
//                         className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
//                       >
//                         Schedule
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//             <button
//               onClick={() => {
//                 setIsAddingGoal(true);
//                 toast.info("Add a new goal!");
//               }}
//               className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition ease-in-out duration-300"
//             >
//               Add More Target
//             </button>
//           </div>
//         )}

//         {/* Schedule Modal */}
//         {showScheduleOptions && (
//           <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-80">
//               <div className=" top-4 left-4">
//                 <button
//                   onClick={handleBack}
//                   className="bg-gray-700 text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 transition ease-in-out duration-300 flex items-center"
//                 >
//                   <span className="mr-2">⬅️</span> Back
//                 </button>
//               </div>
//               <h2 className="text-xl font-bold mt-4 text-gray-800 mb-4">
//                 Choose a Schedule Type
//               </h2>

//               <div className="space-y-4">
//                 <button
//                   onClick={() => navigateToSchedule("day")}
//                   className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition ease-in-out duration-300"
//                 >
//                   Day Schedule
//                 </button>
//                 <button
//                   onClick={() => navigateToSchedule("hour")}
//                   className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition ease-in-out duration-300"
//                 >
//                   Hour Schedule
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//         <ToastContainer position="top-center" autoClose={3000} />
//       </div>
//     </div>
//   );
// };
// export default GoalPage;



import React, { useEffect, useState } from "react";
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

      const response = await axios.get("http://localhost:4001/api/goal/fetch", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.data?.goal) {
        setGoalsList(response.data.goal);
      }
    } catch (err) {
      console.error("Error fetching goals:", err?.response?.data || err.message);
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
          `http://localhost:4001/api/goal/update/${isEditing}`,
          { goal, goalDate },
          { headers }
        );
        toast.success("Goal updated successfully!");
      } else {
        await axios.post(
          "http://localhost:4001/api/goal/target",
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
      await axios.delete(`http://localhost:4001/api/goal/delete/${id}`);
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
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 text-white flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-xl">
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {isAddingGoal ? (
          <form onSubmit={handleSubmit} className="p-6 bg-white text-gray-900 rounded-lg shadow-lg space-y-6">
            <button
              onClick={handleBack}
              type="button"
              className="bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition"
            >
              ⬅ Back
            </button>
            <h2 className="text-2xl font-bold text-center text-blue-600">
              {isEditing ? "Edit Goal" : "Add New Goal"}
            </h2>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-1">
                Goal
              </label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full p-3 border rounded-lg"
                placeholder="E.g., Learn React"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-1">
                Goal Date
              </label>
              <input
                type="date"
                value={goalDate}
                onChange={(e) => setGoalDate(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              {isEditing ? "Update Goal" : "Save Goal"}
            </button>
          </form>
        ) : (
          <div className="p-6 bg-white text-gray-900 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
              Your Goals
            </h2>
            {goalsList.length === 0 ? (
              <p className="text-center text-gray-500">
                No goals yet. Click "Add New Goal" to get started.
              </p>
            ) : (
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {goalsList.map((goalItem) => (
                  <div
                    key={goalItem._id}
                    className="flex justify-between items-center p-4 bg-white rounded-lg shadow border"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {goalItem.goal}
                      </h3>
                      <p className="text-gray-500">
                        {new Date(goalItem.goalDate).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(goalItem._id)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteGoal(goalItem._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleSchedule(goalItem)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
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
              className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Add New Goal
            </button>
          </div>
        )}

        {/* Schedule Modal */}
        {showScheduleOptions && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <button
                onClick={handleBack}
                className="bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-600"
              >
                ⬅ Back
              </button>
              <h2 className="text-xl font-bold mt-4 text-gray-800 mb-4">
                Choose a Schedule Type
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => navigateToSchedule("day")}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                >
                  Day Schedule
                </button>
                <button
                  onClick={() => navigateToSchedule("hour")}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
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
