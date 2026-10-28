import React from 'react';

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  accent?: 'none' | 'blue' | 'orange' | 'silver';
  as?: 'div' | 'section' | 'article';
  children: React.ReactNode;
}

const accentStyles: Record<NonNullable<GlassPanelProps['accent']>, string> = {
  none: '',
  blue: 'border-[#38BDF8]/25 shadow-[0_24px_60px_-18px_rgba(56,189,248,0.12)]',
  orange: 'border-[#F97316]/25 shadow-[0_24px_60px_-18px_rgba(249,115,22,0.12)]',
  silver: 'border-white/22 shadow-[0_28px_70px_-18px_rgba(255,255,255,0.08)]',
};

export function GlassPanel({
  elevated = false,
  accent = 'none',
  as: Component = 'div',
  className = '',
  children,
  ...rest
}: GlassPanelProps) {
  return (
    <Component
      className={[
        'relative rounded-2xl overflow-hidden',
        elevated ? 'glass-panel-elevated' : 'glass-panel',
        accentStyles[accent],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {/* Subtle top specular reflection line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
      />
      {children}
    </Component>
  );
}
