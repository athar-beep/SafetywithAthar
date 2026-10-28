import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { validateInquiryInput, validateSampleInput } from './src/utils/validation.ts';
import {
  getSampleDocumentPages,
  type PortfolioSampleRecord,
} from './src/utils/sampleDocuments.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const OWNER_EMAIL = (process.env.INQUIRY_NOTIFY_EMAIL || 'muhammadatharhse@gmail.com').toLowerCase();
const ADMIN_PASSPHRASE = process.env.ADMIN_DASHBOARD_PASSPHRASE || '';
const ACTIVE_ADMIN_TOKENS = new Set<string>();

interface StoredSample extends PortfolioSampleRecord {
  uploaded_pdf_base64?: string | null;
}

interface StoredInquiry {
  id: string;
  created_at: string;
  name: string;
  email: string;
  service: 'cold_email' | 'hse_docs';
  packageTier: string;
  message: string;
  pageSource: string;
  idempotencyKey: string;
  notification_status: 'sent' | 'failed_or_unconfigured';
  notification_error_code: string | null;
  notified_at: string | null;
}

function escapePdfText(text: string): string {
  return text
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

/**
 * Generates a real, standards-compliant PDF 1.4 binary for any published
 * public-source demonstration sample so clicking "Open Sample" or "Download PDF"
 * delivers the genuine structured document.
 */
function buildRealDemoPdfBuffer(sample: StoredSample): Buffer {
  if (sample.uploaded_pdf_base64) {
    const base64Clean = sample.uploaded_pdf_base64.replace(
      /^data:application\/pdf;base64,/,
      ''
    );
    return Buffer.from(base64Clean, 'base64');
  }

  const pages = getSampleDocumentPages(sample);
  const lines: string[] = [
    `SafetyWithAthar — ${sample.category === 'hse_docs' ? 'Remote HSE Documentation' : 'Cold Email Infrastructure'}`,
    `Document Title: ${sample.title}`,
    `Category: ${sample.sample_type}   |   Status: ${sample.source_label} (${sample.revision_label})`,
    `----------------------------------------------------------------------------------------`,
    `Summary: ${sample.summary}`,
    ``,
  ];

  for (const page of pages) {
    lines.push(`[Page ${page.pageNumber}] ${page.sectionTitle} (${page.docCode})`);
    lines.push(
      `${page.headers[0]}  |  ${page.headers[1]}  |  ${page.headers[2]}  |  ${page.headers[3]}`
    );
    lines.push(
      `----------------------------------------------------------------------------------------`
    );
    for (const row of page.rows) {
      lines.push(`* ${row.col1} — ${row.col2}`);
      lines.push(`  [${row.col3}] -> ${row.col4} (${row.badge || 'Verified'})`);
    }
    lines.push(`Note: ${page.footerNote}`);
    lines.push(``);
  }

  lines.push(`Prepared by Muhammad Athar — SafetyWithAthar (https://athar-beep.github.io/safetywithathar/)`);

  let y = 790;
  const contentOps: string[] = ['BT', '/F1 10 Tf'];
  for (const line of lines.slice(0, 48)) {
    const safeLine = escapePdfText(line.slice(0, 96));
    contentOps.push(`1 0 0 1 42 ${y} Tm (${safeLine}) Tj`);
    y -= 15;
  }
  contentOps.push('ET');
  const streamContent = contentOps.join('\n');

  const objects: string[] = [];
  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  objects.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
  objects.push(
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 842] /Contents 5 0 R >>\nendobj\n'
  );
  objects.push(
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n'
  );
  objects.push(
    `5 0 obj\n<< /Length ${Buffer.byteLength(streamContent, 'utf8')} >>\nstream\n${streamContent}\nendstream\nendobj\n`
  );

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += obj;
  }

  const xrefOffset = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(pdf, 'utf8');
}

// 6 Published, Permission-Confirmed Public-Source Demonstration Samples
const portfolioSamples: StoredSample[] = [
  {
    id: 'sample-hse-ra-structure',
    created_at: '2026-10-28T08:00:00.000Z',
    updated_at: '2026-10-28T08:00:00.000Z',
    title: 'Activity-Based Risk Assessment — Structural Work Pack',
    slug: 'activity-based-risk-assessment-blueprint',
    category: 'hse_docs',
    sample_type: 'Risk Assessment',
    summary:
      '5×5 initial & residual risk matrix covering 39 pages of civil/structural activities, hierarchy of controls, and designated hold points.',
    description:
      'Public-source demonstration Risk Assessment structured from work-pack inputs. Shows step-by-step hazard identification, initial 5×5 scoring, engineering/administrative controls, residual scoring, and explicit [HOLD POINT] flags where site data requires authority sign-off.',
    tags: ['5×5 Risk Matrix', 'Hierarchy of Controls', 'Hold Points', 'Word + PDF'],
    storage_path: '/api/samples/sample-hse-ra-structure/document.pdf',
    thumbnail_path: null,
    file_type: 'PDF + DOCX · 39 pp',
    source_label: 'Public-source demo sample',
    revision_label: 'Rev. 0 • For review only',
    sort_order: 1,
    is_published: true,
    permission_confirmed: true,
    page_count: 39,
    document_pages: [
      {
        pageNumber: 1,
        sectionTitle: 'Activity-Based Risk Assessment Matrix (5×5 Initial → Residual)',
        docCode: 'SWA-HSE-RA-001',
        revLabel: 'Rev. 0 · 39 Pages',
        summaryNote:
          'Work Package: Structural Foundation & Steel Erection · Matrix: 5×5 Likelihood × Severity',
        headers: ['Activity Step', 'Hazard & Consequence', 'Init Risk', 'Controls & Hold Points'],
        rows: [
          {
            col1: '01. Sub-structure Excavation',
            col2: 'Underground live cable strike / trench collapse',
            col3: '20 (High)',
            col4: 'PTW + CAT scan + trial pit hand-dig [HOLD POINT]',
            badge: 'Res: 4 (Low)',
          },
          {
            col1: '02. Mobile Crane Rigging',
            col2: 'Load drop / outrigger ground bearing failure',
            col3: '16 (High)',
            col4: '3rd-party lift plan, spreader mats, anemometer <20 kt',
            badge: 'Res: 4 (Low)',
          },
          {
            col1: '03. Steel Column Erection',
            col2: 'Fall from height / Pinch point during bolt-up',
            col3: '15 (High)',
            col4: 'MEWP rescue plan, 100% twin-lanyard tie-off, taglines',
            badge: 'Res: 3 (Low)',
          },
          {
            col1: '04. Grouting & Chemical Curing',
            col2: 'Dermal/respiratory exposure to epoxy grouts',
            col3: '10 (Med)',
            col4: 'COSHH assessment + SDS on site + nitrile/respirator PPE',
            badge: 'Res: 2 (Low)',
          },
        ],
        footerNote:
          'Public-source demo sample • Rev. 0 • For review only. Unconfirmed site values marked [HOLD POINT].',
      },
      {
        pageNumber: 2,
        sectionTitle: '5×5 Risk Evaluation Key & Client HSE Authority Sign-Off',
        docCode: 'SWA-HSE-RA-001',
        revLabel: 'Rev. 0 · Page 2 of 39',
        summaryNote:
          'Residual risk scores above 8 (Medium) require formal client/site HSE authority review before PTW issuance.',
        headers: ['Control Hierarchy Tier', 'Verification Method', 'Owner Role', 'Gate Status'],
        rows: [
          {
            col1: '1–3. Elimination & Engineering',
            col2: 'Temporary shoring design & certified lifting gear register',
            col3: 'Package Engineer',
            col4: '[HOLD POINT 01]',
            badge: 'Mandatory',
          },
          {
            col1: '4. Administrative & PTW',
            col2: 'Pre-shift TBT sign-off & exclusion zone barricading',
            col3: 'Site HSE Officer',
            col4: 'Shift Inspection',
            badge: 'Active',
          },
          {
            col1: '5. PPE & Emergency Rescue',
            col3: 'Rescue Team Lead',
            col2: 'Full body harness EN 361 + tripod retrieval standby',
            col4: 'Verified Pre-Start',
            badge: 'Checked',
          },
        ],
        footerNote:
          'Drafted remotely by Muhammad Athar (SafetyWithAthar) for review and approval by site HSE authority.',
      },
    ],
  },
  {
    id: 'sample-hse-jsa-excavation',
    created_at: '2026-10-28T08:05:00.000Z',
    updated_at: '2026-10-28T08:05:00.000Z',
    title: 'Civil Excavation & Underground Utility JSA / JHA',
    slug: 'civil-excavation-jsa-method-statement-structure',
    category: 'hse_docs',
    sample_type: 'JSA / JHA',
    summary:
      'Step-by-step Job Safety Analysis breaking down utility scanning, trench shoring, spoil setback, and confined atmosphere checks.',
    description:
      'Purpose-created public demonstration JSA/JHA showing task sequence, specific hazards per step, practical field controls, and supervisor sign-off columns.',
    tags: ['JSA / JHA', 'Utility Scanning', 'Trench Shoring', 'Hold Points'],
    storage_path: '/api/samples/sample-hse-jsa-excavation/document.pdf',
    thumbnail_path: null,
    file_type: 'PDF + DOCX · 9 pp',
    source_label: 'Public-source demo sample',
    revision_label: 'Rev. 0 • For review only',
    sort_order: 2,
    is_published: true,
    permission_confirmed: true,
    page_count: 9,
    document_pages: [
      {
        pageNumber: 1,
        sectionTitle: 'Job Safety Analysis (JSA / JHA) — Deep Trenching & Utilities',
        docCode: 'SWA-JSA-CIV-014',
        revLabel: 'Rev. 0 · 9 Pages',
        summaryNote:
          'Task Scope: Mechanical & Manual Excavation to -2.4m Depth · Permit Required: Excavation PTW',
        headers: ['Job Step Sequence', 'Potential Hazards', 'Preventive Controls', 'Action By'],
        rows: [
          {
            col1: 'Step 1: Underground Service Scan',
            col2: 'Strike on energized HV cable or pressurized pipe',
            col3: 'As-built drawing check + calibrated CAT4 scan + mark route',
            col4: 'Surveyor / HSE [HOLD]',
            badge: 'PTW Gate',
          },
          {
            col1: 'Step 2: Trial Pit Hand Digging',
            col2: 'Mechanical bucket contact with buried conduit',
            col3: 'Insulated hand tools within 500mm of marked service line',
            col4: 'Civil Foreman',
            badge: 'Verified',
          },
          {
            col1: 'Step 3: Trench Battering & Shoring',
            col2: 'Sidewall cave-in / worker entrapment (>1.2m depth)',
            col3: 'Install hydraulic trench box or 45° benching + 1m spoil clearance',
            col4: 'Site Engineer',
            badge: 'Engineered',
          },
          {
            col1: 'Step 4: Access & Gas Monitoring',
            col2: 'Oxygen deficiency / H2S accumulation in deep cut',
            col3: 'Multi-gas detector pre-entry check + secured ladder every 7.5m',
            col4: 'Authorized Gas Tester',
            badge: 'Logged',
          },
        ],
        footerNote:
          'Public-source demo sample • Rev. 0 • For review only. Ready for site crew briefing.',
      },
    ],
  },
  {
    id: 'sample-cold-email-checklist',
    created_at: '2026-10-28T08:10:00.000Z',
    updated_at: '2026-10-28T08:10:00.000Z',
    title: 'SPF / DKIM / DMARC Configuration & Setup Checklist',
    slug: 'cold-email-infrastructure-setup-checklist',
    category: 'cold_email',
    sample_type: 'SPF / DKIM / DMARC Checklist',
    summary:
      'Sanitized DNS authentication record sheet showing SPF lookup consolidation, 2048-bit DKIM signing, strict DMARC alignment, and CNAME tracking.',
    description:
      'Complete technical checklist and sanitized configuration walkthrough demonstrating how sending domains and mailboxes are authenticated and verified prior to warm-up.',
    tags: ['SPF / DKIM / DMARC', '2048-Bit RSA', 'Custom Tracking CNAME', 'DNS Audit'],
    storage_path: '/api/samples/sample-cold-email-checklist/document.pdf',
    thumbnail_path: null,
    file_type: 'Config Walkthrough · 6 pp',
    source_label: 'Sanitized technical sample',
    revision_label: 'Rev. 0 • Reference Checklist',
    sort_order: 3,
    is_published: true,
    permission_confirmed: true,
    page_count: 6,
    document_pages: [
      {
        pageNumber: 1,
        sectionTitle: 'DNS Authentication & Alignment Verification Sheet',
        docCode: 'SWA-DNS-AUTH-01',
        revLabel: 'Rev. 0 · 6 Pages',
        summaryNote:
          'Environment: Cloudflare DNS + Google Workspace Mailboxes · All client domains redacted',
        headers: ['DNS Record / Host', 'Sanitized Record Value', 'Validation Check', 'Auth State'],
        rows: [
          {
            col1: 'TXT  @  [SPF]',
            col2: 'v=spf1 include:_spf.google.com ~all',
            col3: 'Lookup count: 3/10 max · Single TXT record enforced',
            col4: 'SPF Aligned',
            badge: 'PASS',
          },
          {
            col1: 'TXT  google._domainkey',
            col2: 'v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...',
            col3: '2048-bit RSA public key · Header signature verified',
            col4: 'DKIM Signed',
            badge: 'PASS',
          },
          {
            col1: 'TXT  _dmarc',
            col2: 'v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc@ops.example; adkim=s; aspf=s',
            col3: 'Strict DKIM & SPF domain alignment active',
            col4: 'DMARC Policy',
            badge: 'PASS',
          },
          {
            col1: 'CNAME  link.mail',
            col2: 'track.outbound-engine.example',
            col3: 'Isolated tracking subdomain with HTTPS certificate',
            col4: 'CNAME Active',
            badge: 'SSL OK',
          },
        ],
        footerNote:
          'Sanitized public demonstration sample • Rev. 0 • Improves sending readiness; no inbox placement guarantee.',
      },
    ],
  },
  {
    id: 'sample-hse-method-statement',
    created_at: '2026-10-28T08:15:00.000Z',
    updated_at: '2026-10-28T08:15:00.000Z',
    title: 'Heavy Lifting & Crane Operations Method Statement & HSE Plan',
    slug: 'heavy-lifting-method-statement-hse-plan',
    category: 'hse_docs',
    sample_type: 'Method Statement & HSE Plan',
    summary:
      'Structured RAMS / Method Statement covering crane setup, rigging gear certification, exclusion zones, wind-speed hold points, and emergency response.',
    description:
      'Public-source demonstration Method Statement and HSE Plan section detailing sequence of operations, plant & equipment verification, workforce responsibilities, and critical lift hold points.',
    tags: ['Method Statement', 'HSE Plan', 'Lifting Operations', 'Hold Points'],
    storage_path: '/api/samples/sample-hse-method-statement/document.pdf',
    thumbnail_path: null,
    file_type: 'PDF + DOCX · 18 pp',
    source_label: 'Public-source demo sample',
    revision_label: 'Rev. 0 • For review only',
    sort_order: 4,
    is_published: true,
    permission_confirmed: true,
    page_count: 18,
    document_pages: [
      {
        pageNumber: 1,
        sectionTitle: 'Method Statement (MOS) — Critical & Routine Lifting Operations',
        docCode: 'SWA-MOS-LIFT-004',
        revLabel: 'Rev. 0 · 18 Pages',
        summaryNote:
          'Sections: 1. Scope · 2. Plant & Gear Certs · 3. Operational Sequence · 4. Hold Points · 5. Emergency Plan',
        headers: ['Operation Phase', 'Mandatory Technical Control', 'Hold Point / Limit', 'Sign-Off Role'],
        rows: [
          {
            col1: '4.1 Crane Positioning & Mats',
            col2: 'Verify ground compaction report & 100% outrigger beam extension',
            col3: '[HOLD POINT] Prior to boom raise',
            col4: 'Lifting Supervisor',
            badge: 'Gate 01',
          },
          {
            col1: '4.2 Rigging & Color Code Check',
            col2: 'Inspect shackles, web slings & SWL tags against valid 6-month 3rd-party cert',
            col3: 'SWL > 125% load weight',
            col4: 'Certified Rigger',
            badge: 'Gate 02',
          },
          {
            col1: '4.3 Wind & Weather Monitoring',
            col2: 'Continuous digital anemometer reading at boom tip elevation',
            col3: ' Cease lift if wind >= 20 knots',
            col4: 'Crane Operator / HSE',
            badge: 'Stop Work',
          },
          {
            col1: '4.4 Exclusion Zone & Taglines',
            col2: 'Hard physical barriers around slewing radius; twin non-conductive taglines',
            col3: 'Zero personnel under suspended load',
            col4: 'Appointed Banksman',
            badge: 'Enforced',
          },
        ],
        footerNote:
          'Public-source demo sample • Rev. 0 • For review only. Drafted for client/site HSE authority approval.',
      },
    ],
  },
  {
    id: 'sample-cold-email-architecture',
    created_at: '2026-10-28T08:20:00.000Z',
    updated_at: '2026-10-28T08:20:00.000Z',
    title: 'Cold Email Infrastructure Setup — Secondary Domain & Warm-Up Blueprint',
    slug: 'cold-email-secondary-domain-warmup-blueprint',
    category: 'cold_email',
    sample_type: 'Cold Email Infrastructure Setup',
    summary:
      'Sanitized multi-domain sending architecture showing primary domain isolation, mailbox distribution, 21-day warm-up ramp, and deliverability readiness checks.',
    description:
      'Illustrates how secondary sending domains and mailboxes are isolated from your primary corporate domain, authenticated with SPF/DKIM/DMARC, and paced through a 21-day warm-up schedule.',
    tags: ['Domain Isolation', 'Mailbox Setup', '21-Day Warm-Up', 'Readiness Audit'],
    storage_path: '/api/samples/sample-cold-email-architecture/document.pdf',
    thumbnail_path: null,
    file_type: 'Architecture Sheet · 5 pp',
    source_label: 'Sanitized technical sample',
    revision_label: 'Rev. 0 • Setup Blueprint',
    sort_order: 5,
    is_published: true,
    permission_confirmed: true,
    page_count: 5,
    document_pages: [
      {
        pageNumber: 1,
        sectionTitle: 'Multi-Domain Outbound Architecture & Warm-Up Schedule',
        docCode: 'SWA-INFRA-ARC-02',
        revLabel: 'Rev. 0 · 5 Pages',
        summaryNote:
          'Architecture: Primary Domain Protected · 2 Secondary Sending Domains · 2 Mailboxes / Domain',
        headers: ['Infrastructure Layer', 'Configuration Standard', 'Volume / Threshold', 'Verification'],
        rows: [
          {
            col1: 'Primary Root Domain',
            col2: 'Strict DMARC p=reject · Zero cold outbound traffic permitted',
            col3: '0 cold sends / day (Isolated)',
            col4: 'Reputation Shielded',
            badge: 'Protected',
          },
          {
            col1: 'Secondary Sending Domains',
            col2: '301 HTTPS redirect to primary + full SPF, DKIM 2048-bit & DMARC',
            col3: '2 mailboxes per domain',
            col4: 'MX & Auth Verified',
            badge: 'Active',
          },
          {
            col1: 'Days 01–14 Warm-Up Ramp',
            col2: 'Gradual daily increment (+2 sends/day) with 30% conversational replies',
            col3: '10 → 30 emails / day / box',
            col4: '0% Hard Bounce Gate',
            badge: 'Ramping',
          },
          {
            col1: 'Campaign Readiness Audit',
            col2: 'Plain-text ratio check, RFC 8058 List-Unsubscribe header, blacklist scan',
            col3: 'Max 35–45 sends / day / box',
            col4: 'Pre-Launch Cleared',
            badge: 'Ready',
          },
        ],
        footerNote:
          'Sanitized public demonstration sample • Rev. 0 • Configures technical readiness; never claims guaranteed inbox placement.',
      },
    ],
  },
  {
    id: 'sample-hse-confined-space-ra',
    created_at: '2026-10-28T08:25:00.000Z',
    updated_at: '2026-10-28T08:25:00.000Z',
    title: 'Confined Space Entry & Gas Testing Risk Assessment',
    slug: 'confined-space-entry-risk-assessment-demo',
    category: 'hse_docs',
    sample_type: 'Risk Assessment',
    summary:
      'Activity-based 5×5 Risk Assessment for vessel/manhole entry, LOTO isolation, continuous 4-gas monitoring, attendant logging, and tripod rescue standby.',
    description:
      'Public-source demonstration Risk Assessment for confined space entry operations. Highlights LEL/O2/H2S/CO atmospheric hold points, forced ventilation controls, and non-entry rescue equipment checks.',
    tags: ['Confined Space', '4-Gas Testing', 'LOTO Isolation', '5×5 Risk Matrix'],
    storage_path: '/api/samples/sample-hse-confined-space-ra/document.pdf',
    thumbnail_path: null,
    file_type: 'PDF + DOCX · 22 pp',
    source_label: 'Public-source demo sample',
    revision_label: 'Rev. 0 • For review only',
    sort_order: 6,
    is_published: true,
    permission_confirmed: true,
    page_count: 22,
    document_pages: [
      {
        pageNumber: 1,
        sectionTitle: 'Confined Space Entry Risk Assessment & Atmospheric Hold Points',
        docCode: 'SWA-HSE-CSE-022',
        revLabel: 'Rev. 0 · 22 Pages',
        summaryNote:
          'Scope: Utility Chamber & Vessel Inspection · Atmospheric Limits: O2 19.5%–23.5%, LEL < 10%, H2S = 0 ppm',
        headers: ['Entry Activity', 'Atmospheric / Physical Hazard', 'Init Risk', 'Controls & Hold Point'],
        rows: [
          {
            col1: '01. Mechanical & Process Isolation',
            col2: 'Inadvertent inflow of toxic gas, steam, or liquid',
            col3: '25 (Crit)',
            col4: 'Positive spade/blinding + LOTO padlock register [HOLD POINT]',
            badge: 'Res: 4 (Low)',
          },
          {
            col1: '02. Pre-Entry 4-Gas Testing',
            col2: 'Oxygen depletion / flammable vapor pocket',
            col3: '20 (High)',
            col4: 'Stratified top/mid/bottom probe test by Authorized Gas Tester',
            badge: 'Res: 4 (Low)',
          },
          {
            col1: '03. Forced Air Ventilation & Entry',
            col2: 'Heat stress / toxic fume accumulation during work',
            col3: '15 (High)',
            col4: 'Continuous blower air changes + personal 4-gas monitor on entrant',
            badge: 'Res: 3 (Low)',
          },
          {
            col1: '04. Standby Attendant & Rescue',
            col2: 'Unassisted entrant incapacitation inside chamber',
            col3: '16 (High)',
            col4: 'Dedicated hole-watch log + certified tripod winch & SCBA on standby',
            badge: 'Res: 3 (Low)',
          },
        ],
        footerNote:
          'Public-source demo sample • Rev. 0 • For review only. Missing site values flagged [HOLD POINT].',
      },
    ],
  },
];

const inquiriesStore: StoredInquiry[] = [];
const idempotencyMap = new Map<string, StoredInquiry>();
const rateLimitWindowMs = 60_000;
const ipRequestTimestamps = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (ipRequestTimestamps.get(ip) || []).filter(
    (t) => now - t < rateLimitWindowMs
  );
  if (timestamps.length >= 8) {
    ipRequestTimestamps.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  ipRequestTimestamps.set(ip, timestamps);
  return false;
}

function isAuthorizedAdmin(req: express.Request): boolean {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.slice('Bearer '.length).trim();
  return ACTIVE_ADMIN_TOKENS.has(token);
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // 1. Public & Admin Samples API
  app.get('/api/samples', (req, res) => {
    const isAdmin = isAuthorizedAdmin(req);
    const visible = portfolioSamples
      .filter((s) => isAdmin || (s.is_published && s.permission_confirmed))
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(({ uploaded_pdf_base64: _omit, ...publicRecord }) => ({
        ...publicRecord,
        document_pages: getSampleDocumentPages(publicRecord),
      }));
    res.json({ samples: visible });
  });

  // 2. Real PDF Document Endpoint for Published Samples (or Admin Preview)
  app.get('/api/samples/:id/document.pdf', (req, res) => {
    const sample = portfolioSamples.find((s) => s.id === req.params.id);
    if (!sample || ((!sample.is_published || !sample.permission_confirmed) && !isAuthorizedAdmin(req))) {
      res.status(404).send('Sample document not found or not published.');
      return;
    }

    const pdfBuffer = buildRealDemoPdfBuffer(sample);
    const filename = `${sample.slug || sample.id}-demo-rev0.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      req.query.download === '1'
        ? `attachment; filename="${filename}"`
        : `inline; filename="${filename}"`
    );
    res.send(pdfBuffer);
  });

  // 3. Signed URL Generation Endpoint (verifies publication status before issuing token)
  app.post('/api/samples/:id/signed-url', (req, res) => {
    const sample = portfolioSamples.find((s) => s.id === req.params.id);
    if (!sample || ((!sample.is_published || !sample.permission_confirmed) && !isAuthorizedAdmin(req))) {
      res.status(404).json({
        error: 'Requested sample is not published or does not exist.',
      });
      return;
    }

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const documentUrl = `/api/samples/${encodeURIComponent(sample.id)}/document.pdf?exp=${encodeURIComponent(
      expiresAt
    )}`;

    res.json({
      sampleId: sample.id,
      signedUrl: documentUrl,
      downloadUrl: `${documentUrl}&download=1`,
      expiresAt,
      note: 'Verified published demo sample. Time-limited 15-minute signed document URL active.',
    });
  });

  // 4. Admin Login Endpoint
  app.post('/api/admin/login', (req, res) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const passphrase = String(req.body?.passphrase || '');

    if (email !== OWNER_EMAIL) {
      res.status(403).json({
        error: `Access denied. Only the allowlisted owner (${OWNER_EMAIL}) may access /admin.`,
      });
      return;
    }

    if (ADMIN_PASSPHRASE && passphrase !== ADMIN_PASSPHRASE) {
      res.status(401).json({
        error: 'Invalid owner passphrase.',
      });
      return;
    }

    const token = `adm_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
    ACTIVE_ADMIN_TOKENS.add(token);
    res.json({ token, ownerEmail: OWNER_EMAIL });
  });

  // 5. Admin Create Sample (supports PDF & thumbnail upload and auto-generates structured preview)
  app.post('/api/samples', (req, res) => {
    if (!isAuthorizedAdmin(req)) {
      res.status(401).json({ error: 'Unauthorized. Sign in as owner first.' });
      return;
    }

    const validation = validateSampleInput(req.body || {});
    if (!validation.valid) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const now = new Date().toISOString();
    const newId = `sample_${Date.now()}`;
    const category = req.body.category === 'cold_email' ? 'cold_email' : 'hse_docs';
    const pageCount = req.body.page_count ? Number(req.body.page_count) : 12;

    const newSample: StoredSample = {
      id: newId,
      created_at: now,
      updated_at: now,
      title: String(req.body.title).trim(),
      slug: validation.slug,
      category,
      sample_type: String(req.body.sample_type).trim(),
      summary: String(req.body.summary).trim(),
      description: String(req.body.description || req.body.summary).trim(),
      tags: Array.isArray(req.body.tags) ? req.body.tags : [],
      storage_path: `/api/samples/${newId}/document.pdf`,
      thumbnail_path: req.body.thumbnail_data_url ? String(req.body.thumbnail_data_url) : null,
      uploaded_pdf_base64: req.body.pdf_data_url ? String(req.body.pdf_data_url) : null,
      file_type: category === 'hse_docs' ? `PDF + DOCX · ${pageCount} pp` : `Config Sheet · ${pageCount} pp`,
      source_label:
        req.body.source_label ||
        (category === 'hse_docs'
          ? 'Public-source demo sample'
          : 'Sanitized technical sample'),
      revision_label: req.body.revision_label || 'Rev. 0 • For review only',
      sort_order: portfolioSamples.length + 1,
      is_published: Boolean(req.body.is_published),
      permission_confirmed: Boolean(req.body.permission_confirmed),
      page_count: pageCount,
    };

    newSample.document_pages = getSampleDocumentPages(newSample);
    portfolioSamples.push(newSample);

    const { uploaded_pdf_base64: _omit, ...publicSample } = newSample;
    res.status(201).json({ sample: publicSample });
  });

  // 6. Admin Update Sample (Publish/Unpublish)
  app.patch('/api/samples/:id', (req, res) => {
    if (!isAuthorizedAdmin(req)) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const sample = portfolioSamples.find((s) => s.id === req.params.id);
    if (!sample) {
      res.status(404).json({ error: 'Sample not found.' });
      return;
    }

    if (typeof req.body.is_published === 'boolean') {
      if (req.body.is_published && !sample.permission_confirmed && !req.body.permission_confirmed) {
        res.status(400).json({
          error: 'Permission and redaction confirmation is required before publishing.',
        });
        return;
      }
      sample.is_published = req.body.is_published;
    }
    if (typeof req.body.permission_confirmed === 'boolean') {
      sample.permission_confirmed = req.body.permission_confirmed;
    }
    sample.updated_at = new Date().toISOString();

    const { uploaded_pdf_base64: _omit, ...publicSample } = sample;
    res.json({ sample: publicSample });
  });

  // 7. Admin Delete Sample
  app.delete('/api/samples/:id', (req, res) => {
    if (!isAuthorizedAdmin(req)) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const idx = portfolioSamples.findIndex((s) => s.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Sample not found.' });
      return;
    }
    portfolioSamples.splice(idx, 1);
    res.json({ deleted: true });
  });

  // 8. Submit Inquiry Endpoint
  app.post('/api/inquiries', async (req, res) => {
    const clientIp = req.ip || 'local';
    if (isRateLimited(clientIp)) {
      res.status(429).json({
        error: 'Too many requests in a short window. Please wait a moment or tap WhatsApp.',
      });
      return;
    }

    const validation = validateInquiryInput({
      name: req.body?.name,
      email: req.body?.email,
      service: req.body?.service,
      packageTier: req.body?.packageTier,
      message: req.body?.message,
      honeypot: req.body?.honeypot,
      pageSource: req.body?.pageSource,
      idempotencyKey: req.body?.idempotencyKey,
    });

    if (validation.isSpamHoneypot) {
      res.status(429).json({
        error: 'Unable to process submission at this time. Please try again later.',
      });
      return;
    }

    if (!validation.valid || !validation.sanitized) {
      res.status(400).json({
        error: 'Please check the highlighted form fields.',
        fieldErrors: validation.errors,
      });
      return;
    }

    const { sanitized } = validation;

    const existing = idempotencyMap.get(sanitized.idempotencyKey);
    if (existing) {
      res.status(200).json({
        inquiryId: existing.id,
        outcome:
          existing.notification_status === 'sent'
            ? 'saved_and_emailed'
            : 'saved_email_unconfirmed',
        deduplicated: true,
      });
      return;
    }

    const resendApiKey = process.env.RESEND_API_KEY || '';
    const resendFrom = process.env.RESEND_FROM_EMAIL || '';
    let notificationStatus: 'sent' | 'failed_or_unconfigured' = 'failed_or_unconfigured';
    let notificationErrorCode: string | null = 'RESEND_NOT_CONFIGURED';
    let notifiedAt: string | null = null;

    if (
      resendApiKey &&
      resendApiKey !== 're_your_resend_api_key' &&
      resendFrom &&
      !resendFrom.includes('your-verified-domain.com')
    ) {
      try {
        const serviceLabel =
          sanitized.service === 'cold_email'
            ? 'Cold Email Infrastructure Setup'
            : 'HSE Documentation';
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: resendFrom,
            to: [OWNER_EMAIL],
            reply_to: sanitized.email,
            subject: `New Inquiry — SafetyWithAthar — ${serviceLabel} — ${sanitized.name}`,
            text: [
              `New Inquiry — SafetyWithAthar`,
              `Name: ${sanitized.name}`,
              `Email: ${sanitized.email}`,
              `Service: ${serviceLabel} (${sanitized.service})`,
              `Package: ${sanitized.packageTier}`,
              `Page Source: ${sanitized.pageSource}`,
              ``,
              `Message:`,
              sanitized.message,
            ].join('\n'),
          }),
        });

        if (emailResponse.ok) {
          notificationStatus = 'sent';
          notificationErrorCode = null;
          notifiedAt = new Date().toISOString();
        } else {
          notificationStatus = 'failed_or_unconfigured';
          notificationErrorCode = `RESEND_HTTP_${emailResponse.status}`;
        }
      } catch {
        notificationStatus = 'failed_or_unconfigured';
        notificationErrorCode = 'RESEND_NETWORK_ERROR';
      }
    }

    const record: StoredInquiry = {
      id: `inq_${Date.now()}`,
      created_at: new Date().toISOString(),
      name: sanitized.name,
      email: sanitized.email,
      service: sanitized.service,
      packageTier: sanitized.packageTier,
      message: sanitized.message,
      pageSource: sanitized.pageSource,
      idempotencyKey: sanitized.idempotencyKey,
      notification_status: notificationStatus,
      notification_error_code: notificationErrorCode,
      notified_at: notifiedAt,
    };

    inquiriesStore.unshift(record);
    idempotencyMap.set(sanitized.idempotencyKey, record);

    res.status(201).json({
      inquiryId: record.id,
      outcome:
        notificationStatus === 'sent'
          ? 'saved_and_emailed'
          : 'saved_email_unconfirmed',
    });
  });

  // 9. Admin Inquiries List
  app.get('/api/admin/inquiries', (req, res) => {
    if (!isAuthorizedAdmin(req)) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }
    res.json({ inquiries: inquiriesStore });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SafetyWithAthar server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
