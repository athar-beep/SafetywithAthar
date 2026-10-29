import React, { useEffect, useState } from 'react';
import {
  FileText,
  Download,
  Lock,
  RefreshCw,
  X,
  SlidersHorizontal,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import {
  getSampleDocumentPages,
  paginateSamples,
  GALLERY_PAGE_SIZE,
  type PortfolioSampleRecord,
  type SampleDocumentPage,
} from '../utils/sampleDocuments';
import { GlassPanel } from './ui/GlassPanel';
import { PillGlassButton } from './ui/PillGlassButton';
import { SectionHeading } from './ui/SectionHeading';

export type PortfolioSample = PortfolioSampleRecord;

export interface SampleGallerySectionProps {
  samples: PortfolioSample[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onOpenAdmin: () => void;
  onSelectServiceForInquiry: (service: 'cold_email' | 'hse_docs') => void;
}

/**
 * Miniature Always-Visible Page-1 Document / Configuration Sheet
 * Rendered directly inside each gallery card so visitors immediately see the
 * real document layout, table structure, and technical content without clicking.
 */
function MiniatureDocumentPreview({
  sample,
  firstPage,
}: {
  sample: PortfolioSample;
  firstPage: SampleDocumentPage;
}) {
  const isHse = sample.category === 'hse_docs';
  const [thumbFailed, setThumbFailed] = useState(false);

  if (sample.thumbnail_path && !thumbFailed) {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/12 bg-[#0A0D12]">
        <img
          src={sample.thumbnail_path}
          alt={`First page preview of ${sample.title}`}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setThumbFailed(true)}
          className="h-full w-full object-cover object-top"
        />
      </div>
    );
  }

  return (
    <div
      aria-label={`First page document preview of ${sample.title}`}
      className={[
        'relative flex h-full w-full flex-col justify-between overflow-hidden rounded-xl border p-2.5 sm:p-3.5 text-left select-none',
        isHse
          ? 'border-[#F97316]/28 bg-[linear-gradient(165deg,rgba(24,22,20,0.96)_0%,rgba(12,14,18,0.98)_100%)]'
          : 'border-[#38BDF8]/28 bg-[linear-gradient(165deg,rgba(16,23,32,0.96)_0%,rgba(10,13,18,0.98)_100%)]',
      ].join(' ')}
    >
      {/* Top Miniature Document Control Header */}
      <div>
        <div
          className={[
            'flex items-center justify-between gap-1.5 border-b pb-1.5',
            isHse ? 'border-[#F97316]/25' : 'border-[#38BDF8]/25',
          ].join(' ')}
        >
          <span
            className={[
              'font-mono-tabular text-[8px] sm:text-[9px] font-semibold tracking-wider truncate',
              isHse ? 'text-[#F97316]' : 'text-[#38BDF8]',
            ].join(' ')}
          >
            {firstPage.docCode}
          </span>
          <span className="font-mono-tabular text-[8px] sm:text-[9px] text-[#9BA3B0] shrink-0">
            {firstPage.revLabel}
          </span>
        </div>

        {/* Document Sheet Title */}
        <p className="mt-1.5 font-display text-[10px] sm:text-[11px] font-semibold leading-tight text-[#F1F3F7] line-clamp-1">
          {firstPage.sectionTitle}
        </p>

        {/* Miniature Structured Table Header */}
        <div className="mt-2 overflow-hidden rounded-lg border border-white/10 bg-[#07090C]/90">
          <div
            className={[
              'grid grid-cols-12 gap-1 px-2 py-1 font-mono-tabular text-[7.5px] sm:text-[8.5px] font-semibold border-b border-white/10',
              isHse
                ? 'bg-[#F97316]/[0.10] text-[#FDBA74]'
                : 'bg-[#38BDF8]/[0.10] text-[#7DD3FC]',
            ].join(' ')}
          >
            <span className="col-span-7 sm:col-span-4 truncate">{firstPage.headers[0]}</span>
            <span className="hidden sm:block sm:col-span-5 truncate">{firstPage.headers[1]}</span>
            <span className="col-span-5 sm:col-span-3 text-right truncate">{firstPage.headers[3]}</span>
          </div>

          {/* Miniature Table Rows (Real first-page rows) */}
          <div className="divide-y divide-white/[0.06]">
            {firstPage.rows.slice(0, 3).map((row, idx) => (
              <div
                key={`${firstPage.docCode}-r-${idx}`}
                className="grid grid-cols-12 items-center gap-1 px-2 py-1 text-[7.5px] sm:text-[8.5px] leading-tight"
              >
                <span className="col-span-7 sm:col-span-4 font-medium text-[#E7E9ED] truncate">
                  {row.col1}
                </span>
                <span className="hidden sm:block sm:col-span-5 font-mono-tabular text-[#B8BEC7] truncate">
                  {row.col2}
                </span>
                <span
                  className={[
                    'col-span-5 sm:col-span-3 text-right font-mono-tabular font-semibold truncate',
                    isHse ? 'text-[#FDBA74]' : 'text-[#7DD3FC]',
                  ].join(' ')}
                >
                  {row.badge || row.col3}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sheet Stamp */}
      <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-white/[0.08] font-mono-tabular text-[7.5px] sm:text-[8.5px] text-[#7D8592]">
        <span className="truncate">SafetyWithAthar · Controlled Sheet</span>
        <span className="shrink-0 text-[#B8BEC7]">Page 1</span>
      </div>
    </div>
  );
}

export function SampleGallerySection({
  samples,
  isLoading,
  error,
  onRefresh,
  onOpenAdmin,
  onSelectServiceForInquiry,
}: SampleGallerySectionProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'hse_docs' | 'cold_email'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedSample, setSelectedSample] = useState<PortfolioSample | null>(null);
  const [signedUrlState, setSignedUrlState] = useState<{
    loading: boolean;
    url: string | null;
    downloadUrl: string | null;
    expiresAt: string | null;
    note: string | null;
    error: string | null;
  }>({
    loading: false,
    url: null,
    downloadUrl: null,
    expiresAt: null,
    note: null,
    error: null,
  });

  const publishedSamples = samples
    .filter((s) => s.is_published && s.permission_confirmed)
    .sort((a, b) => a.sort_order - b.sort_order);

  const filteredSamples = publishedSamples.filter((sample) => {
    if (activeFilter === 'all') return true;
    return sample.category === activeFilter;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, samples.length]);

  const {
    visibleItems: paginatedSamples,
    totalPages,
    currentPage: safePage,
    totalItems,
  } = paginateSamples(filteredSamples, currentPage, GALLERY_PAGE_SIZE);

  useEffect(() => {
    if (!selectedSample) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedSample(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSample]);

  const handleOpenSampleModal = async (sample: PortfolioSample) => {
    setSelectedSample(sample);
    setSignedUrlState({
      loading: true,
      url: null,
      downloadUrl: null,
      expiresAt: null,
      note: null,
      error: null,
    });

    // GitHub Pages edition: the demo PDF is a static file bundled with the site.
    const staticUrl = `${import.meta.env.BASE_URL}samples/${encodeURIComponent(sample.id)}.pdf`;
    setSignedUrlState({
      loading: false,
      url: staticUrl,
      downloadUrl: staticUrl,
      expiresAt: null,
      note: 'Published demo sample — static document bundled with this site.',
      error: null,
    });
  };

  return (
    <section
      id="samples"
      aria-labelledby="samples-heading"
      className="py-16 sm:py-24 border-t border-white/10"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            indexLabel="02. Live Document & Configuration Gallery"
            title="Inspect Real First-Page Previews Immediately"
            subtitle="Every published Risk Assessment, JSA/JHA, Method Statement, and SPF/DKIM/DMARC configuration sheet is visible directly below. Click any document card to open the full multi-page reader or download the PDF."
          />

          {/* Interactive Filter Controls + Admin Manager Trigger */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div
              role="group"
              aria-label="Filter work samples by category"
              className="inline-flex rounded-full border border-white/12 bg-[#0D1015] p-1"
            >
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                data-testid="filter-all-samples"
                className={[
                  'min-h-[36px] rounded-full px-3.5 py-1 text-xs font-semibold transition-opacity cursor-pointer whitespace-nowrap',
                  activeFilter === 'all'
                    ? 'bg-white/15 text-[#E7E9ED] border border-white/25'
                    : 'text-[#B8BEC7] hover:text-[#E7E9ED]',
                ].join(' ')}
              >
                All ({publishedSamples.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('hse_docs')}
                data-testid="filter-hse-samples"
                className={[
                  'min-h-[36px] rounded-full px-3.5 py-1 text-xs font-semibold transition-opacity cursor-pointer whitespace-nowrap',
                  activeFilter === 'hse_docs'
                    ? 'bg-[#F97316]/25 text-[#E7E9ED] border border-[#F97316]/45'
                    : 'text-[#B8BEC7] hover:text-[#E7E9ED]',
                ].join(' ')}
              >
                HSE Docs
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('cold_email')}
                data-testid="filter-cold-email-samples"
                className={[
                  'min-h-[36px] rounded-full px-3.5 py-1 text-xs font-semibold transition-opacity cursor-pointer whitespace-nowrap',
                  activeFilter === 'cold_email'
                    ? 'bg-[#38BDF8]/25 text-[#E7E9ED] border border-[#38BDF8]/45'
                    : 'text-[#B8BEC7] hover:text-[#E7E9ED]',
                ].join(' ')}
              >
                Cold Email
              </button>
            </div>

            <PillGlassButton
              variant="subtle"
              size="sm"
              onClick={onOpenAdmin}
              data-testid="open-admin-panel-button"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Admin (/admin)</span>
            </PillGlassButton>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <GlassPanel className="mt-10 p-10 text-center">
            <p className="text-sm text-[#B8BEC7]">Loading published sample documents…</p>
          </GlassPanel>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <GlassPanel className="mt-10 p-8 text-center">
            <p className="text-sm text-[#E7E9ED]">{error}</p>
            <div className="mt-4 flex justify-center">
              <PillGlassButton variant="default" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Retry Loading Gallery</span>
              </PillGlassButton>
            </div>
          </GlassPanel>
        )}

        {/* Polished Empty State when no samples match or none published */}
        {!isLoading && !error && paginatedSamples.length === 0 && (
          <GlassPanel
            className="mt-10 p-10 sm:p-14 text-center"
            data-testid="samples-empty-state"
          >
            <FileText className="mx-auto h-8 w-8 text-[#7D8592]" aria-hidden="true" />
            <h3 className="mt-4 font-display text-xl font-bold text-[#E7E9ED]">
              New samples are being prepared. Please check back soon.
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-[#B8BEC7]">
              Only verified, permission-confirmed, and fully redacted demo documents are published in the public gallery.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <PillGlassButton
                variant="primary"
                size="md"
                onClick={() =>
                  onSelectServiceForInquiry(
                    activeFilter === 'cold_email' ? 'cold_email' : 'hse_docs'
                  )
                }
              >
                Request Scope Sample via Inquiry
              </PillGlassButton>
              <PillGlassButton variant="subtle" size="md" onClick={onOpenAdmin}>
                Open Admin Sample Manager
              </PillGlassButton>
            </div>
          </GlassPanel>
        )}

        {/* 3 Columns × 2 Rows Desktop / 2 Columns Mobile Compact Near-Square Gallery Grid */}
        {!isLoading && !error && paginatedSamples.length > 0 && (
          <>
            <div
              className="mt-9 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6 items-stretch"
              data-testid="samples-grid"
            >
              {paginatedSamples.map((sample) => {
                const isHse = sample.category === 'hse_docs';
                const accentColor = isHse ? 'orange' : 'blue';
                const accentText = isHse ? 'text-[#F97316]' : 'text-[#38BDF8]';
                const pages = getSampleDocumentPages(sample);
                const firstPage = pages[0];

                return (
                  <GlassPanel
                    key={sample.id}
                    accent={accentColor}
                    as="article"
                    data-testid={`sample-card-${sample.slug}`}
                    className="group flex flex-col justify-between p-3 sm:p-4 transition-transform duration-200 hover:-translate-y-1"
                  >
                    {/* Top: Always-Visible Miniature Document Page-1 Preview */}
                    <div>
                      <div
                        onClick={() => handleOpenSampleModal(sample)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleOpenSampleModal(sample);
                          }
                        }}
                        aria-label={`Open full document preview for ${sample.title}`}
                        className="block w-full aspect-[4/3] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-xl"
                        data-testid={`sample-preview-surface-${sample.slug}`}
                      >
                        <MiniatureDocumentPreview
                          sample={sample}
                          firstPage={firstPage}
                        />
                      </div>

                      {/* Compact Unboxed Category & Page Count Metadata */}
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-1 text-[10px] sm:text-xs text-[#7D8592]">
                        <span className={`font-semibold truncate ${accentText}`}>
                          {sample.sample_type}
                        </span>
                        <span className="font-mono-tabular shrink-0 text-[#B8BEC7]">
                          {sample.page_count ? `${sample.page_count} pp` : sample.file_type}
                        </span>
                      </div>

                      {/* Sample Title */}
                      <h3 className="mt-1 font-display text-xs sm:text-[15px] font-bold leading-snug text-[#E7E9ED] line-clamp-2">
                        <button
                          type="button"
                          onClick={() => handleOpenSampleModal(sample)}
                          className="text-left hover:underline focus-visible:outline-none cursor-pointer"
                        >
                          {sample.title}
                        </button>
                      </h3>
                    </div>

                    {/* Bottom: Public Demo Label & Compact Open Action */}
                    <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-[9.5px] sm:text-[11px] leading-tight text-[#9BA3B0] line-clamp-1">
                        {isHse
                          ? 'Public-source demo sample • Rev. 0 • For review only'
                          : `${sample.source_label} • Rev. 0`}
                      </p>

                      <PillGlassButton
                        variant={isHse ? 'orange' : 'blue'}
                        size="sm"
                        onClick={() => handleOpenSampleModal(sample)}
                        data-testid={`open-sample-${sample.slug}`}
                        className="min-h-[34px] px-3 py-1 text-[11px] w-full sm:w-auto"
                      >
                        <span>Open Sample</span>
                        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                      </PillGlassButton>
                    </div>
                  </GlassPanel>
                );
              })}
            </div>

            {/* Clean Pagination Controls when > 6 Samples Exist */}
            {totalPages > 1 && (
              <div
                className="mt-8 flex items-center justify-between border-t border-white/10 pt-5"
                data-testid="samples-pagination"
              >
                <p className="font-mono-tabular text-xs text-[#7D8592]">
                  Showing page {safePage} of {totalPages} ({totalItems} published samples)
                </p>

                <div className="flex items-center gap-2.5">
                  <PillGlassButton
                    variant="subtle"
                    size="sm"
                    disabled={safePage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    data-testid="samples-prev-page"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Previous</span>
                  </PillGlassButton>

                  <PillGlassButton
                    variant="subtle"
                    size="sm"
                    disabled={safePage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    data-testid="samples-next-page"
                  >
                    <span>More Samples</span>
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </PillGlassButton>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Full Multi-Page Scrollable Document Reader & PDF Viewer Modal */}
      {selectedSample && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sample-preview-modal-title"
          data-testid="sample-document-reader-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#08090B]/92 p-3 sm:p-6 backdrop-blur-2xl"
        >
          <GlassPanel
            elevated
            accent={selectedSample.category === 'hse_docs' ? 'orange' : 'blue'}
            className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden p-4 sm:p-7"
          >
            {/* Modal Top Header Bar */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4 shrink-0">
              <div>
                <p className="font-mono-tabular text-[11px] text-[#9BA3B0]">
                  {selectedSample.category === 'hse_docs'
                    ? 'Public-source demo sample • Rev. 0 • For review only'
                    : `${selectedSample.source_label} • ${selectedSample.revision_label}`}
                </p>
                <h3
                  id="sample-preview-modal-title"
                  className="mt-1 font-display text-lg sm:text-2xl font-bold text-[#E7E9ED]"
                >
                  {selectedSample.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {signedUrlState.downloadUrl && (
                  <PillGlassButton
                    href={signedUrlState.downloadUrl}
                    variant={selectedSample.category === 'hse_docs' ? 'orange' : 'blue'}
                    size="sm"
                    data-testid="modal-download-pdf-button"
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Download PDF</span>
                  </PillGlassButton>
                )}

                {signedUrlState.url && (
                  <PillGlassButton
                    href={signedUrlState.url}
                    variant="default"
                    size="sm"
                    data-testid="modal-open-pdf-tab-button"
                  >
                    <span>Open PDF Tab</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </PillGlassButton>
                )}

                <PillGlassButton
                  variant="subtle"
                  size="sm"
                  onClick={() => setSelectedSample(null)}
                  aria-label="Close sample reader"
                  data-testid="close-sample-reader-button"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                  <span>Close</span>
                </PillGlassButton>
              </div>
            </div>

            {/* Scrollable Document Pages Container */}
            <div className="mt-4 flex-1 overflow-y-auto space-y-6 pr-1">
              <p className="text-xs sm:text-sm leading-relaxed text-[#B8BEC7]">
                {selectedSample.description}
              </p>

              {/* Render All Scrollable Document Sheets */}
              {getSampleDocumentPages(selectedSample).map((page) => {
                const isHse = selectedSample.category === 'hse_docs';
                return (
                  <div
                    key={`${selectedSample.id}-page-${page.pageNumber}`}
                    className="rounded-2xl border border-white/14 bg-[#0B0E14] p-4 sm:p-6 shadow-inner"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <span
                          className={`font-mono-tabular text-xs font-semibold ${
                            isHse ? 'text-[#F97316]' : 'text-[#38BDF8]'
                          }`}
                        >
                          {page.docCode} · {page.revLabel}
                        </span>
                        <h4 className="mt-0.5 font-display text-sm sm:text-base font-bold text-[#E7E9ED]">
                          {page.sectionTitle}
                        </h4>
                      </div>
                      <span className="font-mono-tabular text-xs text-[#7D8592]">
                        Page {page.pageNumber}
                      </span>
                    </div>

                    <p className="mt-3 font-mono-tabular text-xs text-[#B8BEC7]">
                      {page.summaryNote}
                    </p>

                    {/* Responsive Document Table */}
                    <div className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-[#07090D]">
                      <table className="w-full min-w-[540px] text-left text-xs">
                        <thead>
                          <tr className="border-b border-white/10 bg-white/[0.04] font-mono-tabular text-[11px] text-[#E7E9ED]">
                            <th className="px-3.5 py-2.5 font-semibold">{page.headers[0]}</th>
                            <th className="px-3.5 py-2.5 font-semibold">{page.headers[1]}</th>
                            <th className="px-3.5 py-2.5 font-semibold">{page.headers[2]}</th>
                            <th className="px-3.5 py-2.5 font-semibold">{page.headers[3]}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.06] text-[#B8BEC7]">
                          {page.rows.map((row, rIdx) => (
                            <tr key={`${page.docCode}-row-${rIdx}`}>
                              <td className="px-3.5 py-2.5 font-medium text-[#E7E9ED]">
                                {row.col1}
                              </td>
                              <td className="px-3.5 py-2.5 font-mono-tabular text-xs">
                                {row.col2}
                              </td>
                              <td className="px-3.5 py-2.5 font-mono-tabular text-xs">
                                {row.col3}
                              </td>
                              <td className="px-3.5 py-2.5">
                                <span className="text-[#E7E9ED]">{row.col4}</span>
                                {row.badge && (
                                  <span
                                    className={`ml-2 font-mono-tabular text-[11px] font-semibold ${
                                      isHse ? 'text-[#FDBA74]' : 'text-[#7DD3FC]'
                                    }`}
                                  >
                                    · {row.badge}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <p className="mt-3 text-[11px] text-[#7D8592]">{page.footerNote}</p>
                  </div>
                );
              })}

              {/* Signed Storage Status Bar */}
              <div className="rounded-xl border border-white/10 bg-[#0D1015] p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs text-[#B8BEC7]">
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-[#38BDF8]" aria-hidden="true" />
                  <span>
                    {signedUrlState.loading
                      ? 'Generating signed document token…'
                      : signedUrlState.note ||
                        'Signed document preview active.'}
                  </span>
                </span>
                {signedUrlState.expiresAt && (
                  <span className="font-mono-tabular text-[11px] text-[#7D8592]">
                    Signed URL valid until {new Date(signedUrlState.expiresAt).toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <PillGlassButton
                variant="primary"
                size="md"
                onClick={() => {
                  const category = selectedSample.category;
                  setSelectedSample(null);
                  onSelectServiceForInquiry(category);
                }}
              >
                Request Custom Document in This Format
              </PillGlassButton>

              <PillGlassButton
                variant="subtle"
                size="md"
                onClick={() => setSelectedSample(null)}
              >
                Back to Gallery
              </PillGlassButton>
            </div>
          </GlassPanel>
        </div>
      )}
    </section>
  );
}
