import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Clock() {
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);

  useEffect(() => {
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

  return (

<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
      <button
        onClick={toggleFormat}
        className="px-6 py-2 mb-6 bg-blue-500 rounded hover:bg-blue-600 transition duration-300"
      >
        Toggle to {is24Hour ? "12-hour" : "24-hour"} format
      </button>

      {/* Clock Circles */}
      <div className="flex flex-wrap justify-center gap-6">
        <Circle value={hours} max={is24Hour ? 24 : 12} label="Hours" color="#ff2972" />
        <Circle value={minutes} max={60} label="Minutes" color="#fee800" />
        <Circle value={seconds} max={60} label="Seconds" color="#04fc43" />
      </div>

      {/* Date */}
      <p className="mt-6 text-lg font-mono tracking-wide text-center">
        {time.toLocaleDateString("en-GB", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </p>

      {!is24Hour && <p className="mt-1 text-xl font-semibold tracking-widest">{ampm}</p>}
    </div>
  );
}

function Circle({ value, max, label, color }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - value / max);

  return (
    
    <div className="flex flex-col items-center">
      <svg width="120" height="120" viewBox="0 0 100 100" className="mb-1">
        {/* Background Circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#333"
          strokeWidth="6"
        />

        {/* Progress Circle */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
          }}
        />

        {/* Value */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="18"
          fontWeight="bold"
          className="font-mono"
        >
          {value.toString().padStart(2, "0")}
        </text>
      </svg>
      <p className="text-xs tracking-wider uppercase text-gray-300">{label}</p>
    </div>
    
  );
}
