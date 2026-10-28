import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { PillGlassButton } from './ui/PillGlassButton';

export function WhatsAppFloat() {
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolledPastHero(window.scrollY > 260);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={[
        'pointer-events-none fixed bottom-3 right-3 sm:bottom-5 sm:right-4 z-30 transition-opacity duration-200',
        scrolledPastHero ? 'opacity-100' : 'opacity-0 sm:opacity-100',
      ].join(' ')}
    >
      <div className={scrolledPastHero ? 'pointer-events-auto' : 'pointer-events-none sm:pointer-events-auto'}>
        <PillGlassButton
          href={siteConfig.contact.whatsappUrl}
          variant="primary"
          size="sm"
          aria-label="Chat with Muhammad Athar on WhatsApp"
          data-testid="whatsapp-floating-cta"
          className="min-h-[42px] px-3.5 py-2 shadow-[0_14px_34px_rgba(0,0,0,0.92)]"
        >
          <MessageCircle className="h-4 w-4 text-[#38BDF8]" aria-hidden="true" />
          <span className="text-xs font-semibold">WhatsApp</span>
        </PillGlassButton>
      </div>
    </div>
  );
}
