import React, { useState } from 'react';
import {
  X,
  Lock,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';
import { validateSampleInput } from '../utils/validation';
import type { PortfolioSample } from './SampleGallerySection';
import { GlassPanel } from './ui/GlassPanel';
import { PillGlassButton } from './ui/PillGlassButton';

export interface InquiryRecord {
  id: string;
  created_at: string;
  name: string;
  email: string;
  service: 'cold_email' | 'hse_docs';
  packageTier: string;
  message: string;
  pageSource: string;
  notification_status: 'sent' | 'failed_or_unconfigured';
  notification_error_code?: string | null;
}

export interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  samples: PortfolioSample[];
  onSamplesUpdated: () => void;
}

export function AdminModal({
  isOpen,
  onClose,
  samples,
  onSamplesUpdated,
}: AdminModalProps) {
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState('muhammadatharhse@gmail.com');
  const [passphraseInput, setPassphraseInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'samples' | 'create' | 'inquiries'>('samples');

  // New sample form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'hse_docs' | 'cold_email'>('hse_docs');
  const [sampleType, setSampleType] = useState('Risk Assessment');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [tagsText, setTagsText] = useState('5×5 Risk Matrix, Hierarchy of Controls, Rev. 0');
  const [pageCount, setPageCount] = useState('22');
  const [thumbnailDataUrl, setThumbnailDataUrl] = useState<string | null>(null);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(true);
  const [permissionConfirmed, setPermissionConfirmed] = useState(false);
  const [formFeedback, setFormFeedback] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);

  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);

  if (!isOpen) return null;

  const handleFileToDataUrl = (
    file: File | undefined,
    setter: (val: string | null) => void
  ) => {
    if (!file) {
      setter(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setter(typeof reader.result === 'string' ? reader.result : null);
    };
    reader.readAsDataURL(file);
  };

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.trim(),
          passphrase: passphraseInput,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.token) {
        setAuthError(data.error || 'Invalid owner credentials.');
        return;
      }
      setAdminToken(data.token);
      loadAdminInquiries(data.token);
    } catch {
      setAuthError('Could not connect to admin authentication endpoint.');
    }
  };

  const loadAdminInquiries = async (token: string) => {
    try {
      const res = await fetch('/api/admin/inquiries', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries ?? []);
      }
    } catch {
      // Ignore error
    }
  };

  const handleCreateSample = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);

    const validation = validateSampleInput({
      title,
      category,
      sample_type: sampleType,
      summary,
      description,
      is_published: isPublished,
      permission_confirmed: permissionConfirmed,
    });

    if (!validation.valid) {
      setFormFeedback({
        type: 'error',
        text: validation.error || 'Please review required sample fields.',
      });
      return;
    }

    try {
      const response = await fetch('/api/samples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          title,
          slug: validation.slug,
          category,
          sample_type: sampleType,
          summary,
          description: description || summary,
          tags: tagsText
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          page_count: Number(pageCount) || undefined,
          thumbnail_data_url: thumbnailDataUrl,
          pdf_data_url: pdfDataUrl,
          source_label:
            category === 'hse_docs'
              ? 'Public-source demo sample'
              : 'Sanitized technical sample',
          revision_label: 'Rev. 0 • For review only',
          is_published: isPublished,
          permission_confirmed: permissionConfirmed,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setFormFeedback({
          type: 'error',
          text: data.error || 'Failed to save sample.',
        });
        return;
      }

      setTitle('');
      setSummary('');
      setDescription('');
      setThumbnailDataUrl(null);
      setPdfDataUrl(null);
      setPermissionConfirmed(false);
      setFormFeedback({
        type: 'success',
        text: 'Sample created and synced with the live public gallery.',
      });
      onSamplesUpdated();
      setActiveTab('samples');
    } catch {
      setFormFeedback({
        type: 'error',
        text: 'Network error while saving sample.',
      });
    }
  };

  const handleTogglePublish = async (sample: PortfolioSample) => {
    if (!adminToken) return;
    try {
      await fetch(`/api/samples/${encodeURIComponent(sample.id)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          is_published: !sample.is_published,
          permission_confirmed: true,
        }),
      });
      onSamplesUpdated();
    } catch {
      // Ignore
    }
  };

  const handleDeleteSample = async (sampleId: string) => {
    if (!adminToken) return;
    try {
      await fetch(`/api/samples/${encodeURIComponent(sampleId)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      onSamplesUpdated();
    } catch {
      // Ignore
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-heading"
      data-testid="admin-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#08090B]/92 p-4 backdrop-blur-2xl"
    >
      <GlassPanel
        elevated
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto p-6 sm:p-8"
      >
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <Lock className="h-4 w-4 text-[#38BDF8]" aria-hidden="true" />
            <h2
              id="admin-modal-heading"
              className="font-display text-xl font-bold text-[#E7E9ED]"
            >
              SafetyWithAthar — Private Owner Admin (/admin)
            </h2>
          </div>

          <PillGlassButton
            variant="subtle"
            size="sm"
            onClick={onClose}
            aria-label="Close admin panel"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span>Close</span>
          </PillGlassButton>
        </div>

        {!adminToken ? (
          <form onSubmit={handleAdminSignIn} className="mt-6 max-w-md mx-auto space-y-4 py-4">
            <p className="text-xs sm:text-sm leading-relaxed text-[#B8BEC7]">
              Restricted to the allowlisted owner account (`muhammadatharhse@gmail.com`). No public visitor registration exists. In production, authenticate via Supabase Auth + `admin_allowlist` RLS policy.
            </p>

            <div>
              <label
                htmlFor="admin-email-input"
                className="block text-xs font-semibold text-[#E7E9ED]"
              >
                Authorized Owner Email
              </label>
              <input
                id="admin-email-input"
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="mt-1.5 w-full min-h-[44px] rounded-xl border border-white/15 bg-[#08090B] px-4 py-2 text-sm text-[#E7E9ED]"
              />
            </div>

            <div>
              <label
                htmlFor="admin-passphrase-input"
                className="block text-xs font-semibold text-[#E7E9ED]"
              >
                Admin Passphrase (leave blank or enter configured passphrase in local preview)
              </label>
              <input
                id="admin-passphrase-input"
                type="password"
                value={passphraseInput}
                onChange={(e) => setPassphraseInput(e.target.value)}
                placeholder="Enter owner passphrase (optional in preview)"
                className="mt-1.5 w-full min-h-[44px] rounded-xl border border-white/15 bg-[#08090B] px-4 py-2 text-sm text-[#E7E9ED]"
              />
            </div>

            {authError && (
              <p role="alert" className="text-xs text-amber-300">
                {authError}
              </p>
            )}

            <div className="pt-2">
              <PillGlassButton
                type="submit"
                variant="primary"
                size="md"
                data-testid="admin-signin-submit"
              >
                Sign In to Owner Dashboard
              </PillGlassButton>
            </div>
          </form>
        ) : (
          <div className="mt-6 space-y-6">
            {/* Admin Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <PillGlassButton
                  variant={activeTab === 'samples' ? 'primary' : 'subtle'}
                  size="sm"
                  onClick={() => setActiveTab('samples')}
                >
                  Samples ({samples.length})
                </PillGlassButton>
                <PillGlassButton
                  variant={activeTab === 'create' ? 'primary' : 'subtle'}
                  size="sm"
                  onClick={() => {
                    setFormFeedback(null);
                    setActiveTab('create');
                  }}
                  data-testid="admin-tab-create-sample"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Add Work Sample</span>
                </PillGlassButton>
                <PillGlassButton
                  variant={activeTab === 'inquiries' ? 'primary' : 'subtle'}
                  size="sm"
                  onClick={() => {
                    loadAdminInquiries(adminToken);
                    setActiveTab('inquiries');
                  }}
                >
                  Saved Inquiries ({inquiries.length})
                </PillGlassButton>
              </div>

              <span className="text-xs text-[#7D8592]">
                Signed in as {emailInput}
              </span>
            </div>

            { formFeedback && (
              <div
                role="status"
                className={`rounded-xl border p-3.5 text-xs flex items-center gap-2 ${
                  formFeedback.type === 'error'
                    ? 'border-amber-400/35 bg-amber-500/10 text-amber-200'
                    : 'border-emerald-400/35 bg-emerald-500/10 text-emerald-200'
                }`}
              >
                {formFeedback.type === 'error' ? (
                  <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                )}
                <span>{formFeedback.text}</span>
              </div>
            )}

            {/* Tab 1: Existing Samples Management */}
            {activeTab === 'samples' && (
              <div className="space-y-3">
                <p className="text-xs text-[#B8BEC7]">
                  Publish, unpublish, or remove samples below. Changes appear immediately in the public gallery without editing code.
                </p>

                {samples.map((sample) => (
                  <div
                    key={sample.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#08090B]/70 p-4"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#7D8592]">
                        <span className="font-semibold text-[#E7E9ED]">
                          {sample.category === 'hse_docs' ? 'HSE Docs' : 'Cold Email'}
                        </span>
                        <span>·</span>
                        <span>{sample.sample_type}</span>
                        <span>·</span>
                        <span
                          className={
                            sample.is_published ? 'text-emerald-400' : 'text-amber-300'
                          }
                        >
                          {sample.is_published ? 'Published' : 'Draft / Unpublished'}
                        </span>
                      </div>
                      <h3 className="mt-1 font-display text-base font-bold text-[#E7E9ED]">
                        {sample.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-[#B8BEC7]">{sample.summary}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <PillGlassButton
                        variant="default"
                        size="sm"
                        onClick={() => handleTogglePublish(sample)}
                        data-testid={`toggle-publish-${sample.slug}`}
                      >
                        {sample.is_published ? (
                          <>
                            <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Unpublish</span>
                          </>
                        ) : (
                          <>
                            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Publish</span>
                          </>
                        )}
                      </PillGlassButton>

                      <PillGlassButton
                        variant="subtle"
                        size="sm"
                        onClick={() => handleDeleteSample(sample.id)}
                        aria-label={`Delete sample ${sample.title}`}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-rose-400" aria-hidden="true" />
                        <span>Delete</span>
                      </PillGlassButton>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Create New Sample */}
            {activeTab === 'create' && (
              <form onSubmit={handleCreateSample} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="sample-title"
                      className="block text-xs font-semibold text-[#E7E9ED]"
                    >
                      Sample Title *
                    </label>
                    <input
                      id="sample-title"
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Deep Excavation & Trenching Risk Assessment"
                      className="mt-1 w-full min-h-[42px] rounded-xl border border-white/15 bg-[#08090B] px-3.5 py-2 text-sm text-[#E7E9ED]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="sample-category"
                      className="block text-xs font-semibold text-[#E7E9ED]"
                    >
                      Service Category *
                    </label>
                    <select
                      id="sample-category"
                      value={category}
                      onChange={(e) =>
                        setCategory(e.target.value as 'hse_docs' | 'cold_email')
                      }
                      className="mt-1 w-full min-h-[42px] rounded-xl border border-white/15 bg-[#08090B] px-3.5 py-2 text-sm text-[#E7E9ED]"
                    >
                      <option value="hse_docs">HSE Documentation</option>
                      <option value="cold_email">Cold Email Setup</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="sample-type"
                      className="block text-xs font-semibold text-[#E7E9ED]"
                    >
                      Document / Sample Type *
                    </label>
                    <input
                      id="sample-type"
                      type="text"
                      required
                      value={sampleType}
                      onChange={(e) => setSampleType(e.target.value)}
                      placeholder="Risk Assessment, JSA/JHA, Setup Checklist..."
                      className="mt-1 w-full min-h-[42px] rounded-xl border border-white/15 bg-[#08090B] px-3.5 py-2 text-sm text-[#E7E9ED]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="sample-pages"
                      className="block text-xs font-semibold text-[#E7E9ED]"
                    >
                      Page Count (Optional)
                    </label>
                    <input
                      id="sample-pages"
                      type="number"
                      min={1}
                      max={200}
                      value={pageCount}
                      onChange={(e) => setPageCount(e.target.value)}
                      className="mt-1 w-full min-h-[42px] rounded-xl border border-white/15 bg-[#08090B] px-3.5 py-2 text-sm text-[#E7E9ED]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="sample-summary"
                    className="block text-xs font-semibold text-[#E7E9ED]"
                  >
                    Public Card Summary (min 15 chars) *
                  </label>
                  <textarea
                    id="sample-summary"
                    rows={2}
                    required
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Concise description of the structure, matrix, or configuration demonstrated..."
                    className="mt-1 w-full rounded-xl border border-white/15 bg-[#08090B] px-3.5 py-2 text-sm text-[#E7E9ED]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="sample-tags"
                    className="block text-xs font-semibold text-[#E7E9ED]"
                  >
                    Tags (comma-separated)
                  </label>
                  <input
                    id="sample-tags"
                    type="text"
                    value={tagsText}
                    onChange={(e) => setTagsText(e.target.value)}
                    className="mt-1 w-full min-h-[42px] rounded-xl border border-white/15 bg-[#08090B] px-3.5 py-2 text-sm text-[#E7E9ED]"
                  />
                </div>

                {/* Optional PDF & Thumbnail Upload Inputs */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="sample-pdf-upload"
                      className="block text-xs font-semibold text-[#E7E9ED]"
                    >
                      Upload Sample PDF (Optional — auto-generates sheet if omitted)
                    </label>
                    <input
                      id="sample-pdf-upload"
                      type="file"
                      accept="application/pdf"
                      onChange={(e) =>
                        handleFileToDataUrl(e.target.files?.[0], setPdfDataUrl)
                      }
                      className="mt-1 w-full rounded-xl border border-white/15 bg-[#08090B] px-3 py-2 text-xs text-[#B8BEC7]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="sample-thumb-upload"
                      className="block text-xs font-semibold text-[#E7E9ED]"
                    >
                      First-Page Preview Image (Optional — renders live table sheet if omitted)
                    </label>
                    <input
                      id="sample-thumb-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(e) =>
                        handleFileToDataUrl(e.target.files?.[0], setThumbnailDataUrl)
                      }
                      className="mt-1 w-full rounded-xl border border-white/15 bg-[#08090B] px-3 py-2 text-xs text-[#B8BEC7]"
                    />
                  </div>
                </div>

                {/* Mandatory Redaction & Ownership Confirmation */}
                <div className="rounded-xl border border-[#F97316]/30 bg-[#F97316]/[0.06] p-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#F97316]">
                    <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                    <span>Mandatory Redaction &amp; Ownership Gate</span>
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-[#E7E9ED] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissionConfirmed}
                      onChange={(e) => setPermissionConfirmed(e.target.checked)}
                      data-testid="sample-permission-checkbox"
                      className="mt-0.5 h-4 w-4 rounded border-white/25 bg-[#08090B]"
                    />
                    <span>
                      I confirm that I own this work sample or hold explicit permission to share it, and I have redacted all client/site names, signatures, IDs, email addresses, domains, IPs, and confidential project records.
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-[#B8BEC7] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="h-4 w-4 rounded border-white/25 bg-[#08090B]"
                    />
                    <span>Publish immediately to public gallery</span>
                  </label>
                </div>

                <div className="pt-2">
                  <PillGlassButton
                    type="submit"
                    variant="primary"
                    size="md"
                    data-testid="save-sample-button"
                  >
                    Save &amp; Sync Sample
                  </PillGlassButton>
                </div>
              </form>
            )}

            {/* Tab 3: Saved Inquiries Log */}
            {activeTab === 'inquiries' && (
              <div className="space-y-3">
                {inquiries.length === 0 ? (
                  <p className="text-xs text-[#7D8592]">
                    No inquiries submitted in this session yet.
                  </p>
                ) : (
                  inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="rounded-xl border border-white/10 bg-[#08090B]/70 p-4 text-xs space-y-1.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-bold text-[#E7E9ED]">
                          {inq.name} ({inq.email})
                        </span>
                        <span className="font-mono-tabular text-[#7D8592]">
                          {inq.service} · {inq.packageTier} · Email status: {inq.notification_status}
                        </span>
                      </div>
                      <p className="text-[#B8BEC7]">{inq.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
