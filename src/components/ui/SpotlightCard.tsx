'use client';

import React, { useRef, useState, MouseEvent } from 'react';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spotlightColor?: string;
  className?: string;
}

/**
 * SpotlightCard — white card with mouse-tracking radial gradient glow.
 * Inspired by 21st.dev SpotlightCard pattern.
 */
export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(30,144,255,0.15)',
  style,
  ...props
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#ffffff',
        border: '1px solid #e8ecf0',
        borderRadius: '0.75rem',
        ...style,
      }}
      {...props}
    >
      {/* Glow overlay */}
      <div
        aria-hidden="true"
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          inset: 0,
          transition: 'opacity 300ms ease',
          opacity,
          background: `radial-gradient(300px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`,
          zIndex: 0,
        }}
      />
      {/* Content above glow */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
