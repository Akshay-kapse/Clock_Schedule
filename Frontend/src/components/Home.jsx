import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  SunIcon,
  MoonIcon,
  SwatchIcon,
  CalendarDaysIcon,
  ClockIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { TbTarget } from "react-icons/tb";

export default function Home() {
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 100); // 100ms for smooth motion
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleFormat = () => setIs24Hour((prev) => !prev);

  const hours = is24Hour ? time.getHours() : time.getHours() % 12 || 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ampm = time.getHours() >= 12 ? "PM" : "AM";

  const themes = [
    {
      id: "light",
      name: "Light",
      icon: SunIcon,
      background: "bg-gradient-to-br from-blue-100 via-white to-blue-50",
    },
    {
      id: "dark",
      name: "Dark",
      icon: MoonIcon,
      background:
        "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900",
    },
    {
      id: "purple",
      name: "Purple",
      icon: SwatchIcon,
      background:
        "bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900",
    },
  ];

  const quickActions = [
    {
      href: "/schedule",
      icon: CalendarDaysIcon,
      text: "Schedule",
      color: "from-blue-500 to-cyan-500",
    },
    {
      href: "/goals",
      icon: TbTarget,
      text: "Goals",
      color: "from-purple-500 to-pink-500",
    },
    {
      href: "/about",
      icon: ChartBarIcon,
      text: "Analytics",
      color: "from-green-500 to-teal-500",
    },
  ];

  return (
    <div
      className={`relative min-h-screen pt-20 transition-colors duration-500 
    ${
      theme === "light"
        ? "bg-gradient-to-br from-blue-100 via-white to-blue-50"
        : ""
    }
    ${
      theme === "dark"
        ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
        : ""
    }
    ${
      theme === "purple"
        ? "bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900"
        : ""
    }
  `}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              className="flex items-center justify-center gap-3 mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <ClockIcon className="w-8 h-8 text-purple-300" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                Clock Schedule
              </h1>
            </motion.div>
            <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto">
              Master your time with beautiful, interactive clocks and smart
              scheduling
            </p>
          </div>

          {/* Theme Switcher */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="glass rounded-2xl p-2">
              <div className="flex gap-2">
                {themes.map((themeOption) => (
                  <motion.button
                    key={themeOption.id}
                    onClick={() => setTheme(themeOption.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      theme === themeOption.id
                        ? `bg-gradient-to-r ${themeOption.gradient} text-white shadow-lg`
                        : "text-gray-300 hover:bg-white/10"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <themeOption.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {themeOption.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Clock Controls */}
          <motion.div
            className="flex justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={toggleFormat}
              className="glass px-6 py-3 rounded-2xl text-white font-medium hover:bg-white/20 transition-all duration-300"
            >
              Switch to {is24Hour ? "12-hour" : "24-hour"} format
            </button>
          </motion.div>

          {/* Main Clock Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Circular Clocks */}
            <motion.div
              className="glass-card rounded-3xl p-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white mb-8 text-center">
                Time Circles
              </h2>
              <div className="flex flex-wrap justify-center gap-8">
                <Circle
                  value={hours}
                  max={is24Hour ? 24 : 12}
                  label="Hours"
                  delay={0}
                />
                <Circle value={minutes} max={60} label="Minutes" delay={0.2} />
                <Circle value={seconds} max={60} label="Seconds" delay={0.4} />
              </div>
            </motion.div>

            {/* Digital Clock */}
            <motion.div
              className="glass-card rounded-3xl p-8 flex flex-col justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-white mb-8 text-center">
                Digital Time
              </h2>
              <div className="text-center">
                <div className="text-6xl sm:text-7xl font-mono font-bold text-white mb-4">
                  {hours.toString().padStart(2, "0")}:
                  {minutes.toString().padStart(2, "0")}:
                  {seconds.toString().padStart(2, "0")}
                </div>
                {!is24Hour && (
                  <div className="text-2xl font-bold text-purple-300 mb-4">
                    {ampm}
                  </div>
                )}
                <div className="text-lg text-gray-300">
                  {time.toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Analog Clock */}
          <motion.div
            className="glass-card rounded-3xl p-8 mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Analog Clock
            </h2>
            <div className="flex justify-center">
              <AnalogClock time={time} />
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-white mb-8">
              Quick Actions
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {quickActions.map((action, index) => (
                <QuickActionButton
                  key={action.href}
                  href={action.href}
                  icon={<action.icon className="w-5 h-5" />}
                  text={action.text}
                  color={action.color}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function Circle({ value, max, label, delay }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - value / max);

  return (
    <motion.div
      className="flex flex-col items-center group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
    >
      <div className="relative mb-4">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>

        <svg
          width="140"
          height="140"
          viewBox="0 0 100 100"
          className="relative transform group-hover:scale-105 transition-transform duration-300"
        >
          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="4"
          />

          {/* Progress Circle */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
            }}
          />

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>

          {/* Value Text */}
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="20"
            fontWeight="bold"
            className="font-mono"
          >
            {value.toString().padStart(2, "0")}
          </text>
        </svg>
      </div>

      <motion.p
        className="text-sm sm:text-base tracking-wider uppercase text-gray-300 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.3 }}
      >
        {label}
      </motion.p>
    </motion.div>
  );
}


function AnalogClock({ time }) {
  // calculate continuous positions
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ms = time.getMilliseconds();

  const secondsTotal = seconds + ms / 1000;            // e.g. 12.345s
  const secondAngle = secondsTotal * 6;                // 360/60 = 6° per sec

  const minutesTotal = minutes + secondsTotal / 60;    // e.g. 34.205min
  const minuteAngle = minutesTotal * 6;                // 6° per minute

  const hoursTotal = hours + minutesTotal / 60;        // e.g. 3.5708h
  const hourAngle = hoursTotal * 30;                   // 360/12 = 30° per hour

  return (
    <div className="relative w-64 h-64">
      <svg width="256" height="256" viewBox="0 0 256 256" className="absolute inset-0">
        {/* Face */}
        <circle cx="128" cy="128" r="120" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" strokeWidth="2"/>

        {/* Hour markers */}
        {[...Array(12)].map((_, i) => (
          <line
            key={i}
            x1="128"
            y1="28"
            x2="128"
            y2="42"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth={3}
            transform={`rotate(${i * 30} 128 128)`}
          />
        ))}

        {/* Minute markers */}
        {[...Array(60)].map((_, i) => (
          i % 5 !== 0 && (
            <line
              key={i}
              x1="128"
              y1="28"
              x2="128"
              y2="34"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth={1}
              transform={`rotate(${i * 6} 128 128)`}
            />
          )
        ))}

        {/* Hour hand - shorter, thicker */}
        <g transform={`rotate(${hourAngle} 128 128)`}>
          <line
            x1="128"
            y1="128"
            x2="128"
            y2="82"
            stroke="#8B5CF6"
            strokeWidth={6}
            strokeLinecap="round"
          />
        </g>

        {/* Minute hand - longer */}
        <g transform={`rotate(${minuteAngle} 128 128)`}>
          <line
            x1="128"
            y1="128"
            x2="128"
            y2="60"
            stroke="#06B6D4"
            strokeWidth={4}
            strokeLinecap="round"
          />
        </g>

        {/* Second hand - thin and long */}
        <g transform={`rotate(${secondAngle} 128 128)`}>
          <line
            x1="128"
            y1="128"
            x2="128"
            y2="48"
            stroke="#EC4899"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </g>

        {/* Center cap */}
        <circle cx="128" cy="128" r="6" fill="#8B5CF6" />
      </svg>
    </div>
  );
}


function QuickActionButton({ href, icon, text, color, delay }) {
  return (
    <motion.a
      href={href}
      className={`group relative px-6 py-3 bg-gradient-to-r ${color} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative flex items-center gap-2 text-white font-medium">
        {icon}
        <span>{text}</span>
      </div>
    </motion.a>
  );
}
