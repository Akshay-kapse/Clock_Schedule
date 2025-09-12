import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import React from "react";

function ScrollAnimation({ children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false,
    amount: 0.25,
    margin: "0px 0px -120px 0px",
  
  });

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"} // toggle on enter/leave
      variants={{
        hidden: { opacity: 0, y: 80 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: "easeOut" },
        },
      }}
      className="transform-gpu will-change-transform" // smoother on mobile/GPU
    >
      {children}
    </motion.section>
  );
}


export default ScrollAnimation;