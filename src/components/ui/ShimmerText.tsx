'use client';

import React, { CSSProperties } from 'react';

interface ShimmerTextProps {
  children: React.ReactNode;
  className?: string;
  /** Color at the shimmer peak — defaults to white */
  shimmerColor?: string;
  /** Duration in seconds — defaults to 3 */
  duration?: number;
}

/**
 * ShimmerText — CSS-only shimmer sweep animation on text.
 * On navy background: transparent → white → transparent sweep.
 * Inspired by 21st.dev AnimatedShinyText pattern.
 */
export function ShimmerText({
  children,
  className = '',
  shimmerColor = '#ffffff',
  duration = 3,
}: ShimmerTextProps) {
  const id = React.useId().replace(/:/g, '');

  const style: CSSProperties = {
    backgroundImage: `linear-gradient(
      90deg,
      rgba(255,255,255,0.4) 0%,
      rgba(255,255,255,0.4) 35%,
      ${shimmerColor} 50%,
      rgba(255,255,255,0.4) 65%,
      rgba(255,255,255,0.4) 100%
    )`,
    backgroundSize: '200% 100%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: `shimmerSweep${id} ${duration}s linear infinite`,
    display: 'inline-block',
  };

  return (
    <>
      <style>{`
        @keyframes shimmerSweep${id} {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
      <span className={className} style={style}>
        {children}
      </span>
    </>
  );
}
