import React, { useEffect, useState } from 'react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import {
  getPackagesForService,
  type PackageTierId,
  type ServiceId,
} from '../config/servicesConfig';
import { validateInquiryInput, type InquiryFieldErrors } from '../utils/validation';
import { GlassPanel } from './ui/GlassPanel';
import { PillGlassButton } from './ui/PillGlassButton';
import { SectionHeading } from './ui/SectionHeading';

export interface InquirySectionProps {
  selectedService: ServiceId;
  selectedPackage: PackageTierId;
  onServiceChange: (service: ServiceId) => void;
  onPackageChange: (pkg: PackageTierId) => void;
}

type SubmissionStatus =
  | 'idle'
  | 'submitting'
  | 'saved_and_emailed'
  | 'saved_email_unconfirmed'
  | 'rate_limited'
  | 'failed';

export function InquirySection({
  selectedService,
  selectedPackage,
  onServiceChange,
  onPackageChange,
}: InquirySectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [fieldErrors, setFieldErrors] = useState<InquiryFieldErrors>({});
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [serverErrorDetail, setServerErrorDetail] = useState<string | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState<string>(() => `inq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);

  const packageOptions = getPackagesForService(selectedService);

  useEffect(() => {
    // Reset status if user changes inputs after an error
    if (status === 'failed' || status === 'rate_limited') {
      setStatus('idle');
    }
  }, [name, email, selectedService, selectedPackage, message]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'submitting') return;

    const validation = validateInquiryInput({
      name,
      email,
      service: selectedService,
      packageTier: selectedPackage,
      message,
      honeypot,
      pageSource:
        typeof window !== 'undefined'
          ? `${window.location.pathname}${window.location.hash || '#inquiry'}`
          : '/safetywithathar/#inquiry',
      idempotencyKey,
    });

    if (validation.isSpamHoneypot) {
      setStatus('rate_limited');
      setServerErrorDetail('Submission could not be processed right now. Please try again later.');
      return;
    }

    if (!validation.valid || !validation.sanitized) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    setStatus('submitting');
    setServerErrorDetail(null);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.sanitized),
      });

      const data = await response.json().catch(() => null);

      if (response.status === 429) {
        setStatus('rate_limited');
        setServerErrorDetail(
          data?.error || 'Too many requests in a short window. Please try again in a minute or tap WhatsApp.'
        );
        return;
      }

      if (!response.ok || !data) {
        setStatus('failed');
        setServerErrorDetail(
          'Something went wrong — please email muhammadatharhse@gmail.com or tap WhatsApp.'
        );
        return;
      }

      // Generate fresh idempotency key for future distinct inquiries
      setIdempotencyKey(`inq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);

      if (data.outcome === 'saved_and_emailed') {
        setStatus('saved_and_emailed');
      } else {
        setStatus('saved_email_unconfirmed');
      }
    } catch {
      // Network/CORS/function failure before save: keep filled form data intact!
      setStatus('failed');
      setServerErrorDetail(
        'Something went wrong — please email muhammadatharhse@gmail.com or tap WhatsApp.'
      );
    }
  };

  const handleResetForAnotherInquiry = () => {
    setName('');
    setEmail('');
    setMessage('');
    setFieldErrors({});
    setStatus('idle');
    setServerErrorDetail(null);
  };

  return (
    <section
      id="inquiry"
      aria-labelledby="inquiry-heading"
      className="py-16 sm:py-24 border-t border-white/10"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
          {/* Left Column: Direct Scope Guidance & Contact Band */}
          <div className="lg:col-span-5 space-y-6">
            <SectionHeading
              indexLabel="07. Scope & Project Inquiry"
              title="Send Your Scope Details for Confirmation"
              subtitle="No visitor registration or account creation required. Share your domain setup requirements or HSE work-pack details below."
            />

            <GlassPanel className="p-6 space-y-4">
              <h3 className="font-display text-base font-bold text-[#E7E9ED]">
                What to include in your message
              </h3>
              <div className="space-y-3 text-xs sm:text-sm text-[#B8BEC7]">
                <p>
                  <strong className="text-[#38BDF8]">For Cold Email Setup:</strong>{' '}
                  Number of domains, DNS provider (Cloudflare, Namecheap, GoDaddy, etc.), and mailbox platform (Google Workspace / Microsoft 365).
                </p>
                <p>
                  <strong className="text-[#F97316]">For HSE Documentation:</strong>{' '}
                  Document type needed (RA, JSA/JHA, Method Statement, HSE Plan), approximate number of activities, and target turnaround date.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2.5">
                <p className="text-xs font-semibold text-[#7D8592]">
                  Prefer Direct Contact?
                </p>
                <div className="flex flex-wrap items-center gap-2.5">
                  <PillGlassButton
                    href={siteConfig.contact.whatsappUrl}
                    variant="blue"
                    size="sm"
                  >
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>WhatsApp Direct</span>
                  </PillGlassButton>

                  <PillGlassButton
                    href={siteConfig.contact.mailtoUrl}
                    variant="default"
                    size="sm"
                  >
                    <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{siteConfig.contact.email}</span>
                  </PillGlassButton>

                  <PillGlassButton
                    href={siteConfig.contact.fiverrUrl}
                    variant="subtle"
                    size="sm"
                  >
                    <span>Fiverr Profile</span>
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </PillGlassButton>
                </div>
              </div>
            </GlassPanel>
          </div>

          {/* Right Column: Validated Inquiry Form */}
          <div className="lg:col-span-7">
            <GlassPanel elevated className="p-6 sm:p-9">
              <form
                onSubmit={handleSubmit}
                noValidate
                aria-label="Service Inquiry Form"
                data-testid="inquiry-form"
                className="space-y-5"
              >
                {/* Hidden Honeypot Field for Anti-Spam */}
                <div className="sr-only" aria-hidden="true">
                  <label htmlFor="inquiry-company-website">
                    Leave this field empty
                  </label>
                  <input
                    id="inquiry-company-website"
                    name="company_website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="inquiry-name"
                      className="block text-xs font-semibold text-[#E7E9ED]"
                    >
                      Your Name <span className="text-[#F97316]">*</span>
                    </label>
                    <input
                      id="inquiry-name"
                      name="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (fieldErrors.name) {
                          setFieldErrors((prev) => ({ ...prev, name: undefined }));
                        }
                      }}
                      placeholder="e.g. Engr. Bilal Ahmed"
                      aria-invalid={Boolean(fieldErrors.name)}
                      aria-describedby={fieldErrors.name ? 'error-inquiry-name' : undefined}
                      className="mt-1.5 w-full min-h-[44px] rounded-xl border border-white/15 bg-[#08090B]/80 px-4 py-2.5 text-sm text-[#E7E9ED] placeholder-[#7D8592] focus:border-[#38BDF8] focus:outline-none focus:ring-1 focus:ring-[#38BDF8]"
                    />
                    {fieldErrors.name && (
                      <p
                        id="error-inquiry-name"
                        role="alert"
                        className="mt-1.5 text-xs text-amber-300"
                      >
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="inquiry-email"
                      className="block text-xs font-semibold text-[#E7E9ED]"
                    >
                      Email Address <span className="text-[#F97316]">*</span>
                    </label>
                    <input
                      id="inquiry-email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) {
                          setFieldErrors((prev) => ({ ...prev, email: undefined }));
                        }
                      }}
                      placeholder="name@company.com"
                      aria-invalid={Boolean(fieldErrors.email)}
                      aria-describedby={fieldErrors.email ? 'error-inquiry-email' : undefined}
                      className="mt-1.5 w-full min-h-[44px] rounded-xl border border-white/15 bg-[#08090B]/80 px-4 py-2.5 text-sm text-[#E7E9ED] placeholder-[#7D8592] focus:border-[#38BDF8] focus:outline-none focus:ring-1 focus:ring-[#38BDF8]"
                    />
                    {fieldErrors.email && (
                      <p
                        id="error-inquiry-email"
                        role="alert"
                        className="mt-1.5 text-xs text-amber-300"
                      >
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Service Dropdown */}
                  <div>
                    <label
                      htmlFor="inquiry-service"
                      className="block text-xs font-semibold text-[#E7E9ED]"
                    >
                      Service Lane <span className="text-[#F97316]">*</span>
                    </label>
                    <select
                      id="inquiry-service"
                      name="service"
                      value={selectedService}
                      onChange={(e) => onServiceChange(e.target.value as ServiceId)}
                      className="mt-1.5 w-full min-h-[44px] rounded-xl border border-white/15 bg-[#08090B]/90 px-4 py-2.5 text-sm text-[#E7E9ED] focus:border-[#38BDF8] focus:outline-none focus:ring-1 focus:ring-[#38BDF8]"
                    >
                      <option value="cold_email">Cold Email Infrastructure Setup</option>
                      <option value="hse_docs">HSE Documentation</option>
                    </select>
                  </div>

                  {/* Package Dropdown */}
                  <div>
                    <label
                      htmlFor="inquiry-package"
                      className="block text-xs font-semibold text-[#E7E9ED]"
                    >
                      Package Tier <span className="text-[#F97316]">*</span>
                    </label>
                    <select
                      id="inquiry-package"
                      name="package"
                      value={selectedPackage}
                      onChange={(e) => onPackageChange(e.target.value as PackageTierId)}
                      className="mt-1.5 w-full min-h-[44px] rounded-xl border border-white/15 bg-[#08090B]/90 px-4 py-2.5 text-sm text-[#E7E9ED] focus:border-[#38BDF8] focus:outline-none focus:ring-1 focus:ring-[#38BDF8]"
                    >
                      {packageOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="inquiry-message"
                      className="block text-xs font-semibold text-[#E7E9ED]"
                    >
                      Scope &amp; Requirements <span className="text-[#F97316]">*</span>
                    </label>
                    <span className="font-mono-tabular text-[11px] text-[#7D8592]">
                      {message.trim().length} / 3000 chars (min 20)
                    </span>
                  </div>
                  <textarea
                    id="inquiry-message"
                    name="message"
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (fieldErrors.message) {
                        setFieldErrors((prev) => ({ ...prev, message: undefined }));
                      }
                    }}
                    placeholder="Describe your domains/mailboxes or your HSE work-pack activities, site context, and timeline..."
                    aria-invalid={Boolean(fieldErrors.message)}
                    aria-describedby={fieldErrors.message ? 'error-inquiry-message' : undefined}
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#08090B]/80 px-4 py-3 text-sm text-[#E7E9ED] placeholder-[#7D8592] focus:border-[#38BDF8] focus:outline-none focus:ring-1 focus:ring-[#38BDF8]"
                  />
                  {fieldErrors.message && (
                    <p
                      id="error-inquiry-message"
                      role="alert"
                      className="mt-1.5 text-xs text-amber-300"
                    >
                      {fieldErrors.message}
                    </p>
                  )}
                </div>

                {/* Honest Outcome Banners */}
                {status === 'saved_and_emailed' && (
                  <div
                    role="status"
                    data-testid="inquiry-success-banner"
                    className="rounded-xl border border-emerald-400/30 bg-emerald-500/[0.08] p-4 text-sm text-[#E7E9ED]"
                  >
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />
                      <div>
                        <p className="font-semibold">
                          Received. I reply within 24 hours — for a faster answer, tap WhatsApp.
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2.5">
                          <PillGlassButton
                            href={siteConfig.contact.whatsappUrl}
                            variant="blue"
                            size="sm"
                          >
                            Tap WhatsApp
                          </PillGlassButton>
                          <PillGlassButton
                            variant="subtle"
                            size="sm"
                            onClick={handleResetForAnotherInquiry}
                          >
                            Submit Another Inquiry
                          </PillGlassButton>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {status === 'saved_email_unconfirmed' && (
                  <div
                    role="status"
                    data-testid="inquiry-saved-unconfirmed-banner"
                    className="rounded-xl border border-[#38BDF8]/35 bg-[#38BDF8]/[0.08] p-4 text-sm text-[#E7E9ED]"
                  >
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#38BDF8]" aria-hidden="true" />
                      <div className="space-y-2">
                        <p className="font-semibold">
                          Received. I reply within 24 hours — for a faster answer, tap WhatsApp.
                        </p>
                        <p className="text-xs text-[#B8BEC7]">
                          Your inquiry was saved, but the notification email could not be confirmed. For a faster response, contact me by WhatsApp or email. You do not need to submit the form again.
                        </p>
                        <div className="pt-1 flex flex-wrap items-center gap-2.5">
                          <PillGlassButton
                            href={siteConfig.contact.whatsappUrl}
                            variant="blue"
                            size="sm"
                          >
                            Message on WhatsApp
                          </PillGlassButton>
                          <PillGlassButton
                            href={siteConfig.contact.mailtoUrl}
                            variant="default"
                            size="sm"
                          >
                            Email {siteConfig.contact.email}
                          </PillGlassButton>
                          <PillGlassButton
                            variant="subtle"
                            size="sm"
                            onClick={handleResetForAnotherInquiry}
                          >
                            Clear Form
                          </PillGlassButton>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {(status === 'failed' || status === 'rate_limited') && (
                  <div
                    role="alert"
                    data-testid="inquiry-error-banner"
                    className="rounded-xl border border-amber-400/35 bg-amber-500/[0.08] p-4 text-sm text-[#E7E9ED]"
                  >
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
                      <div className="space-y-2">
                        <p className="font-medium">
                          {serverErrorDetail ||
                            'Something went wrong — please email muhammadatharhse@gmail.com or tap WhatsApp.'}
                        </p>
                        <p className="text-xs text-[#B8BEC7]">
                          Your typed message is still intact above so nothing was lost.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                  <PillGlassButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={
                      status === 'submitting' ||
                      status === 'saved_and_emailed' ||
                      status === 'saved_email_unconfirmed'
                    }
                    data-testid="submit-inquiry-button"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    <span>
                      {status === 'submitting' ? 'Sending Inquiry…' : 'Send Scope Inquiry'}
                    </span>
                  </PillGlassButton>

                  <span className="text-xs text-[#7D8592]">
                    Protected against duplicate submissions
                  </span>
                </div>
              </form>
            </GlassPanel>
          </div>
        </div>
      </div>
    </section>
  );
}
