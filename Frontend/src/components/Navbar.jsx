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

// export default Navbar;
// import { Bars3Icon, XMarkIcon, ClockIcon } from "@heroicons/react/24/outline";
// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// const Navbar = () => {
//   const [show, setShow] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const navigate = useNavigate();

//   // Handle scroll effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Check authentication status
//   useEffect(() => {
//     const token = localStorage.getItem("jwt");
//     setIsAuthenticated(!!token);

//     const handleStorageChange = () => {
//       const updatedToken = localStorage.getItem("jwt");
//       setIsAuthenticated(!!updatedToken);
//     };

//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("jwt");
//     setIsAuthenticated(false);
//     setShow(false);
//     navigate("/register");
//   };

//   const navLinks = [
//     { to: "/home", label: "Home" },
//     { to: "/schedule", label: "Schedule" },
//     { to: "/goals", label: "Goals" },
//     { to: "/about", label: "About" },
//     { to: "/contact", label: "Contact" },
//   ];

//   return (
//     <motion.nav
//       className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
//         scrolled
//           ? "bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/20"
//           : "bg-white/95 backdrop-blur-sm shadow-md"
//       }`}
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.6 }}
//     >
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16 lg:h-20">
//           {/* Logo */}
//           <motion.div
//             className="flex items-center gap-3"
//             whileHover={{ scale: 1.05 }}
//             transition={{ type: "spring", stiffness: 400, damping: 10 }}
//           >
//             <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
//               <ClockIcon className="w-6 h-6 text-white" />
//             </div>
//             <Link to="/home" className="text-xl lg:text-2xl font-bold">
//               <span className="text-gray-800">Clock</span>
//               <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
//                 Schedule
//               </span>
//             </Link>
//           </motion.div>

//           {/* Desktop Navigation */}
//           <div className="hidden lg:flex items-center space-x-1">
//             {navLinks.map((link, index) => (
//               <motion.div
//                 key={link.to}
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//               >
//                 <Link
//                   to={link.to}
//                   className="relative px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 rounded-lg hover:bg-blue-50 group"
//                 >
//                   {link.label}
//                   <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
//                 </Link>
//               </motion.div>
//             ))}
//           </div>

//           {/* Desktop Auth Button */}
//           <div className="hidden lg:flex">
//             {isAuthenticated ? (
//               <motion.button
//                 onClick={handleLogout}
//                 className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 Logout
//               </motion.button>
//             ) : (
//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <Link
//                   to="/login"
//                   className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
//                 >
//                   Login
//                 </Link>
//               </motion.div>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <motion.button
//             className="lg:hidden p-2 text-gray-800 hover:text-blue-600 transition-colors duration-300"
//             onClick={() => setShow(!show)}
//             whileTap={{ scale: 0.95 }}
//           >
//             {show ? (
//               <XMarkIcon className="w-6 h-6" />
//             ) : (
//               <Bars3Icon className="w-6 h-6" />
//             )}
//           </motion.button>
//         </div>
//       </div>

//       {/* Mobile Navigation */}
//       <AnimatePresence>
//         {show && (
//           <motion.div
//             className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/20"
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <div className="container mx-auto px-4 py-6">
//               <div className="flex flex-col space-y-4">
//                 {navLinks.map((link, index) => (
//                   <motion.div
//                     key={link.to}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                   >
//                     <Link
//                       to={link.to}
//                       onClick={() => setShow(false)}
//                       className="block px-4 py-3 text-gray-800 hover:text-blue-600 font-medium transition-colors duration-300 rounded-lg hover:bg-blue-50"
//                     >
//                       {link.label}
//                     </Link>
//                   </motion.div>
//                 ))}
                
//                 <motion.div
//                   className="pt-4 border-t border-gray-200"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.5 }}
//                 >
//                   {isAuthenticated ? (
//                     <button
//                       onClick={handleLogout}
//                       className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
//                     >
//                       Logout
//                     </button>
//                   ) : (
//                     <Link
//                       to="/login"
//                       onClick={() => setShow(false)}
//                       className="block w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center"
//                     >
//                       Login
//                     </Link>
//                   )}
//                 </motion.div>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.nav>
//   );
// };

// export default Navbar;
