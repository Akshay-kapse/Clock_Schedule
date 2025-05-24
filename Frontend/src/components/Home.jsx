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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <button
        onClick={toggleFormat}
        className="px-6 py-3 mb-6 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
        aria-label="Toggle time format"
      >
        Toggle {is24Hour ? "12-hour" : "24-hour"} format
      </button>

      <div className="flex space-x-8">
        <Circle value={hours} max={is24Hour ? 24 : 12} label="HOURS" color="#ff2972" />
        <Circle value={minutes} max={60} label="MINUTES" color="#fee800" />
        <Circle value={seconds} max={60} label="SECONDS" color="#04fc43" />
      </div>

      <p className="mt-4 text-lg font-semibold font-mono">
        {time.toLocaleDateString("en-GB", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </p>

      {!is24Hour && <p className="text-xl font-bold mt-2">{ampm}</p>}
    </div>
  );
}

function Circle({ value, max, label, color }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - value / max);

  return (
    <div className="relative flex flex-col items-center">
      <svg width="150" height="150" viewBox="0 0 100 100">
        {/* Background Circle */}
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#222" strokeWidth="6" />

        {/* Progress Circle - Now Starts from the Top (Fixed) */}
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
            transform: "rotate(-90deg)", // Corrected: Starts from top
            transformOrigin: "50% 50%",
          }}
        />

        {/* Time Value */}
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
          {value}
        </text>
      </svg>
      <p className="text-sm font-light mt-2 uppercase tracking-wide">{label}</p>
    </div>
  );
}
