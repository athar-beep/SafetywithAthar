import React from 'react';
import { Mail, MessageCircle, Linkedin, ExternalLink, Sparkles, Lock } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { GlassPanel } from './ui/GlassPanel';
import { PillGlassButton } from './ui/PillGlassButton';

export interface SiteFooterProps {
  onNavigateSection: (anchorId: string) => void;
  onReplayWelcome: () => void;
  onOpenAdmin: () => void;
}

export function SiteFooter({
  onNavigateSection,
  onReplayWelcome,
  onOpenAdmin,
}: SiteFooterProps) {
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      onNavigateSection(href.slice(1));
    }
  };

  return (
    <footer className="border-t border-white/10 bg-[#08090B] pt-14 pb-24 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Contact Band */}
        <GlassPanel className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-xs font-medium text-[#7D8592]">
              Direct Channels · Configured Destinations Only
            </p>
            <h2 className="mt-1 font-display text-xl sm:text-2xl font-bold text-[#E7E9ED]">
              Ready to Start Your Cold Email Setup or HSE Work Pack?
            </h2>
            <p className="mt-1 text-sm text-[#B8BEC7]">
              Reach Muhammad Athar directly via Email, WhatsApp, LinkedIn, or Fiverr.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <PillGlassButton
              href={siteConfig.contact.mailtoUrl}
              variant="primary"
              size="md"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span>{siteConfig.contact.email}</span>
            </PillGlassButton>

            <PillGlassButton
              href={siteConfig.contact.whatsappUrl}
              variant="blue"
              size="md"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span>WhatsApp</span>
            </PillGlassButton>

            <PillGlassButton
              href={siteConfig.contact.linkedinUrl}
              variant="default"
              size="md"
            >
              <Linkedin className="h-4 w-4" aria-hidden="true" />
              <span>LinkedIn</span>
            </PillGlassButton>

            <PillGlassButton
              href={siteConfig.contact.fiverrUrl}
              variant="orange"
              size="md"
            >
              <span>Fiverr</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </PillGlassButton>
          </div>
        </GlassPanel>

        {/* Bottom Navigation & Copyright */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-t border-white/10 pt-8 text-xs text-[#7D8592]">
          <div className="space-y-2">
            <p className="font-semibold text-[#E7E9ED]">
              {siteConfig.footerCopyright}
            </p>
            <p>
              Upwork and Freelancer links are withheld until verified profile URLs are configured in <code className="text-[#B8BEC7]">siteConfig</code>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {siteConfig.footerLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className="text-[#B8BEC7] hover:text-[#E7E9ED] transition-colors whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}

            <button
              type="button"
              onClick={onReplayWelcome}
              data-testid="footer-replay-welcome"
              className="inline-flex items-center gap-1 text-[#38BDF8] hover:text-[#E7E9ED] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Replay AtharWorld Welcome</span>
            </button>

            <button
              type="button"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1 text-[#7D8592] hover:text-[#E7E9ED] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Lock className="h-3 w-3" aria-hidden="true" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
