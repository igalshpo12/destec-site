'use client';
import { useRef, useState } from 'react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  style?: React.CSSProperties;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(30,144,255,0.15)',
  style,
  onMouseEnter,
  onMouseLeave,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => {
    setPos(null);
    onMouseLeave?.();
  };

  const handleMouseEnter = () => {
    onMouseEnter?.();
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: pos
          ? `radial-gradient(300px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 70%), #ffffff`
          : '#ffffff',
        transition: 'background 0.1s, transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease',
        border: '1px solid #e8ecf0',
        borderRadius: '12px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default SpotlightCard;
