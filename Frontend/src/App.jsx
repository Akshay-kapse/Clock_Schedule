import Navbar from "../src/components/Navbar.jsx";
import Home from "../src/components/Home.jsx";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import PageTransition from "./components/PageTransition.jsx";

import Schedule from "../src/pages/Schedule.jsx";
import Goals from "../src/pages/Goals.jsx";
import About from "../src/pages/About.jsx";
import Contact from "../src/pages/Contact.jsx";
import Login from "../src/pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { Toaster } from "react-hot-toast";
import PageNotFound from "./pages/PageNotFound.jsx";
import Dayschedule from "./pages/Dayschedule.jsx";
import Hourschedule from "./pages/Hourschedule.jsx";
import ForgotPassword from "./pages/Forgetpassword.jsx";
import VerifyCode from "./pages/VerifyCode.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import { AnimatePresence } from "framer-motion";
// import { Analytics } from "@vercel/analytics/react";

function App() {
  // Hide navbar for specific routes
  const location = useLocation();
  const hideNavBar =
    [
      "/register",
      "/login",
      "/goalschedule",
      "/forget-password",
      "/verify-code",
      "/reset-password",
    ].includes(location.pathname) ||
    location.pathname.match(/^\/goalschedule\/[^/]+\/(day|hour)$/);

  return (
    <ThemeProvider>
      <div>
        {!hideNavBar && <Navbar />}

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/forget-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
            <Route path="/verify-code" element={<PageTransition><VerifyCode /></PageTransition>} />
            <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
            <Route path="/home" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/schedule" element={<PageTransition><Schedule /></PageTransition>} />
            <Route path="/goals" element={<PageTransition><Goals /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            <Route path="/goalschedule/:goalId/day" element={<PageTransition><Dayschedule /></PageTransition>} />
            <Route path="/goalschedule/:goalId/hour" element={<PageTransition><Hourschedule /></PageTransition>} />
            <Route path="*" element={<PageTransition><PageNotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>

        <Toaster />
        {/* <Analytics /> */}
      </div>
    </ThemeProvider>
  );
}

export default App;
