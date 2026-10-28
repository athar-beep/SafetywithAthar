import React from 'react';
import { Check, ExternalLink, MessageCircle, HelpCircle, AlertCircle } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import {
  pricingTiers,
  pricingPolicyNote,
  pricingTimingNote,
  type PackageTierId,
  type ServiceId,
} from '../config/servicesConfig';
import { GlassPanel } from './ui/GlassPanel';
import { PillGlassButton } from './ui/PillGlassButton';
import { SectionHeading } from './ui/SectionHeading';

export interface PricingSectionProps {
  onAskQuestionForTier: (serviceId: ServiceId, packageId: PackageTierId) => void;
}

export function PricingSection({ onAskQuestionForTier }: PricingSectionProps) {
  const coldEmailTiers = pricingTiers.filter((t) => t.serviceId === 'cold_email');
  const hseDocTiers = pricingTiers.filter((t) => t.serviceId === 'hse_docs');

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="py-16 sm:py-24 border-t border-white/10"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          indexLabel="03. Transparent USD Packages"
          title="Clear Scope-Based Pricing. Confirmed Before Work Starts."
          subtitle={pricingTimingNote}
        />

        {/* Group 1: Cold Email Infrastructure Setup */}
        <div className="mt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4 border-b border-white/10">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#E7E9ED]">
              Lane A — Cold Email Infrastructure Setup
            </h3>
            <span className="text-xs font-medium text-[#38BDF8]">
              SPF · DKIM · DMARC · Sending Readiness (USD)
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch">
            {coldEmailTiers.map((tier) => {
              const isDraft = tier.status === 'draft_owner_decision';
              return (
                <GlassPanel
                  key={`${tier.serviceId}-${tier.id}`}
                  accent={isDraft ? 'none' : 'blue'}
                  as="article"
                  className="p-6 sm:p-7 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="font-display text-lg font-bold text-[#E7E9ED]">
                        {tier.name}
                      </h4>
                      <span className="text-xs text-[#7D8592]">
                        {isDraft ? 'Draft · Scope Pending' : 'Fixed Package'}
                      </span>
                    </div>

                    <div className="mt-3 flex items-baseline gap-1.5 font-mono-tabular">
                      <span className="font-display text-3xl sm:text-4xl font-extrabold text-[#E7E9ED]">
                        ${tier.priceUsd}
                      </span>
                      <span className="text-xs font-medium text-[#7D8592]">USD</span>
                    </div>

                    <p className="mt-2.5 text-sm text-[#B8BEC7]">{tier.summary}</p>

                    {tier.ownerDecisionNote && (
                      <div className="mt-4 rounded-xl border border-amber-400/25 bg-amber-500/[0.06] p-3 text-xs text-amber-200 flex items-start gap-2">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                        <span>{tier.ownerDecisionNote}</span>
                      </div>
                    )}

                    <ul className="mt-5 space-y-2.5">
                      {tier.deliverables.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-xs sm:text-sm text-[#B8BEC7]"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#38BDF8]" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-7 pt-5 border-t border-white/10">
                    <p className="text-xs text-[#7D8592] font-mono-tabular">
                      {tier.turnaround} · {tier.revisions}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <PillGlassButton
                        href={siteConfig.contact.fiverrUrl}
                        variant={isDraft ? 'default' : 'blue'}
                        size="sm"
                      >
                        <span>Order on Fiverr</span>
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </PillGlassButton>

                      <PillGlassButton
                        href={siteConfig.contact.whatsappUrl}
                        variant="default"
                        size="sm"
                      >
                        <MessageCircle className="h-3.5 w-3.5 text-[#38BDF8]" aria-hidden="true" />
                        <span>WhatsApp</span>
                      </PillGlassButton>

                      <PillGlassButton
                        variant="subtle"
                        size="sm"
                        onClick={() => onAskQuestionForTier('cold_email', tier.id)}
                        data-testid={`ask-question-cold_email-${tier.id}`}
                      >
                        <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Ask a Question</span>
                      </PillGlassButton>
                    </div>
                  </div>
                </GlassPanel>
              );
            })}
          </div>
        </div>

        {/* Group 2: HSE Documentation */}
        <div className="mt-14">
          <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4 border-b border-white/10">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#E7E9ED]">
              Lane B — HSE Documentation (Remote)
            </h3>
            <span className="text-xs font-medium text-[#F97316]">
              Editable Word (.DOCX) + Formatted PDF (USD)
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch">
            {hseDocTiers.map((tier) => (
              <GlassPanel
                key={`${tier.serviceId}-${tier.id}`}
                accent="orange"
                as="article"
                className="p-6 sm:p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="font-display text-lg font-bold text-[#E7E9ED]">
                      {tier.name}
                    </h4>
                    <span className="text-xs text-[#7D8592]">Remote HSE Pack</span>
                  </div>

                  <div className="mt-3 flex items-baseline gap-1.5 font-mono-tabular">
                    <span className="font-display text-3xl sm:text-4xl font-extrabold text-[#E7E9ED]">
                      ${tier.priceUsd}
                    </span>
                    <span className="text-xs font-medium text-[#7D8592]">USD</span>
                  </div>

                  <p className="mt-2.5 text-sm text-[#B8BEC7]">{tier.summary}</p>

                  <ul className="mt-5 space-y-2.5">
                    {tier.deliverables.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-xs sm:text-sm text-[#B8BEC7]"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#F97316]" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7 pt-5 border-t border-white/10">
                  <p className="text-xs text-[#7D8592] font-mono-tabular">
                    {tier.turnaround} · {tier.revisions}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <PillGlassButton
                      href={siteConfig.contact.fiverrUrl}
                      variant="orange"
                      size="sm"
                    >
                      <span>Order on Fiverr</span>
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </PillGlassButton>

                    <PillGlassButton
                      href={siteConfig.contact.whatsappUrl}
                      variant="default"
                      size="sm"
                    >
                      <MessageCircle className="h-3.5 w-3.5 text-[#F97316]" aria-hidden="true" />
                      <span>WhatsApp</span>
                    </PillGlassButton>

                    <PillGlassButton
                      variant="subtle"
                      size="sm"
                      onClick={() => onAskQuestionForTier('hse_docs', tier.id)}
                      data-testid={`ask-question-hse_docs-${tier.id}`}
                    >
                      <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Ask a Question</span>
                    </PillGlassButton>
                  </div>
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>

        {/* Custom Scope Banner */}
        <GlassPanel className="mt-10 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-display text-base sm:text-lg font-bold text-[#E7E9ED]">
              {pricingPolicyNote}
            </p>
            <p className="mt-1 text-xs sm:text-sm text-[#B8BEC7]">
              No direct card checkout on this site. Every engagement is scoped transparently first.
            </p>
          </div>
          <PillGlassButton
            variant="primary"
            size="md"
            onClick={() => onAskQuestionForTier('hse_docs', 'custom')}
          >
            Request Custom Scope Quote
          </PillGlassButton>
        </GlassPanel>
      </div>
    </section>
  );
}
