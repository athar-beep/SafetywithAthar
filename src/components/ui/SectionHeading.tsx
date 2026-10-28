import React from 'react';

export interface SectionHeadingProps {
  indexLabel?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({
  indexLabel,
  title,
  subtitle,
  align = 'left',
}: SectionHeadingProps) {
  const isCenter = align === 'center';
  return (
    <div className={isCenter ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {indexLabel && (
        <p className="mb-2 text-xs font-medium tracking-[0.06em] text-[#7D8592]">
          {indexLabel}
        </p>
      )}
      <h2
        className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#E7E9ED]"
        style={{ textWrap: 'balance' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base leading-relaxed text-[#B8BEC7]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
