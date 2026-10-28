import React, { useState } from 'react';
import { ArrowDownRight, ShieldCheck, MailCheck, CheckCircle2 } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { GlassPanel } from './ui/GlassPanel';
import { PillGlassButton } from './ui/PillGlassButton';

export interface HeroSectionProps {
  onNavigateSection: (anchorId: string) => void;
}

export function HeroSection({ onNavigateSection }: HeroSectionProps) {
  const [activePreviewLane, setActivePreviewLane] = useState<'cold_email' | 'hse_docs'>('cold_email');

  return (
    <section
      id="top"
      aria-labelledby="hero-main-heading"
      className="relative overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24"
    >
      {/* Architectural Grid & Restrained Ambient Light Diffusion */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Fine architectural grid lines */}
        <div className="hero-architectural-surface absolute inset-0" />
        {/* Top silver specular reflection */}
        <div className="absolute left-1/2 -top-24 h-[380px] w-full max-w-[960px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(231,233,237,0.11)_0%,rgba(17,20,24,0.35)_52%,transparent_75%)] blur-2xl" />
        {/* Restrained dual-lane ambient diffusion behind hero composition */}
        <div className="animate-ambient-gloss absolute left-[5%] top-[16%] h-64 w-64 rounded-full bg-[#38BDF8]/[0.08] blur-3xl" />
        <div className="animate-ambient-gloss absolute left-[20%] top-[36%] h-64 w-64 rounded-full bg-[#F97316]/[0.07] blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Asymmetric Art-Directed 12-Column Hero Split */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Expressive Editorial Typography & Primary Actions */}
          <div className="flex flex-col justify-between lg:col-span-7">
            <div>
              {/* 1. Small Editorial Eyebrow */}
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="hidden sm:inline-block h-px w-8 bg-gradient-to-r from-white/55 to-white/10"
                />
                <p
                  data-testid="hero-eyebrow"
                  className="font-mono-tabular text-[10px] sm:text-[11px] font-medium tracking-[0.16em] text-[#9BA3B0] leading-relaxed"
                >
                  {siteConfig.hero.eyebrow}
                </p>
              </div>

              {/* 2. Oversized Editorial Headline with Deliberate Weight Hierarchy & Intentional Line Breaks */}
              <h1
                id="hero-main-heading"
                className="font-editorial mt-5 sm:mt-6 text-[2.15rem] leading-[1.1] sm:text-[3.15rem] lg:text-[3.55rem] xl:text-[3.85rem] tracking-[-0.035em]"
              >
                {/* Line 1: Precision for the inbox. */}
                <span className="block">
                  <span className="font-bold text-silver-metallic">Precision </span>
                  <span className="font-normal text-[#9BA3B0]">for the </span>
                  <span className="relative inline-block whitespace-nowrap font-extrabold">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-x-2 -inset-y-1 -z-10 rounded-full bg-[#38BDF8]/[0.16] blur-xl"
                    />
                    <span className="font-syne-accent text-inbox-blue">inbox</span>
                    <span className="text-silver-metallic">.</span>
                  </span>
                </span>

                {/* Line 2: Clarity for the worksite. (Asymmetric editorial offset on desktop) */}
                <span className="mt-2 sm:mt-2.5 block lg:pl-6">
                  <span className="font-bold text-silver-metallic">Clarity </span>
                  <span className="font-normal text-[#9BA3B0]">for the </span>
                  <span className="relative inline-block whitespace-nowrap font-extrabold">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-x-2 -inset-y-1 -z-10 rounded-full bg-[#F97316]/[0.16] blur-xl"
                    />
                    <span className="font-syne-accent text-worksite-orange">worksite</span>
                    <span className="text-silver-metallic">.</span>
                  </span>
                </span>
              </h1>

              {/* 3. Calm, Readable Supporting Copy */}
              <p
                data-testid="hero-supporting-copy"
                className="mt-6 max-w-lg text-[15px] sm:text-[17px] font-normal leading-relaxed text-[#B8BEC7]"
              >
                {siteConfig.hero.supportingLine}
              </p>

              {/* 4. Small, Understated Descriptor Beneath Supporting Copy */}
              <p
                data-testid="hero-descriptor"
                className="mt-4 font-mono-tabular text-[11px] font-medium tracking-[0.18em] text-[#7D8592]"
              >
                {siteConfig.hero.descriptor}
              </p>

              {/* 5. Two Service Pill-Glass CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
                <PillGlassButton
                  variant="blue"
                  size="lg"
                  onClick={() => onNavigateSection('lane-cold-email')}
                  data-testid="hero-cta-cold-email"
                  className="w-full sm:w-auto"
                >
                  <MailCheck className="h-4 w-4 text-[#38BDF8]" aria-hidden="true" />
                  <span>Cold Email Setup</span>
                  <ArrowDownRight className="h-4 w-4 text-[#B8BEC7]" aria-hidden="true" />
                </PillGlassButton>

                <PillGlassButton
                  variant="orange"
                  size="lg"
                  onClick={() => onNavigateSection('lane-hse-docs')}
                  data-testid="hero-cta-hse-docs"
                  className="w-full sm:w-auto"
                >
                  <ShieldCheck className="h-4 w-4 text-[#F97316]" aria-hidden="true" />
                  <span>HSE Documentation</span>
                  <ArrowDownRight className="h-4 w-4 text-[#B8BEC7]" aria-hidden="true" />
                </PillGlassButton>
              </div>
            </div>

            {/* Required Trust Strip */}
            <div className="mt-9 pt-5 border-t border-white/10">
              <p
                data-testid="hero-trust-strip"
                className="font-mono-tabular text-[11px] sm:text-xs font-normal tracking-[0.02em] text-[#9BA3B0] leading-relaxed"
              >
                {siteConfig.hero.trustStrip}
              </p>
            </div>
          </div>

          {/* Right Column: Translucent Charcoal Glass Specification Ledger */}
          <div className="lg:col-span-5">
            <GlassPanel
              elevated
              accent={activePreviewLane === 'cold_email' ? 'blue' : 'orange'}
              className="w-full p-5 sm:p-7"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div>
                  <p className="font-mono-tabular text-[10px] tracking-[0.16em] text-[#7D8592]">
                    TECHNICAL LEDGER
                  </p>
                  <h2 className="mt-1 font-display text-sm sm:text-base font-semibold tracking-tight text-[#E7E9ED]">
                    {activePreviewLane === 'cold_email'
                      ? 'DNS & Sending Authentication'
                      : 'Controlled HSE Document Pack'}
                  </h2>
                </div>

                {/* Interactive Segmented Switcher (Functional Buttons) */}
                <div
                  role="group"
                  aria-label="Preview service specification"
                  className="inline-flex rounded-full border border-white/14 bg-[#08090B]/85 p-1"
                >
                  <button
                    type="button"
                    onClick={() => setActivePreviewLane('cold_email')}
                    className={[
                      'rounded-full px-3 py-1 text-xs font-semibold transition-opacity cursor-pointer whitespace-nowrap',
                      activePreviewLane === 'cold_email'
                        ? 'bg-[#38BDF8]/20 text-[#E7E9ED] border border-[#38BDF8]/45'
                        : 'text-[#7D8592] hover:text-[#B8BEC7]',
                    ].join(' ')}
                  >
                    Inbox
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePreviewLane('hse_docs')}
                    className={[
                      'rounded-full px-3 py-1 text-xs font-semibold transition-opacity cursor-pointer whitespace-nowrap',
                      activePreviewLane === 'hse_docs'
                        ? 'bg-[#F97316]/20 text-[#E7E9ED] border border-[#F97316]/45'
                        : 'text-[#7D8592] hover:text-[#B8BEC7]',
                    ].join(' ')}
                  >
                    Worksite
                  </button>
                </div>
              </div>

              {activePreviewLane === 'cold_email' ? (
                <div className="mt-4 space-y-3 text-xs">
                  <div className="rounded-xl border border-white/10 bg-[#08090B]/65 p-3.5">
                    <div className="flex items-center justify-between text-[11px] text-[#7D8592]">
                      <span>SPF Record Consolidation</span>
                      <span className="font-mono-tabular text-[#38BDF8]">TXT · v=spf1</span>
                    </div>
                    <p className="mt-1 font-mono-tabular text-xs text-[#E7E9ED] truncate">
                      v=spf1 include:_spf.google.com ~all
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#08090B]/65 p-3.5">
                    <div className="flex items-center justify-between text-[11px] text-[#7D8592]">
                      <span>DKIM 2048-Bit Key Signing</span>
                      <span className="font-mono-tabular text-[#38BDF8]">selector._domainkey</span>
                    </div>
                    <p className="mt-1 text-xs text-[#B8BEC7]">
                      Cryptographic header verification &amp; tracking CNAME alignment
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#08090B]/65 p-3.5">
                    <div className="flex items-center justify-between text-[11px] text-[#7D8592]">
                      <span>DMARC Policy &amp; Warm-Up</span>
                      <span className="font-mono-tabular text-[#38BDF8]">_dmarc · p=quarantine</span>
                    </div>
                    <p className="mt-1 text-xs text-[#B8BEC7]">
                      Domain alignment audit &amp; structured mailbox ramp-up protocol
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 space-y-3 text-xs">
                  <div className="rounded-xl border border-white/10 bg-[#08090B]/65 p-3.5">
                    <div className="flex items-center justify-between text-[11px] text-[#7D8592]">
                      <span>Activity-Based Risk Matrix</span>
                      <span className="font-mono-tabular text-[#F97316]">5×5 Initial → Residual</span>
                    </div>
                    <p className="mt-1 text-xs text-[#E7E9ED]">
                      Task breakdown · Hazard identification · Hierarchy of controls
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#08090B]/65 p-3.5">
                    <div className="flex items-center justify-between text-[11px] text-[#7D8592]">
                      <span>Missing Site Data Protocol</span>
                      <span className="font-mono-tabular text-[#F97316]">Zero Fabrication</span>
                    </div>
                    <p className="mt-1 text-xs text-[#B8BEC7]">
                      Unconfirmed site parameters are explicitly flagged as [HOLD POINT]
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#08090B]/65 p-3.5">
                    <div className="flex items-center justify-between text-[11px] text-[#7D8592]">
                      <span>Controlled Handover Formats</span>
                      <span className="font-mono-tabular text-[#F97316]">.DOCX + .PDF</span>
                    </div>
                    <p className="mt-1 text-xs text-[#B8BEC7]">
                      Drafted for client or site HSE authority review and sign-off
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#B8BEC7]">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2
                    className={`h-3.5 w-3.5 ${
                      activePreviewLane === 'cold_email' ? 'text-[#38BDF8]' : 'text-[#F97316]'
                    }`}
                    aria-hidden="true"
                  />
                  <span>Scope confirmed before work starts</span>
                </span>
                <span className="font-mono-tabular text-[#E7E9ED]">
                  {activePreviewLane === 'cold_email' ? 'From $20 USD' : 'From $5 USD'}
                </span>
              </div>
            </GlassPanel>
          </div>
        </div>

        {/* Full-Width 4-Column Trust & Stats Strip Below Hero Split */}
        <GlassPanel className="mt-12 p-6 sm:p-7" data-testid="stats-strip">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-white/10">
            {siteConfig.statsStrip.map((stat, idx) => (
              <div
                key={stat.label}
                className={[
                  idx > 0 ? 'lg:pl-6' : '',
                  idx < siteConfig.statsStrip.length - 1 ? 'lg:pr-6' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <p className="font-display text-sm sm:text-base font-semibold leading-snug text-[#E7E9ED] tabular-nums">
                  {stat.label}
                </p>
                {stat.subnote && (
                  <p className="mt-1 text-xs leading-relaxed text-[#7D8592]">
                    {stat.subnote}
                  </p>
                )}
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}
