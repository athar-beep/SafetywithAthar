import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ShieldCheck, MailCheck, Globe } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { WELCOME_AUTO_DISMISS_MS } from '../utils/welcomeState';
import { PillGlassButton } from './ui/PillGlassButton';

export interface WelcomeOverlayProps {
  isOpen: boolean;
  onDismiss: () => void;
}

export function WelcomeOverlay({ isOpen, onDismiss }: WelcomeOverlayProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const dismissedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const triggerDismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;

    if (prefersReducedMotion) {
      onDismiss();
      return;
    }

    setIsExiting(true);
    window.setTimeout(() => {
      onDismiss();
    }, 220);
  }, [onDismiss, prefersReducedMotion]);

  useEffect(() => {
    if (!isOpen) {
      setIsExiting(false);
      dismissedRef.current = false;
      return;
    }

    // Automatically skip/reveal website after 2.6 seconds (within the 2-3s window)
    const autoSkipTimer = window.setTimeout(() => {
      triggerDismiss();
    }, WELCOME_AUTO_DISMISS_MS);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        triggerDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(autoSkipTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, triggerDismiss]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="atharworld-welcome-heading"
      aria-describedby="atharworld-welcome-tagline"
      data-testid="atharworld-welcome-overlay"
      className={[
        'fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto px-4 py-6 sm:px-8 sm:py-8',
        'bg-[#08090B]/96 backdrop-blur-2xl transition-opacity duration-200',
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100',
      ].join(' ')}
    >
      {/* Cinematic Glossy Black & Specular Ambient Reflections */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(231,233,237,0.12),rgba(17,20,24,0.65)_55%,rgba(8,9,11,0.98)_100%)]" />
        <div className="animate-ambient-gloss absolute -top-28 left-1/4 h-80 w-80 rounded-full bg-[#38BDF8]/[0.09] blur-3xl" />
        <div className="animate-ambient-gloss absolute -bottom-28 right-1/4 h-80 w-80 rounded-full bg-[#F97316]/[0.08] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>

      {/* Top Bar inside Welcome Experience: Brand Identity + Clear Skip Option */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-display text-sm sm:text-base font-bold tracking-tight text-[#E7E9ED]">
            {siteConfig.brandName}
          </span>
          <span aria-hidden="true" className="text-[#7D8592]">
            ·
          </span>
          <span className="text-xs sm:text-sm text-[#B8BEC7]">
            {siteConfig.ownerName}
          </span>
        </div>

        <PillGlassButton
          variant="subtle"
          size="sm"
          onClick={triggerDismiss}
          aria-label="Skip welcome screen and go directly to SafetyWithAthar website"
          data-testid="welcome-skip-button"
        >
          Skip
        </PillGlassButton>
      </div>

      {/* Center Translucent Glossy Obsidian Glass Panel */}
      <div className="relative z-10 my-auto mx-auto w-full max-w-3xl py-6">
        <div
          className={[
            'glass-panel-elevated relative overflow-hidden rounded-3xl px-6 py-10 sm:px-12 sm:py-14 text-center',
            'transition-transform duration-200',
            isExiting ? 'scale-[0.985]' : 'scale-100',
          ].join(' ')}
        >
          {/* Specular top highlight reflection */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-3xl bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.01)_42%,transparent_100%)]"
          />

          <div className="relative z-10">
            <p className="font-mono-tabular text-[11px] sm:text-xs font-medium tracking-[0.18em] text-[#B8BEC7]">
              SAFETYWITHATHAR / OFFICIAL TECHNICAL PRACTICE
            </p>

            <h1
              id="atharworld-welcome-heading"
              className="font-editorial mt-5 text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] text-silver-metallic"
              style={{ textWrap: 'balance' }}
            >
              {siteConfig.welcomeTitle}
            </h1>

            <p
              id="atharworld-welcome-tagline"
              className="mt-4 font-display text-lg sm:text-2xl font-medium tracking-[-0.01em] text-[#D5DAE2]"
            >
              “{siteConfig.welcomeTagline}”
            </p>

            <p className="mx-auto mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-[#8E96A4]">
              Cold email infrastructure and remote HSE documentation, engineered
              with clarity, discipline, and zero guesswork.
            </p>

            {/* Primary Pill-Shaped Glass CTA Button */}
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <PillGlassButton
                variant="primary"
                size="lg"
                onClick={triggerDismiss}
                data-testid="enter-my-world-button"
                className="min-w-[220px]"
              >
                <span>{siteConfig.welcomeCta}</span>
                <ArrowRight className="h-4 w-4 text-[#E7E9ED]" aria-hidden="true" />
              </PillGlassButton>
            </div>

            {/* Subtle unboxed service lane indicators */}
            <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[#B8BEC7]">
              <span className="inline-flex items-center gap-1.5">
                <MailCheck className="h-3.5 w-3.5 text-[#38BDF8]" aria-hidden="true" />
                <span>SPF / DKIM / DMARC Infrastructure</span>
              </span>
              <span aria-hidden="true" className="hidden sm:inline text-[#7D8592]">
                ·
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#F97316]" aria-hidden="true" />
                <span>NEBOSH IGC (Credit) Remote HSE Docs</span>
              </span>
              <span aria-hidden="true" className="hidden sm:inline text-[#7D8592]">
                ·
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-[#E7E9ED]" aria-hidden="true" />
                <span>100% Remote Worldwide</span>
              </span>
            </div>
          </div>

          {/* Sleek 2.5s auto-skip specular progress bar along bottom edge */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-white/[0.06]"
          >
            <div className="animate-welcome-progress h-full w-full bg-gradient-to-r from-[#38BDF8]/80 via-white/80 to-[#F97316]/80" />
          </div>
        </div>
      </div>

      {/* Bottom quiet helper note */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between text-xs text-[#7D8592]">
        <span>Entering automatically…</span>
        <span>Press Esc or Skip anytime</span>
      </div>
    </div>
  );
}
