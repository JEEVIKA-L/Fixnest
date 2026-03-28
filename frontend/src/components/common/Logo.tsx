'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo = ({ className = "", size = 32 }: LogoProps) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={{ rotate: -30, opacity: 0, scale: 0.5 }}
      animate={{ rotate: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <defs>
        <linearGradient id="purple-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E6D6F5" />
          <stop offset="100%" stopColor="#C8A2D6" />
        </linearGradient>
        <linearGradient id="pink-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D94F9D" />
          <stop offset="100%" stopColor="#B83280" />
        </linearGradient>
      </defs>

      {/* Top Sweeping Arrow (Purple/Lavender) */}
      <motion.path
        d="M20 42C20 25 35 15 52 15C70 15 85 28 85 45L95 45L80 62L65 45L75 45C75 35 65 25 52 25C40 25 30 32 30 42H20Z"
        fill="url(#purple-grad)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      
      {/* Bottom Sweeping Arrow (Pink/Magenta) */}
      <motion.path
        d="M80 58C80 75 65 85 48 85C30 85 15 72 15 55L5 55L20 38L35 55L25 55C25 65 35 75 48 75C60 75 70 68 70 58H80Z"
        fill="url(#pink-grad)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
      />
    </motion.svg>
  );
};
