'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo = ({ className = "", size = 32 }: LogoProps) => {
  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size * 3, height: size }} // Approximate aspect ratio for logo with text
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <img
        src="/logo.png"
        alt="FixNest Logo"
        style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
        className="block"
      />
    </motion.div>
  );
};
