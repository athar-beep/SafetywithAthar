import React, { useState } from 'react';
import { ChevronDown, Shield, Award, MapPin } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { GlassPanel } from './ui/GlassPanel';
import { SectionHeading } from './ui/SectionHeading';

export function ProcessAboutFaqSection() {
  const [openFaqId, setOpenFaqId] = useState<string>(siteConfig.faqs[0].id);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? '' : id));
  };

  return (
    <>
      {/* SECTION 9: Process — Four Steps */}
      <section
        id="process"
        aria-labelledby="process-heading"
        className="py-16 sm:py-24 border-t border-white/10"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            indexLabel="04. How We Work"
            title="Four-Step Execution Protocol"
            subtitle="Structured from initial scope message to controlled draft delivery and revision handover."
          />

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
            {siteConfig.processSteps.map((step) => (
              <GlassPanel
                key={step.stepNumber}
                as="article"
                className="p-6 flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono-tabular text-xs font-semibold text-[#38BDF8]">
                    Step {step.stepNumber}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-bold text-[#E7E9ED]">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#B8BEC7]">
                    {step.description}
                  </p>
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10: About Muhammad Athar */}
      <section
        id="about"
        aria-labelledby="about-heading"
        className="py-16 sm:py-24 border-t border-white/10"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            indexLabel="05. About the Practitioner"
            title={siteConfig.about.heading}
            subtitle="Field-grounded construction HSE documentation paired with clean outbound email authentication."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 items-stretch">
            {/* Abstract Glass Monogram Portrait Placeholder (No AI-generated fake face) */}
            <GlassPanel
              elevated
              className="lg:col-span-4 p-8 flex flex-col items-center justify-between text-center"
            >
              <div className="my-auto flex flex-col items-center">
                <div
                  aria-label="Muhammad Athar monogram emblem"
                  className="flex h-28 w-28 items-center justify-center rounded-full border border-white/20 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.16),rgba(17,20,24,0.9))] shadow-inner"
                >
                  <span className="font-display text-3xl font-extrabold tracking-tight text-[#E7E9ED]">
                    MA
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-[#E7E9ED]">
                  {siteConfig.ownerName}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[#B8BEC7]">
                  Safety Officer · SPF / DKIM / DMARC Specialist
                </p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#7D8592]">
                  <MapPin className="h-3.5 w-3.5 text-[#38BDF8]" aria-hidden="true" />
                  <span>{siteConfig.location}</span>
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-left">
                <p className="text-[11px] leading-relaxed text-[#7D8592]">
                  {siteConfig.about.verificationNote}
                </p>
              </div>
            </GlassPanel>

            {/* Right Column: Experience & Certifications */}
            <GlassPanel className="lg:col-span-8 p-6 sm:p-9 flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-base leading-relaxed text-[#E7E9ED]">
                  {siteConfig.about.bioPrimary}
                </p>
                <p className="text-sm sm:text-base leading-relaxed text-[#B8BEC7]">
                  {siteConfig.about.bioSecondary}
                </p>

                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/10 bg-[#08090B]/60 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#F97316]">
                      <Shield className="h-4 w-4" aria-hidden="true" />
                      <span>On-Site HSE Field Background</span>
                    </div>
                    <p className="mt-1.5 text-xs sm:text-sm text-[#E7E9ED]">
                      ~2.7 years construction HSE experience with NESPAK &amp; M. Saddique Ch &amp; Co.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#08090B]/60 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#38BDF8]">
                      <Award className="h-4 w-4" aria-hidden="true" />
                      <span>Primary Safety Qualifications</span>
                    </div>
                    <p className="mt-1.5 text-xs sm:text-sm text-[#E7E9ED]">
                      {siteConfig.about.coreCredentials.join(' · ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Clean unboxed certification metadata list */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xs font-semibold text-[#7D8592]">
                  Professional Certifications &amp; Training (Subject to Owner Verification)
                </p>
                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-[#E7E9ED]">
                  {siteConfig.about.certificationList.join('  ·  ')}
                </p>
              </div>
            </GlassPanel>
          </div>
        </div>
      </section>

      {/* SECTION 11: FAQ — Six Honest Answers */}
      <section
        id="faq"
        aria-labelledby="faq-heading"
        className="py-16 sm:py-24 border-t border-white/10"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            indexLabel="06. Frequently Asked Questions"
            title="Six Honest Answers Before You Order"
            subtitle="Clear expectations on turnaround, required HSE site inputs, document sign-off authority, inbox placement, escrow payments, and revisions."
            align="center"
          />

          <div className="mt-10 space-y-3.5">
            {siteConfig.faqs.map((faq, idx) => {
              const isOpen = openFaqId === faq.id;
              return (
                <GlassPanel key={faq.id} className="p-0">
                  <h3>
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${faq.id}`}
                      id={`faq-trigger-${faq.id}`}
                      className="flex w-full min-h-[56px] items-center justify-between gap-4 px-6 py-4 text-left font-display text-base font-semibold text-[#E7E9ED] hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/40 cursor-pointer"
                    >
                      <span>
                        <span className="mr-2 font-mono-tabular text-xs text-[#7D8592]">
                          0{idx + 1}.
                        </span>
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={[
                          'h-4 w-4 shrink-0 text-[#B8BEC7] transition-transform duration-150',
                          isOpen ? 'rotate-180' : 'rotate-0',
                        ].join(' ')}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>

                  {isOpen && (
                    <div
                      id={`faq-panel-${faq.id}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${faq.id}`}
                      className="border-t border-white/10 px-6 py-4 text-sm leading-relaxed text-[#B8BEC7]"
                    >
                      {faq.answer}
                    </div>
                  )}
                </GlassPanel>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
