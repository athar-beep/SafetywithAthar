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
import { portfolioSamples } from './data/samples';
import {
  getSampleDocumentPages,
  type PortfolioSampleRecord,
} from './utils/sampleDocuments';
import { restSelect, supabaseConfigured } from './lib/supabase';

export default function App() {
  const [welcomeOpen, setWelcomeOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return shouldShowWelcome({
      searchQuery: window.location.search,
      storage: window.sessionStorage,
    });
  });

  // Samples come from Supabase (portfolio_samples, published rows are public
  // via RLS) so the owner admin can manage the catalogue without a redeploy.
  // The bundled static set is the offline fallback and also supplies the rich
  // document_pages for the original samples (merged by slug).
  const bundledSamples = useCallback((): PortfolioSample[] => {
    return portfolioSamples
      .filter((s) => s.is_published && s.permission_confirmed)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((s) => ({ ...s, document_pages: getSampleDocumentPages(s) }));
  }, []);

  const [samples, setSamples] = useState<PortfolioSample[]>(() =>
    bundledSamples()
  );
  const [samplesLoading, setSamplesLoading] = useState<boolean>(false);
  const [samplesError, setSamplesError] = useState<string | null>(null);

  const fetchSamples = useCallback(async () => {
    if (!supabaseConfigured) {
      setSamples(bundledSamples());
      return;
    }
    setSamplesLoading(true);
    try {
      const rows = await restSelect<PortfolioSampleRecord>(
        'portfolio_samples',
        'select=*&is_published=eq.true&permission_confirmed=eq.true&order=sort_order.asc,created_at.asc'
      );
      if (!Array.isArray(rows) || rows.length === 0) {
        setSamples(bundledSamples());
        setSamplesError(null);
        return;
      }
      const pagesBySlug = new Map(
        portfolioSamples.map((s) => [s.slug, s.document_pages])
      );
      setSamples(
        rows.map((row) => ({
          ...row,
          file_type: row.file_type ?? 'PDF',
          document_pages:
            row.document_pages ?? pagesBySlug.get(row.slug) ?? undefined,
        }))
      );
      setSamplesError(null);
    } catch {
      // Keep whatever is already shown (bundled set on first load).
      setSamplesError(null);
    } finally {
      setSamplesLoading(false);
    }
  }, [bundledSamples]);

  useEffect(() => {
    void fetchSamples();
  }, [fetchSamples]);
  const [adminOpen, setAdminOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.location.pathname.endsWith('/admin') ||
      window.location.hash === '#admin'
    );
  });

  const [inquiryService, setInquiryService] = useState<ServiceId>('cold_email');
  const [inquiryPackage, setInquiryPackage] = useState<PackageTierId>('basic');

  // (fetchSamples is defined with the samples state above.)

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
