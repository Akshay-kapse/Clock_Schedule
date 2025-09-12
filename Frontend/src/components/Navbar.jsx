import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext.jsx";
import {
  Bars3Icon,
  XMarkIcon,
  ClockIcon,
  HomeIcon,
  CalendarDaysIcon,
  InformationCircleIcon,
  PhoneIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { TbTarget } from "react-icons/tb";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { themeClasses } = useTheme();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    setIsAuthenticated(!!token);

    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem("jwt");
      setIsAuthenticated(!!updatedToken);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setIsAuthenticated(false);
    setShow(false);
    navigate("/register");
  };

  const navLinks = [
    { to: "/home", label: "Home", icon: HomeIcon },
    { to: "/schedule", label: "Schedule", icon: CalendarDaysIcon },
    { to: "/goals", label: "Goals", icon: TbTarget  },
    { to: "/about", label: "About", icon: InformationCircleIcon },
    { to: "/contact", label: "Contact", icon: PhoneIcon },
  ];

  return (
    <motion.nav
      className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? themeClasses.navbarScrolled
          : themeClasses.navbar
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <ClockIcon className="w-6 h-6 text-white" />
            </div>
            <Link to="/home" className="text-xl lg:text-2xl font-bold">
              <span className={themeClasses.text}>Clock</span>
              <span className="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                Schedule
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={link.to}
                  className={`relative flex items-center gap-2 px-4 py-2 ${themeClasses.textSecondary} hover:${themeClasses.accent} font-medium transition-colors duration-300 rounded-lg ${themeClasses.cardHover} group`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-300 to-blue-300 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Auth Button */}
          <div className="hidden lg:flex">
            {isAuthenticated ? (
              <motion.button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                Logout
              </motion.button>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className={`flex items-center gap-2 px-6 py-2.5 ${themeClasses.button} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <UserPlusIcon className="w-4 h-4" />
                  Login
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-2 text-gray-800 hover:text-blue-600 transition-colors duration-300 rounded-lg hover:bg-blue-50"
            onClick={() => setShow(!show)}
            whileTap={{ scale: 0.95 }}
          >
            {show ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {show && (
          <motion.div
            className={`lg:hidden ${themeClasses.navbar} border-t ${themeClasses.border} shadow-lg`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setShow(false)}
                      className={`flex items-center gap-3 px-4 py-3 ${themeClasses.text} hover:${themeClasses.accent} font-medium transition-colors duration-300 rounded-lg ${themeClasses.cardHover}`}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div
                  className={`pt-4 border-t ${themeClasses.border}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      Logout
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setShow(false)}
                      className={`flex items-center gap-3 w-full px-6 py-3 ${themeClasses.button} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center justify-center`}
                    >
                      <UserPlusIcon className="w-5 h-5" />
                      Login
                    </Link>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;