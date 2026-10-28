import React from 'react';
import { ExternalLink, MessageCircle, Linkedin, Check, AlertCircle } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { serviceLanes, type ServiceLaneConfig } from '../config/servicesConfig';
import { GlassPanel } from './ui/GlassPanel';
import { PillGlassButton } from './ui/PillGlassButton';
import { SectionHeading } from './ui/SectionHeading';

export function ServiceLanesSection() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="py-16 sm:py-24 border-t border-white/10"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          indexLabel="01. Specialized Service Lanes"
          title="Two Distinct Technical Disciplines. Zero Guesswork."
          subtitle="Choose the exact lane your team needs: authenticated cold-email sending infrastructure or controlled, remote construction & industrial HSE documentation."
        />

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2 items-stretch">
          {serviceLanes.map((lane: ServiceLaneConfig) => {
            const isBlue = lane.accentColor === 'blue';
            const accentText = isBlue ? 'text-[#38BDF8]' : 'text-[#F97316]';
            const accentVariant = isBlue ? 'blue' : 'orange';

            return (
              <GlassPanel
                key={lane.id}
                id={lane.anchorId}
                elevated
                accent={lane.accentColor}
                as="article"
                className="p-6 sm:p-9 flex flex-col justify-between scroll-mt-24"
              >
                <div>
                  {/* Clean unboxed metadata kicker */}
                  <p className={`text-xs font-semibold tracking-[0.04em] ${accentText}`}>
                    {lane.badgeText}
                  </p>

                  <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#E7E9ED]">
                    {lane.title}
                  </h3>

                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#B8BEC7]">
                    {lane.subtitle}
                  </p>

                  {/* Highlight Callout Box (hairline all-around border, no thick left border) */}
                  <div className="mt-6 rounded-xl border border-white/12 bg-[#08090B]/70 p-4">
                    <p className="text-sm font-medium leading-relaxed text-[#E7E9ED]">
                      “{lane.keyHighlight}”
                    </p>
                  </div>

                  {/* Deliverables list */}
                  <div className="mt-6">
                    <p className="text-xs font-semibold text-[#7D8592]">
                      Core Scope &amp; Deliverables
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {lane.deliverables.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-sm text-[#B8BEC7]"
                        >
                          <Check
                            className={`mt-0.5 h-4 w-4 shrink-0 ${accentText}`}
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  {/* Honest Technical / Compliance Disclaimer */}
                  <div className="mb-5 flex items-start gap-2 text-xs leading-relaxed text-[#7D8592]">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#B8BEC7]" aria-hidden="true" />
                    <span>{lane.disclaimer}</span>
                  </div>

                  {/* Three Consistent Pill-Glass Actions: Order on Fiverr, WhatsApp, LinkedIn */}
                  <div className="flex flex-wrap items-center gap-3">
                    <PillGlassButton
                      href={siteConfig.contact.fiverrUrl}
                      variant={accentVariant}
                      size="md"
                    >
                      <span>Order on Fiverr</span>
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </PillGlassButton>

                    <PillGlassButton
                      href={siteConfig.contact.whatsappUrl}
                      variant="default"
                      size="md"
                    >
                      <MessageCircle className="h-3.5 w-3.5 text-[#38BDF8]" aria-hidden="true" />
                      <span>WhatsApp</span>
                    </PillGlassButton>

                    <PillGlassButton
                      href={siteConfig.contact.linkedinUrl}
                      variant="subtle"
                      size="md"
                    >
                      <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>LinkedIn</span>
                    </PillGlassButton>
                  </div>
                </div>
              </GlassPanel>
            );
          })}
        </div>
      </div>
    </section>
  );
}
