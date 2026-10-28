import React, { useCallback, useEffect, useState } from 'react';
import type { PackageTierId, ServiceId } from './config/servicesConfig';
import {
  shouldShowWelcome,
  markWelcomeSeen,
  resetWelcomeSeen,
} from './utils/welcomeState';
import { WelcomeOverlay } from './components/WelcomeOverlay';
import { SiteNav } from './components/SiteNav';
import { HeroSection } from './components/HeroSection';
import { ServiceLanesSection } from './components/ServiceLanesSection';
import {
  SampleGallerySection,
  type PortfolioSample,
} from './components/SampleGallerySection';
import { PricingSection } from './components/PricingSection';
import { ProcessAboutFaqSection } from './components/ProcessAboutFaqSection';
import { InquirySection } from './components/InquirySection';
import { AdminModal } from './components/AdminModal';
import { SiteFooter } from './components/SiteFooter';
import { WhatsAppFloat } from './components/WhatsAppFloat';

export default function App() {
  const [welcomeOpen, setWelcomeOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return shouldShowWelcome({
      searchQuery: window.location.search,
      storage: window.sessionStorage,
    });
  });

  const [samples, setSamples] = useState<PortfolioSample[]>([]);
  const [samplesLoading, setSamplesLoading] = useState<boolean>(true);
  const [samplesError, setSamplesError] = useState<string | null>(null);
  const [adminOpen, setAdminOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.location.pathname.endsWith('/admin') ||
      window.location.hash === '#admin'
    );
  });

  const [inquiryService, setInquiryService] = useState<ServiceId>('cold_email');
  const [inquiryPackage, setInquiryPackage] = useState<PackageTierId>('basic');

  const fetchSamples = useCallback(async () => {
    setSamplesLoading(true);
    setSamplesError(null);
    try {
      const response = await fetch('/api/samples');
      if (!response.ok) {
        throw new Error('Could not load published sample metadata.');
      }
      const data = await response.json();
      setSamples(Array.isArray(data.samples) ? data.samples : []);
    } catch (err) {
      setSamplesError(
        err instanceof Error
          ? err.message
          : 'Failed to load sample metadata. Please retry.'
      );
    } finally {
      setSamplesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSamples();
  }, [fetchSamples]);

  const handleDismissWelcome = () => {
    if (typeof window !== 'undefined') {
      markWelcomeSeen(window.sessionStorage);
    }
    setWelcomeOpen(false);
  };

  const handleReplayWelcome = () => {
    if (typeof window !== 'undefined') {
      resetWelcomeSeen(window.sessionStorage);
    }
    setWelcomeOpen(true);
  };

  const scrollToSection = (anchorId: string) => {
    if (typeof document === 'undefined') return;
    if (anchorId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.getElementById(anchorId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAskQuestionForTier = (
    serviceId: ServiceId,
    packageId: PackageTierId
  ) => {
    setInquiryService(serviceId);
    setInquiryPackage(packageId);
    scrollToSection('inquiry');
  };

  const handleSelectServiceForInquiry = (serviceId: ServiceId) => {
    setInquiryService(serviceId);
    setInquiryPackage('custom');
    scrollToSection('inquiry');
  };

  return (
    <div
      className="min-h-screen bg-[#08090B] text-[#E7E9ED] selection:bg-[#38BDF8]/30"
      data-welcome-active={welcomeOpen ? 'true' : 'false'}
    >
      {/* AtharWorld Glossy Black Glassmorphism Welcome Experience */}
      <WelcomeOverlay isOpen={welcomeOpen} onDismiss={handleDismissWelcome} />

      {/* Sticky 3-Zone Top Bar Navigation */}
      <SiteNav onNavigateSection={scrollToSection} />

      {/* Main Content */}
      <main id="main-content">
        <HeroSection onNavigateSection={scrollToSection} />

        <ServiceLanesSection />

        <SampleGallerySection
          samples={samples}
          isLoading={samplesLoading}
          error={samplesError}
          onRefresh={fetchSamples}
          onOpenAdmin={() => setAdminOpen(true)}
          onSelectServiceForInquiry={handleSelectServiceForInquiry}
        />

        <PricingSection onAskQuestionForTier={handleAskQuestionForTier} />

        <ProcessAboutFaqSection />

        <InquirySection
          selectedService={inquiryService}
          selectedPackage={inquiryPackage}
          onServiceChange={setInquiryService}
          onPackageChange={setInquiryPackage}
        />
      </main>

      {/* Contact Band & Footer */}
      <SiteFooter
        onNavigateSection={scrollToSection}
        onReplayWelcome={handleReplayWelcome}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Floating Pill-Glass WhatsApp Control */}
      <WhatsAppFloat />

      {/* Private Owner Admin Modal (/admin) */}
      <AdminModal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        samples={samples}
        onSamplesUpdated={fetchSamples}
      />
    </div>
  );
}
