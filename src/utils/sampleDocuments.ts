export interface SampleDocumentTableRow {
  col1: string;
  col2: string;
  col3: string;
  col4: string;
  badge?: string;
}

export interface SampleDocumentPage {
  pageNumber: number;
  sectionTitle: string;
  docCode: string;
  revLabel: string;
  summaryNote: string;
  headers: [string, string, string, string];
  rows: SampleDocumentTableRow[];
  footerNote: string;
}

export interface PortfolioSampleRecord {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  category: 'hse_docs' | 'cold_email';
  sample_type: string;
  summary: string;
  description: string;
  tags: string[];
  storage_path: string | null;
  thumbnail_path: string | null;
  file_type: string;
  source_label: string;
  revision_label: string;
  sort_order: number;
  is_published: boolean;
  permission_confirmed: boolean;
  page_count?: number;
  highlights?: string[];
  document_pages?: SampleDocumentPage[];
}

export const GALLERY_PAGE_SIZE = 6;

export function paginateSamples<T>(
  items: T[],
  page: number,
  pageSize: number = GALLERY_PAGE_SIZE
): {
  visibleItems: T[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
} {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleItems = items.slice(startIndex, startIndex + pageSize);

  return {
    visibleItems,
    totalPages,
    currentPage,
    totalItems,
  };
}

/**
 * Builds structured document pages for a sample so both the always-visible
 * miniature Page-1 card preview and the full scrollable multi-page document
 * reader display authentic document tables and configurations.
 */
export function getSampleDocumentPages(
  sample: PortfolioSampleRecord
): SampleDocumentPage[] {
  if (Array.isArray(sample.document_pages) && sample.document_pages.length > 0) {
    return sample.document_pages;
  }

  const isHse = sample.category === 'hse_docs';
  const docCode = `SWA-${sample.category === 'hse_docs' ? 'HSE' : 'DNS'}-${sample.slug
    .slice(0, 8)
    .toUpperCase()}`;

  if (isHse) {
    return [
      {
        pageNumber: 1,
        sectionTitle: `${sample.sample_type} — Control Matrix & Hold Points`,
        docCode,
        revLabel: 'Rev. 0 · Public-Source Demo',
        summaryNote: sample.summary,
        headers: ['Activity / Task Step', 'Identified Hazard', 'Initial Risk', 'Control Measures & Hold Point'],
        rows: [
          {
            col1: '01. Site Mobilization & Permit Verification',
            col2: 'Unverified underground utilities / live services',
            col3: '15 (High)',
            col4: 'PTW issue, calibrated CAT & Genny scan, trial pit hand-dig [HOLD POINT]',
            badge: 'Residual: 4 (Low)',
          },
          {
            col1: '02. Plant & Lifting Equipment Setup',
            col2: 'Ground bearing failure / outrigger instability',
            col3: '16 (High)',
            col4: 'Third-party load test cert check, spreader mats, banksman control',
            badge: 'Residual: 4 (Low)',
          },
          {
            col1: '03. Primary Work Package Execution',
            col2: 'Line-of-fire impact / simultaneous operations',
            col3: '12 (Med)',
            col4: 'Hard barricading, exclusion zone signage, toolbox talk sign-off',
            badge: 'Residual: 3 (Low)',
          },
          {
            col1: '04. Emergency Response & Handover',
            col2: 'Delayed medical / rescue retrieval',
            col3: '10 (Med)',
            col4: 'Dedicated rescue standby kit, Highfield L3 first aider on shift',
            badge: 'Residual: 2 (Low)',
          },
        ],
        footerNote:
          'Public-source demo sample • Rev. 0 • For review only. Missing site-specific parameters are marked [HOLD POINT].',
      },
      {
        pageNumber: 2,
        sectionTitle: '5×5 Risk Scoring Matrix & Sign-Off Register',
        docCode,
        revLabel: 'Rev. 0 · Page 2',
        summaryNote:
          'Hierarchy of Controls: 1. Elimination · 2. Substitution · 3. Engineering Controls · 4. Administrative Controls · 5. PPE.',
        headers: ['Control Tier', 'Required Verification Evidence', 'Responsible Role', 'Hold Point Status'],
        rows: [
          {
            col1: 'Engineering Controls',
            col2: 'Physical guarding, shoring, or isolation lock-out/tag-out (LOTO)',
            col3: 'Site Engineer / Supervisor',
            col4: 'Mandatory Pre-Start Check',
            badge: 'Verified',
          },
          {
            col1: 'Administrative Controls',
            col2: 'Approved Method Statement briefing & daily TBT attendance sheet',
            col3: 'HSE Officer',
            col4: 'Daily Shift Record',
            badge: 'Controlled',
          },
          {
            col1: 'Client / Site HSE Authority Approval',
            col2: 'Formal review and sign-off prior to field execution',
            col3: 'Client HSE Authority',
            col4: '[HOLD POINT — SIGN-OFF]',
            badge: 'Required',
          },
        ],
        footerNote:
          'Prepared remotely by SafetyWithAthar. Professional draft for review and approval by the client/site HSE authority.',
      },
    ];
  }

  return [
    {
      pageNumber: 1,
      sectionTitle: `${sample.sample_type} — DNS & Authentication Record Sheet`,
      docCode,
      revLabel: 'Rev. 0 · Sanitized Config',
      summaryNote: sample.summary,
      headers: ['Record Type / Host', 'Configured Value (Sanitized)', 'Alignment Check', 'Status'],
      rows: [
        {
          col1: 'TXT  @  (SPF)',
          col2: 'v=spf1 include:_spf.google.com ~all',
          col3: '3 / 10 DNS lookups (Zero duplicate TXT)',
          col4: 'Aligned · PASS',
          badge: 'SPF PASS',
        },
        {
          col1: 'TXT  google._domainkey',
          col2: 'v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...',
          col3: '2048-bit RSA cryptographic header signature',
          col4: 'Aligned · PASS',
          badge: 'DKIM 2048',
        },
        {
          col1: 'TXT  _dmarc',
          col2: 'v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc@domain.example; adkim=s; aspf=s',
          col3: 'Strict identifier alignment enabled',
          col4: 'Enforced · PASS',
          badge: 'DMARC STRICT',
        },
        {
          col1: 'CNAME  track',
          col2: 'custom-tracking.sending-platform.example',
          col3: 'SSL verified custom tracking subdomain',
          col4: 'HTTPS Active',
          badge: 'SSL OK',
        },
      ],
      footerNote:
        'Sanitized public demonstration checklist • Rev. 0 • No client domains, credentials, or private IPs exposed.',
    },
    {
      pageNumber: 2,
      sectionTitle: '21-Day Mailbox Warm-Up & Campaign Readiness Protocol',
      docCode,
      revLabel: 'Rev. 0 · Page 2',
      summaryNote:
        'Gradual sending volume ramp-up schedule and technical pre-flight checks to protect domain reputation.',
      headers: ['Phase / Days', 'Daily Volume / Mailbox', 'Reply Ratio Target', 'Technical Gate'],
      rows: [
        {
          col1: 'Days 01 – 07 (Baseline)',
          col2: '10 → 20 emails / day (warm-up peer network)',
          col3: '30% – 35% automated + manual placement checks',
          col4: 'Verify 0% bounce & header auth',
          badge: 'Week 1',
        },
        {
          col1: 'Days 08 – 14 (Ramp)',
          col2: '20 → 35 emails / day (mixed plain-text)',
          col3: 'Maintain >25% engagement, monitor Postmaster Tools',
          col4: 'Blacklist & MX health check',
          badge: 'Week 2',
        },
        {
          col1: 'Days 15 – 21 (Production)',
          col2: '35 → 45 max total daily sends per mailbox',
          col3: 'Plain-text signature, custom unsubscribe header active',
          col4: 'Ready for controlled campaign',
          badge: 'Week 3',
        },
      ],
      footerNote:
        'Note: Proper SPF/DKIM/DMARC authentication and warm-up improve sending readiness but never guarantee inbox placement.',
    },
  ];
}
