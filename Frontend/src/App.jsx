import Navbar from "../src/components/Navbar.jsx";
import Home from "../src/components/Home.jsx";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";

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
    <div>
      {!hideNavBar && <Navbar />}

      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/goalschedule/:goalId/day" element={<Dayschedule />} />
        <Route path="/goalschedule/:goalId/hour" element={<Hourschedule />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      <Toaster />
      {/* <Analytics /> */}
    </div>
  );
}

export default App;
