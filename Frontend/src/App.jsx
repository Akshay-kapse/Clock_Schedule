import React from "react";
import Navbar from "../src/components/Navbar.jsx";
import Home from "../src/components/Home.jsx";
import { Route, Routes, useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom"; 
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
import ForgotPassword from "./pages/forgetpassword.jsx";
import VerifyCode from "./pages/verifycode.jsx";
import ResetPassword from "./pages/resetpassword.jsx";
import { Analytics } from "@vercel/analytics/react"; 


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
      "*",
    ].includes(location.pathname) ||
    location.pathname.match(/^\/goalschedule\/[^/]+\/(day|hour)$/);

  return (
    <div>
      {!hideNavBar && <Navbar />}

      {/* defining routes */}
      <Routes>

         <Route exact path="/login" element={<Login />} />
         <Route path="/" element={<Navigate to="/home" />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/forget-password" element={<ForgotPassword />} />
        <Route exact path="/verify-code" element={<VerifyCode />} />
        <Route exact path="/reset-password" element={<ResetPassword />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/schedule" element={<Schedule />} />
        <Route exact path="/goals" element={<Goals />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/goalschedule/:goalId/day" element={<Dayschedule />} />
        <Route path="/goalschedule/:goalId/hour" element={<Hourschedule />} />

      </Routes>

      <Toaster />
      <Analytics /> 
    </div>
  );
}

export default App;
