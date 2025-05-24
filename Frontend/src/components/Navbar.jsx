import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [show, setShow] = useState(false); // For mobile menu toggle
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Tracks authentication status
  const navigate = useNavigate();

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem("jwt"); // Check for token in localStorage
    setIsAuthenticated(!!token); // Update authentication state
    console.log("Initial token:", token);

    // Event listener for localStorage changes
    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem("jwt");
      setIsAuthenticated(!!updatedToken);
      console.log("Token updated via storage event:", updatedToken);
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("jwt"); // Remove token from localStorage
    setIsAuthenticated(false); // Update authentication state
    console.log("User logged out. Token removed.");
    navigate("/register");
  };

  return (
    <nav className="bg-white py-4 shadow-lg fixed w-full top-0 left-0 z-50">
      <div className="flex items-center justify-between container mx-auto px-6">
        {/* Logo */}
        <div className="font-bold text-2xl text-gray-800">
          Clock
          <span className="text-blue-500">Schedule</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8">
          <Link
            to="/home"
            className="text-gray-700 hover:text-blue-500 font-medium transition duration-300"
          >
            Home
          </Link>
          <Link
            to="/schedule"
            className="text-gray-700 hover:text-blue-500 font-medium transition duration-300"
          >
            Schedule
          </Link>
          <Link
            to="/goals"
            className="text-gray-700 hover:text-blue-500 font-medium transition duration-300"
          >
            Goals
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-blue-500 font-medium transition duration-300"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 hover:text-blue-500 font-medium transition duration-300"
          >
            Contact
          </Link>
        </div>

        {/* Desktop Authentication Button (Login or Logout) */}
        <div className="hidden md:flex">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-red-600 transition duration-300"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div
          className="md:hidden text-gray-800 cursor-pointer"
          onClick={() => setShow(!show)}
        >
          {show ? <IoCloseSharp size={30} /> : <AiOutlineMenu size={30} />}
        </div>
      </div>

      {/* Mobile Navbar */}
      {show && (
        <div className="bg-gray-100 md:hidden">
          <ul className="flex flex-col items-center space-y-6 py-6">
            <li>
              <Link
                to="/home"
                onClick={() => setShow(false)}
                className="text-gray-800 text-xl font-medium hover:text-blue-500 transition duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/schedule"
                onClick={() => setShow(false)}
                className="text-gray-800 text-xl font-medium hover:text-blue-500 transition duration-300"
              >
                Schedule
              </Link>
            </li>
            <li>
              <Link
                to="/goals"
                onClick={() => setShow(false)}
                className="text-gray-800 text-xl font-medium hover:text-blue-500 transition duration-300"
              >
                Goals
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                onClick={() => setShow(false)}
                className="text-gray-800 text-xl font-medium hover:text-blue-500 transition duration-300"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                onClick={() => setShow(false)}
                className="text-gray-800 text-xl font-medium hover:text-blue-500 transition duration-300"
              >
                Contact
              </Link>
            </li>
            <li>
              {isAuthenticated ? (
                <Link
                to="/register"
                  onClick={() => {
                    setShow(false); // Close menu after logout
                    handleLogout();
                  }}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition duration-300"
                >
                  Logout
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setShow(false)}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition duration-300"
                >
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
