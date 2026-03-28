'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#F3EEF9]">
      {/* Soft gradient blobs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#E6D6F5] to-[#C8A2D6] opacity-40 blur-[100px]"
      />
      
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[20%] -right-[5%] w-[40%] h-[60%] rounded-full bg-gradient-to-br from-[#D94F9D] to-[#B83280] opacity-20 blur-[120px]"
      />

      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -100, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -bottom-[10%] left-[20%] w-[60%] h-[40%] rounded-full bg-gradient-to-tr from-[#C8A2D6] to-[#E6D6F5] opacity-30 blur-[100px]"
      />

      {/* Subtle overlay texture/noise if desired, but keeping it clean as per "minimal UI" */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[20px]" />
    </div>
  );
};
