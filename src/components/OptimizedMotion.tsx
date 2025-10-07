'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface OptimizedMotionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

const OptimizedMotion = ({ 
  children, 
  className, 
  delay = 0, 
  direction = 'up' 
}: OptimizedMotionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { opacity: 0, y: 60 };
      case 'down': return { opacity: 0, y: -60 };
      case 'left': return { opacity: 0, x: -60 };
      case 'right': return { opacity: 0, x: 60 };
      default: return { opacity: 0, y: 60 };
    }
  };

  const getAnimatePosition = () => {
    switch (direction) {
      case 'up': return { opacity: 1, y: 0 };
      case 'down': return { opacity: 1, y: 0 };
      case 'left': return { opacity: 1, x: 0 };
      case 'right': return { opacity: 1, x: 0 };
      default: return { opacity: 1, y: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitialPosition()}
      animate={isInView ? getAnimatePosition() : getInitialPosition()}
      transition={{ 
        duration: 0.5, 
        delay, 
        ease: "easeOut" 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default OptimizedMotion;
