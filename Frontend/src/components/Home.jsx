import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  SunIcon, 
  MoonIcon, 
  SwatchIcon,
  CalendarDaysIcon,
  ClockIcon,
  TargetIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [clockStyle, setClockStyle] = useState('all'); // 'all', 'analog', 'digital'
  const [showClockSettings, setShowClockSettings] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleFormat = () => setIs24Hour((prev) => !prev);

  const hours = is24Hour ? time.getHours() : time.getHours() % 12 || 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ampm = time.getHours() >= 12 ? "PM" : "AM";

  const themes = [
    { id: 'light', name: 'Light', icon: SunIcon, gradient: 'from-blue-400 to-purple-500' },
    { id: 'dark', name: 'Dark', icon: MoonIcon, gradient: 'from-purple-500 to-pink-500' },
    { id: 'purple', name: 'Purple', icon: SwatchIcon, gradient: 'from-indigo-500 to-purple-600' }
  ];

  const clockStyles = [
    { id: 'all', name: 'All Clocks', description: 'Show all clock widgets' },
    { id: 'analog', name: 'Analog Only', description: 'Show only analog clock' },
    { id: 'digital', name: 'Digital Only', description: 'Show only digital clock' }
  ];

  const quickActions = [
    { href: "/schedule", icon: CalendarDaysIcon, text: "Schedule", color: "from-blue-500 to-cyan-500" },
    { href: "/goals", icon: TargetIcon, text: "Goals", color: "from-purple-500 to-pink-500" },
    { href: "/about", icon: ChartBarIcon, text: "Analytics", color: "from-green-500 to-teal-500" }
  ];

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return {
          bg: 'bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100',
          text: 'text-gray-900',
          card: 'bg-white/80 backdrop-blur-md border-gray-200/30',
          accent: 'text-blue-600'
        };
      case 'purple':
        return {
          bg: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900',
          text: 'text-purple-100',
          card: 'bg-purple-800/20 backdrop-blur-md border-purple-500/30',
          accent: 'text-purple-300'
        };
      default: // dark
        return {
          bg: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
          text: 'text-white',
          card: 'bg-white/10 backdrop-blur-md border-white/20',
          accent: 'text-purple-300'
        };
    }
  };

  const themeClasses = getThemeClasses();

  return (
    <div className={`min-h-screen ${themeClasses.bg} pt-20 transition-all duration-500`}>
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
              <div className={`p-3 ${themeClasses.card} rounded-2xl border shadow-lg`}>
                <ClockIcon className={`w-8 h-8 ${themeClasses.accent}`} />
              </div>
              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent`}>
                Clock Schedule
              </h1>
            </motion.div>
            <p className={`${themeClasses.text} text-lg sm:text-xl max-w-2xl mx-auto opacity-80`}>
              Master your time with beautiful, interactive clocks and smart scheduling
            </p>
          </div>

          {/* Theme & Clock Controls */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Theme Switcher */}
            <div className={`${themeClasses.card} rounded-2xl p-2 border shadow-lg`}>
              <div className="flex gap-2">
                {themes.map((themeOption) => (
                  <motion.button
                    key={themeOption.id}
                    onClick={() => setTheme(themeOption.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      theme === themeOption.id
                        ? `bg-gradient-to-r ${themeOption.gradient} text-white shadow-lg`
                        : `${themeClasses.text} hover:bg-white/10 opacity-70 hover:opacity-100`
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <themeOption.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{themeOption.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Clock Style Selector */}
            <div className="relative">
              <motion.button
                onClick={() => setShowClockSettings(!showClockSettings)}
                className={`flex items-center gap-2 px-4 py-2 ${themeClasses.card} border rounded-xl ${themeClasses.text} hover:bg-white/10 transition-all duration-300`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Cog6ToothIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Clock Style</span>
              </motion.button>

              <AnimatePresence>
                {showClockSettings && (
                  <motion.div
                    className={`absolute top-full mt-2 right-0 ${themeClasses.card} border rounded-2xl p-4 shadow-xl z-50 min-w-64`}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className={`${themeClasses.text} font-semibold mb-3`}>Choose Clock Display</h3>
                    <div className="space-y-2">
                      {clockStyles.map((style) => (
                        <motion.button
                          key={style.id}
                          onClick={() => {
                            setClockStyle(style.id);
                            setShowClockSettings(false);
                          }}
                          className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                            clockStyle === style.id
                              ? 'bg-purple-500/30 border border-purple-500/50'
                              : 'hover:bg-white/10'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className={`font-medium ${themeClasses.text}`}>{style.name}</div>
                          <div className={`text-sm ${themeClasses.text} opacity-70`}>{style.description}</div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Clock Format Toggle */}
          <motion.div
            className="flex justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={toggleFormat}
              className={`${themeClasses.card} border px-6 py-3 rounded-2xl ${themeClasses.text} font-medium hover:bg-white/10 transition-all duration-300 shadow-lg`}
            >
              Switch to {is24Hour ? "12-hour" : "24-hour"} format
            </button>
          </motion.div>

          {/* Clock Displays */}
          <AnimatePresence mode="wait">
            {(clockStyle === 'all' || clockStyle === 'digital') && (
              <motion.div
                key="clocks-grid"
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                {/* Circular Clocks */}
                {clockStyle === 'all' && (
                  <motion.div
                    className={`${themeClasses.card} border rounded-3xl p-8 shadow-xl`}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h2 className={`text-2xl font-bold ${themeClasses.text} mb-8 text-center`}>Time Circles</h2>
                    <div className="flex flex-wrap justify-center gap-8">
                      <Circle value={hours} max={is24Hour ? 24 : 12} label="Hours" delay={0} theme={theme} />
                      <Circle value={minutes} max={60} label="Minutes" delay={0.2} theme={theme} />
                      <Circle value={seconds} max={60} label="Seconds" delay={0.4} theme={theme} />
                    </div>
                  </motion.div>
                )}

                {/* Digital Clock */}
                <motion.div
                  className={`${themeClasses.card} border rounded-3xl p-8 flex flex-col justify-center shadow-xl ${clockStyle === 'digital' ? 'lg:col-span-2' : ''}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h2 className={`text-2xl font-bold ${themeClasses.text} mb-8 text-center`}>Digital Time</h2>
                  <div className="text-center">
                    <motion.div 
                      className={`text-6xl sm:text-7xl font-mono font-bold ${themeClasses.text} mb-4`}
                      key={`${hours}:${minutes}:${seconds}`}
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.1 }}
                    >
                      {hours.toString().padStart(2, '0')}:
                      {minutes.toString().padStart(2, '0')}:
                      {seconds.toString().padStart(2, '0')}
                    </motion.div>
                    {!is24Hour && (
                      <div className={`text-2xl font-bold ${themeClasses.accent} mb-4`}>{ampm}</div>
                    )}
                    <div className={`text-lg ${themeClasses.text} opacity-80`}>
                      {time.toLocaleDateString("en-GB", {
                        weekday: "long",
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Analog Clock */}
            {(clockStyle === 'all' || clockStyle === 'analog') && (
              <motion.div
                key="analog-clock"
                className={`${themeClasses.card} border rounded-3xl p-8 mb-12 shadow-xl`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <h2 className={`text-2xl font-bold ${themeClasses.text} mb-8 text-center`}>Analog Clock</h2>
                <div className="flex justify-center">
                  <AnalogClock time={time} theme={theme} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Actions */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className={`text-2xl font-bold ${themeClasses.text} mb-8`}>Quick Actions</h2>
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

function Circle({ value, max, label, delay, theme }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - value / max);

  const getThemeColors = () => {
    switch (theme) {
      case 'light':
        return {
          glow: 'from-blue-500 to-purple-600',
          stroke: 'stroke-blue-500',
          text: 'text-gray-900'
        };
      case 'purple':
        return {
          glow: 'from-purple-400 to-pink-500',
          stroke: 'stroke-purple-400',
          text: 'text-purple-100'
        };
      default:
        return {
          glow: 'from-purple-500 to-cyan-400',
          stroke: 'stroke-purple-500',
          text: 'text-white'
        };
    }
  };

  const colors = getThemeColors();

  return (
    <motion.div
      className="flex flex-col items-center group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
    >
      <div className="relative mb-4">
        <div className={`absolute inset-0 bg-gradient-to-r ${colors.glow} rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>

        <svg
          width="140"
          height="140"
          viewBox="0 0 100 100"
          className="relative transform group-hover:scale-105 transition-transform duration-300"
        >
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="4"
          />

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

          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>

          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="currentColor"
            fontSize="20"
            fontWeight="bold"
            className={`font-mono ${colors.text}`}
          >
            {value.toString().padStart(2, "0")}
          </text>
        </svg>
      </div>

      <motion.p
        className={`text-sm sm:text-base tracking-wider uppercase ${colors.text} opacity-80 font-medium`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.3 }}
      >
        {label}
      </motion.p>
    </motion.div>
  );
}

function AnalogClock({ time, theme }) {
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = (hours * 30) + (minutes * 0.5);
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  const getThemeColors = () => {
    switch (theme) {
      case 'light':
        return {
          face: 'fill-white stroke-gray-300',
          markers: 'stroke-gray-600',
          hourHand: 'stroke-blue-600',
          minuteHand: 'stroke-purple-600',
          secondHand: 'stroke-pink-500',
          center: 'fill-blue-600'
        };
      case 'purple':
        return {
          face: 'fill-purple-900/50 stroke-purple-400',
          markers: 'stroke-purple-300',
          hourHand: 'stroke-purple-300',
          minuteHand: 'stroke-pink-300',
          secondHand: 'stroke-cyan-300',
          center: 'fill-purple-400'
        };
      default:
        return {
          face: 'fill-white/10 stroke-white/30',
          markers: 'stroke-white/60',
          hourHand: 'stroke-purple-400',
          minuteHand: 'stroke-cyan-400',
          secondHand: 'stroke-pink-400',
          center: 'fill-purple-500'
        };
    }
  };

  const colors = getThemeColors();

  return (
    <div className="relative w-64 h-64">
      <svg width="256" height="256" viewBox="0 0 256 256" className="absolute inset-0">
        <circle
          cx="128"
          cy="128"
          r="120"
          className={colors.face}
          strokeWidth="2"
        />
        
        {[...Array(12)].map((_, i) => (
          <line
            key={i}
            x1="128"
            y1="20"
            x2="128"
            y2="35"
            className={colors.markers}
            strokeWidth="3"
            transform={`rotate(${i * 30} 128 128)`}
          />
        ))}

        {[...Array(60)].map((_, i) => (
          i % 5 !== 0 && (
            <line
              key={i}
              x1="128"
              y1="20"
              x2="128"
              y2="28"
              className={colors.markers}
              strokeWidth="1"
              transform={`rotate(${i * 6} 128 128)`}
            />
          )
        ))}

        <motion.line
          x1="128"
          y1="128"
          x2="128"
          y2="70"
          className={colors.hourHand}
          strokeWidth="6"
          strokeLinecap="round"
          transform={`rotate(${hourAngle} 128 128)`}
          initial={{ rotate: 0 }}
          animate={{ rotate: hourAngle }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ transformOrigin: "128px 128px" }}
        />

        <motion.line
          x1="128"
          y1="128"
          x2="128"
          y2="45"
          className={colors.minuteHand}
          strokeWidth="4"
          strokeLinecap="round"
          transform={`rotate(${minuteAngle} 128 128)`}
          initial={{ rotate: 0 }}
          animate={{ rotate: minuteAngle }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ transformOrigin: "128px 128px" }}
        />

        <motion.line
          x1="128"
          y1="128"
          x2="128"
          y2="35"
          className={colors.secondHand}
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${secondAngle} 128 128)`}
          initial={{ rotate: 0 }}
          animate={{ rotate: secondAngle }}
          transition={{ duration: 0.1, ease: "easeInOut" }}
          style={{ transformOrigin: "128px 128px" }}
        />

        <circle cx="128" cy="128" r="8" className={colors.center} />
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