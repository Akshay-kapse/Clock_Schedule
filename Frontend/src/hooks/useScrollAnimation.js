import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

export const useScrollAnimation = (threshold = 0.1) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    threshold,
    once: true // Only trigger once when element comes into view
  });

  return { ref, isInView };
};