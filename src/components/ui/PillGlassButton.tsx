import React from 'react';

export type PillVariant = 'default' | 'primary' | 'blue' | 'orange' | 'subtle';

interface BaseProps {
  variant?: PillVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsAnchor = BaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type PillGlassButtonProps = ButtonAsButton | ButtonAsAnchor;

const variantClasses: Record<PillVariant, string> = {
  default:
    'glass-pill-btn text-[#E7E9ED] border-white/22 hover:border-white/40 hover:bg-white/[0.12] focus-visible:ring-white/50',
  primary:
    'glass-pill-btn text-[#F8FAFC] border-white/32 bg-[linear-gradient(180deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.08)_52%,rgba(15,18,24,0.75)_100%)] hover:border-white/55 focus-visible:ring-white/60 shadow-[0_14px_34px_-8px_rgba(255,255,255,0.18)]',
  blue:
    'glass-pill-btn text-[#F0F9FF] border-[#38BDF8]/45 bg-[linear-gradient(180deg,rgba(56,189,248,0.22)_0%,rgba(56,189,248,0.08)_52%,rgba(10,14,20,0.82)_100%)] hover:border-[#38BDF8]/75 focus-visible:ring-[#38BDF8]/60 shadow-[0_14px_34px_-10px_rgba(56,189,248,0.28)]',
  orange:
    'glass-pill-btn text-[#FFF7ED] border-[#F97316]/45 bg-[linear-gradient(180deg,rgba(249,115,22,0.22)_0%,rgba(249,115,22,0.08)_52%,rgba(14,12,10,0.82)_100%)] hover:border-[#F97316]/75 focus-visible:ring-[#F97316]/60 shadow-[0_14px_34px_-10px_rgba(249,115,22,0.26)]',
  subtle:
    'glass-pill-btn text-[#B8BEC7] hover:text-[#E7E9ED] border-white/14 bg-white/[0.04] hover:border-white/28 focus-visible:ring-white/40',
};

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'min-h-[40px] px-4 py-2 text-xs font-medium gap-1.5',
  md: 'min-h-[44px] px-5 py-2.5 text-sm font-semibold gap-2',
  lg: 'min-h-[48px] px-6 sm:px-7 py-3 text-sm sm:text-[15px] font-semibold gap-2.5',
};

export function PillGlassButton(props: PillGlassButtonProps) {
  const {
    variant = 'default',
    size = 'md',
    className = '',
    children,
    ...rest
  } = props;

  const baseClasses = [
    'inline-flex items-center justify-center rounded-full whitespace-nowrap shrink-0',
    'tracking-[0.01em] select-none cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090B]',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const innerContent = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent"
      />
      {children}
    </>
  );

  if ('href' in props && typeof props.href === 'string') {
    const anchorProps = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    const isExternal = props.href.startsWith('http');
    return (
      <a
        href={props.href}
        target={isExternal ? '_blank' : anchorProps.target}
        rel={isExternal ? 'noopener noreferrer' : anchorProps.rel}
        className={baseClasses}
        {...anchorProps}
      >
        {innerContent}
      </a>
    );
  }

  const buttonProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      type={buttonProps.type ?? 'button'}
      className={baseClasses}
      {...buttonProps}
    >
      {innerContent}
    </button>
  );
}
