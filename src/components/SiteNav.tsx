import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { PillGlassButton } from './ui/PillGlassButton';

export interface SiteNavProps {
  onNavigateSection: (anchorId: string) => void;
}

export function SiteNav({ onNavigateSection }: SiteNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      setMobileMenuOpen(false);
      onNavigateSection(href.slice(1));
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#08090B]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => handleNavClick(e, '#top')}
          className="font-display text-lg font-bold tracking-tight text-[#E7E9ED] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
        >
          {siteConfig.brandName}
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#B8BEC7]"
        >
          {siteConfig.navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="hover:text-[#E7E9ED] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action (plus mobile menu button on small viewports) */}
        <div className="flex items-center gap-3 shrink-0">
          <PillGlassButton
            href="#inquiry"
            variant="primary"
            size="sm"
            onClick={(e) => handleNavClick(e, '#inquiry')}
            data-testid="nav-get-quote-cta"
          >
            Get a Quote
          </PillGlassButton>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-site-menu"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex md:hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-[#E7E9ED] hover:bg-white/[0.10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Accessible Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          id="mobile-site-menu"
          aria-label="Mobile Navigation"
          className="md:hidden border-t border-white/10 bg-[#0D1015]/95 px-4 py-4 backdrop-blur-xl"
        >
          <ul className="flex flex-col space-y-1">
            {siteConfig.footerLinks.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="flex min-h-[44px] items-center rounded-xl px-4 text-sm font-medium text-[#E7E9ED] hover:bg-white/[0.06]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
