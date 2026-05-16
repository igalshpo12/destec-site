'use client';

import React, { CSSProperties } from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * GradientText — animated CSS gradient text cycling through DES brand colors.
 * Navy #1a2b4a → Blue #1e90ff → #1a6bcf → #0d4a8a → navy #1a2b4a
 * Pure CSS, no framer-motion.
 */
export function GradientText({ children, className = '' }: GradientTextProps) {
  const style: CSSProperties = {
    background: 'linear-gradient(270deg, #1a2b4a, #1e90ff, #1a6bcf, #0d4a8a, #1e90ff, #1a2b4a)',
    backgroundSize: '300% 100%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: 'desGradientShift 4s linear infinite',
    display: 'inline',
  };

  return (
    <>
      <style>{`
        @keyframes desGradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <span className={className} style={style}>
        {children}
      </span>
    </>
  );
}
