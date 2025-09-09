import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ClockIcon, CalendarIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export default function Clock() {
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFormat = () => setIs24Hour((prev) => !prev);

  const hours = is24Hour ? time.getHours() : time.getHours() % 12 || 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ampm = time.getHours() >= 12 ? "PM" : "AM";

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with logo and toggle */}
        <motion.div 
          className="w-full max-w-6xl mx-auto mb-8 sm:mb-12"
          variants={itemVariants}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <ClockIcon className="w-8 h-8 text-purple-300" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                ClockSchedule
              </h1>
            </div>
            
            <motion.button
              onClick={toggleFormat}
              className="group relative px-6 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2">
                {is24Hour ? (
                  <SunIcon className="w-5 h-5 text-yellow-300" />
                ) : (
                  <MoonIcon className="w-5 h-5 text-blue-300" />
                )}
                <span className="text-sm sm:text-base font-medium">
                  {is24Hour ? "12-hour" : "24-hour"} format
                </span>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Clock Circles */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12"
          variants={itemVariants}
        >
          <Circle 
            value={hours} 
            max={is24Hour ? 24 : 12} 
            label="Hours" 
            color="from-pink-500 to-rose-500"
            delay={0}
          />
          <Circle 
            value={minutes} 
            max={60} 
            label="Minutes" 
            color="from-yellow-400 to-orange-500"
            delay={0.1}
          />
          <Circle 
            value={seconds} 
            max={60} 
            label="Seconds" 
            color="from-green-400 to-emerald-500"
            delay={0.2}
          />
        </motion.div>

        {/* Date and Time Display */}
        <motion.div 
          className="text-center space-y-4"
          variants={itemVariants}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <CalendarIcon className="w-6 h-6 text-purple-300" />
            <p className="text-lg sm:text-xl lg:text-2xl font-light tracking-wide">
              {time.toLocaleDateString("en-GB", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {!is24Hour && (
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="text-xl sm:text-2xl font-bold tracking-widest text-purple-300">
                {ampm}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="mt-8 sm:mt-12 flex flex-wrap justify-center gap-4"
          variants={itemVariants}
        >
          <QuickActionButton 
            href="/schedule" 
            icon={<ClockIcon className="w-5 h-5" />}
            text="Schedule"
            color="from-blue-500 to-cyan-500"
          />
          <QuickActionButton 
            href="/goals" 
            icon={<CalendarIcon className="w-5 h-5" />}
            text="Goals"
            color="from-purple-500 to-pink-500"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

function Circle({ value, max, label, color, delay }) {
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
        {/* Glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${color} rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
        
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

function QuickActionButton({ href, icon, text, color }) {
  return (
    <motion.a
      href={href}
      className={`group relative px-6 py-3 bg-gradient-to-r ${color} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}
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