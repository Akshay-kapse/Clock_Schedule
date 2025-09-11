import { motion } from "framer-motion";
import { ClockIcon } from "@heroicons/react/24/outline";

const LoadingSpinner = ({ message = "Loading...", size = "default" }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-8 h-8",
    large: "w-12 h-12"
  };

  const textSizeClasses = {
    small: "text-sm",
    default: "text-base",
    large: "text-lg"
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className={`${sizeClasses[size]} border-4 border-purple-500/30 border-t-purple-500 rounded-full`}></div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <ClockIcon className={`${sizeClasses[size]} text-purple-400`} />
        </motion.div>
      </motion.div>
      
      <motion.p
        className={`${textSizeClasses[size]} text-gray-300 font-medium`}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {message}
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;