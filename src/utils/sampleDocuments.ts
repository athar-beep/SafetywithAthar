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
function baseDocumentPages(
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

// ---------------------------------------------------------------------------
// Full-document expansion (2026-10-29, owner request): the viewer must show
// EVERY page of a sample on the live site, not just a first-page preview.
// Authored/base pages stay first; structured continuation and closing pages
// are generated up to the sample's stated page_count (capped at 40). All
// generated pages keep the demo disclaimers — public-source demonstration
// content only, never presented as approved site documentation.
// ---------------------------------------------------------------------------

type RowBank = SampleDocumentTableRow[];

const RA_HEADERS: [string, string, string, string] = [
  'Activity Step',
  'Hazard & Consequence',
  'Init Risk',
  'Controls & Hold Points',
];

function matrixPages(
  titles: string[],
  rows: RowBank,
  docCode: string,
  footer: string,
  perPage = 4
): SampleDocumentPage[] {
  const pages: SampleDocumentPage[] = [];
  for (let i = 0; i < rows.length; i += perPage) {
    const part = Math.floor(i / perPage);
    pages.push({
      pageNumber: 0,
      sectionTitle: titles[Math.min(part, titles.length - 1)],
      docCode,
      revLabel: 'Rev. 0',
      summaryNote: 'Activity-based assessment continued — initial risk scored before controls, residual risk after controls are verified in the field.',
      headers: RA_HEADERS,
      rows: rows.slice(i, i + perPage),
      footerNote: footer,
    });
  }
  return pages;
}

const DEMO_FOOTER =
  'Public-source demo sample • Rev. 0 • For review only — not approved for execution. Site-specific inputs are marked [SITE INPUT REQUIRED].';

const RA_PHASE_ROWS: RowBank = [
  { col1: 'Earthworks — Bulk Excavation', col2: 'Plant–pedestrian interface / reversing plant strike', col3: '20 (High)', col4: 'Trained banksman, segregated walkways, reversing cameras [HOLD POINT: daily plant check]', badge: 'Res: 5 (Low)' },
  { col1: 'Earthworks — Trench Support', col2: 'Trench wall collapse / engulfment', col3: '25 (High)', col4: 'Batterered or shored sides per soil class, ladder access every 15 m, daily competent-person inspection [HOLD POINT]', badge: 'Res: 5 (Low)' },
  { col1: 'Formwork & Falsework Erection', col2: 'Falsework overload / premature striking', col3: '20 (High)', col4: 'Designed falsework with tag system, striking only on engineer permit-to-strike [HOLD POINT]', badge: 'Res: 4 (Low)' },
  { col1: 'Reinforcement Fixing', col2: 'Manual handling strain / protruding bar impalement', col3: '12 (Med)', col4: 'Mechanical lifting for bundles, mushroom caps on starter bars, team-lift limits', badge: 'Res: 4 (Low)' },
  { col1: 'Concreting — Pump & Skip', col2: 'Hose whip / concrete splash to eyes', col3: '15 (High)', col4: 'Secured hose couplings with whip checks, sealed goggles, exclusion under skip path', badge: 'Res: 5 (Low)' },
  { col1: 'Blockwork & Plastering', col2: 'Falling blocks / silica dust inhalation', col3: '12 (Med)', col4: 'Toe boards on scaffolds, wet cutting + FFP3 respirators, dust extraction', badge: 'Res: 4 (Low)' },
  { col1: 'Structural Steel — Bolt-up', col2: 'Dropped tools / falling objects', col3: '20 (High)', col4: 'Tool lanyards, bolt bags, hard-barricaded drop zone below [HOLD POINT: wind limit 20 kt]', badge: 'Res: 5 (Low)' },
  { col1: 'Roofing Works', col2: 'Fall through fragile surface', col3: '25 (High)', col4: 'Crawling boards, edge protection, harness anchor plan [HOLD POINT: fragile surface permit]', badge: 'Res: 5 (Low)' },
  { col1: 'MEP First Fix — Containment', col2: 'Work at height from podium steps / cable drum handling', col3: '12 (Med)', col4: 'Podium steps with gate closed, drum jacks and chocks, two-person drum moves', badge: 'Res: 3 (Low)' },
  { col1: 'MEP Second Fix — Terminations', col2: 'Electric shock / arc flash during termination', col3: '20 (High)', col4: 'LOTO applied and proven dead, insulated tools, competent electrician only [HOLD POINT]', badge: 'Res: 4 (Low)' },
  { col1: 'Finishing — Painting & Coating', col2: 'VOC exposure / flammable vapour ignition', col3: '15 (High)', col4: 'Ventilation, COSHH assessment at point of use, no hot works in zone, respirators A2P3', badge: 'Res: 5 (Low)' },
  { col1: 'External Works — Kerbs & Paving', col2: 'Disc cutter kickback / HAVS', col3: '15 (High)', col4: 'Guard-fitted cutters, HAVS exposure log, water suppression for dust', badge: 'Res: 4 (Low)' },
  { col1: 'Commissioning — Pressure Testing', col2: 'Stored energy release / hose failure', col3: '20 (High)', col4: 'Test pack approved, barricaded test zone, calibrated gauges, gradual pressurisation [HOLD POINT]', badge: 'Res: 5 (Low)' },
  { col1: 'Handover — Snagging Works', col2: 'Lone working / incomplete isolations', col3: '10 (Med)', col4: 'Permit-controlled snagging list, buddy system, isolation register check', badge: 'Res: 3 (Low)' },
  { col1: 'Material Deliveries & Offloading', col2: 'Load shift / forklift pedestrian strike', col3: '16 (High)', col4: 'Delivery management plan, trained slinger/signaller, exclusion during offload', badge: 'Res: 4 (Low)' },
  { col1: 'Waste Handling & Housekeeping', col2: 'Slips and trips / sharps injury', col3: '9 (Med)', col4: 'Segregated waste streams, daily housekeeping inspection, sharps gloves for sorters', badge: 'Res: 3 (Low)' },
];

const RA_GENERIC_ROWS: RowBank = [
  { col1: 'Site Access & Security', col2: 'Unauthorised entry / public interface', col3: '12 (Med)', col4: 'Turnstile or gate log, visitor induction, hoarding integrity checks', badge: 'Res: 3 (Low)' },
  { col1: 'Temporary Electrics — Distribution', col2: 'Damaged leads / RCD failure', col3: '15 (High)', col4: '110V or RCD-protected supplies, weekly PAT/inspection register, cable ramps', badge: 'Res: 4 (Low)' },
  { col1: 'Hot Works — Welding & Cutting', col2: 'Fire / sparks to combustibles', col3: '20 (High)', col4: 'Hot work permit, fire watch during + 60 min after, extinguishers at point of work [HOLD POINT]', badge: 'Res: 5 (Low)' },
  { col1: 'Work at Height — Scaffold Use', col2: 'Fall of person / incomplete scaffold', col3: '25 (High)', col4: 'Scafftag system, weekly + after-alteration inspections, no unauthorised alterations [HOLD POINT]', badge: 'Res: 5 (Low)' },
  { col1: 'Lifting — Mobile Crane General', col2: 'Overload / load swing', col3: '20 (High)', col4: 'Lift plan per lift category, certified gear register, anemometer monitoring [HOLD POINT]', badge: 'Res: 4 (Low)' },
  { col1: 'Plant Refuelling', col2: 'Fuel spill / fire', col3: '12 (Med)', col4: 'Bunded bowser, drip trays, spill kit at point of use, no smoking zone', badge: 'Res: 3 (Low)' },
  { col1: 'Night Works', col2: 'Poor visibility / fatigue', col3: '15 (High)', col4: 'Lighting survey (min lux at task), fatigue roster limits, hi-vis Class 3', badge: 'Res: 5 (Low)' },
  { col1: 'Heat Stress Management', col2: 'Heat exhaustion / heat stroke', col3: '16 (High)', col4: 'WBGT monitoring, shaded rest + cool water, acclimatisation schedule, buddy checks', badge: 'Res: 4 (Low)' },
  { col1: 'Dust-Generating Works', col2: 'Respirable crystalline silica', col3: '16 (High)', col4: 'Water suppression, on-tool extraction, FFP3 face-fit tested, health surveillance', badge: 'Res: 4 (Low)' },
  { col1: 'Noise-Intensive Works', col2: 'Noise-induced hearing loss', col3: '12 (Med)', col4: 'Noise zones signed, hearing protection mandatory >85 dB(A), plant selection low-noise first', badge: 'Res: 3 (Low)' },
  { col1: 'Traffic Management — Internal Roads', col2: 'Vehicle collision at pinch points', col3: '16 (High)', col4: 'One-way system, 10 km/h limit, passing bays, trained traffic marshals', badge: 'Res: 4 (Low)' },
  { col1: 'Welfare — Water, Rest, Sanitation', col2: 'Dehydration / hygiene illness', col3: '9 (Med)', col4: 'Potable water points, shaded rest areas, serviced sanitation per headcount ratio', badge: 'Res: 2 (Low)' },
  { col1: 'Adverse Weather — Lightning & Storm', col2: 'Lightning strike / crane instability', col3: '15 (High)', col4: '30-30 lightning rule, crane stand-down limits, secure loose materials', badge: 'Res: 5 (Low)' },
  { col1: 'Housekeeping — Access Routes', col2: 'Slips, trips and falls (same level)', col3: '12 (Med)', col4: 'Designated walkways kept clear, cable covers, daily supervisor walk-round', badge: 'Res: 3 (Low)' },
  { col1: 'Visitor & Delivery Driver Safety', col2: 'Unfamiliar persons in live work zones', col3: '12 (Med)', col4: 'Escorted access only, driver briefing card, PPE issue at gate', badge: 'Res: 3 (Low)' },
  { col1: 'Document Control & Record Retention', col2: 'Superseded revision used in field', col3: '9 (Med)', col4: 'Controlled copy register, revision check at TBT, obsolete copies withdrawn', badge: 'Res: 2 (Low)' },
  { col1: 'Incident Reporting & Escalation', col2: 'Delayed reporting / evidence loss', col3: '12 (Med)', col4: 'Immediate verbal + 24h written report, scene preservation, investigation per severity matrix', badge: 'Res: 3 (Low)' },
  { col1: 'Subcontractor Coordination (SIMOPS)', col2: 'Conflicting simultaneous operations', col3: '16 (High)', col4: 'Daily SIMOPS meeting, shared permit board, interface risk review [HOLD POINT]', badge: 'Res: 4 (Low)' },
  { col1: 'Manual Handling — General', col2: 'Musculoskeletal injury', col3: '12 (Med)', col4: 'Mechanical aids first, load weight labels, manual handling training records', badge: 'Res: 3 (Low)' },
  { col1: 'Storage of Flammables & Gas Cylinders', col2: 'Fire / cylinder projectile', col3: '16 (High)', col4: 'Ventilated cage, upright chained cylinders, separation distances, signage', badge: 'Res: 4 (Low)' },
  { col1: 'Excavation Services — Trial Pits', col2: 'Unknown service strike', col3: '20 (High)', col4: 'Drawings + CAT scan + hand-dig only within 500 mm of marked services [HOLD POINT]', badge: 'Res: 5 (Low)' },
  { col1: 'Concrete Washout', col2: 'Alkaline runoff to ground/drain', col3: '9 (Med)', col4: 'Designated lined washout pit only, pH check before disposal', badge: 'Res: 2 (Low)' },
  { col1: 'Tower Crane — Climbing Operations', col2: 'Structural overload during climb', col3: '25 (High)', col4: 'OEM climbing procedure, specialist crew, wind hold limits [HOLD POINT: climb permit]', badge: 'Res: 5 (Low)' },
  { col1: 'Demolition — Soft Strip', col2: 'Hidden asbestos / structural instability', col3: '20 (High)', col4: 'Pre-demolition survey, licensed removal where identified, engineer sequence sign-off [HOLD POINT]', badge: 'Res: 5 (Low)' },
  { col1: 'Piling — Bored Operations', col2: 'Auger entanglement / bore collapse', col3: '20 (High)', col4: 'Auger guards, exclusion zone, bore capping same shift', badge: 'Res: 5 (Low)' },
  { col1: 'Roadworks Interface — Public Highway', col2: 'Public vehicle incursion', col3: '20 (High)', col4: 'Approved traffic management layout, advance signage, barrier-rated separation [HOLD POINT]', badge: 'Res: 5 (Low)' },
  { col1: 'Confined Welfare — Drinking Water Quality', col2: 'Contaminated supply illness', col3: '9 (Med)', col4: 'Tested potable supply, dated containers, cleaning schedule', badge: 'Res: 2 (Low)' },
  { col1: 'Fatigue — Extended Shifts', col2: 'Error from exhaustion on safety-critical tasks', col3: '15 (High)', col4: 'Max shift + rest rules, no safety-critical solo work after extended hours', badge: 'Res: 4 (Low)' },
  { col1: 'Young & Inexperienced Workers', col2: 'Unrecognised hazards', col3: '12 (Med)', col4: 'Named supervisor, restricted task list, enhanced supervision ratios', badge: 'Res: 3 (Low)' },
  { col1: 'Emergency Drill Programme', col2: 'Unpractised evacuation / slow muster', col3: '12 (Med)', col4: 'Monthly drill rotation (fire, rescue, spill), timed muster with roll call', badge: 'Res: 3 (Low)' },
  { col1: 'First Aid Provision', col2: 'Inadequate response to injury', col3: '12 (Med)', col4: 'Trained first aiders per shift ratio, stocked stations, hospital route posted', badge: 'Res: 3 (Low)' },
  { col1: 'PPE Issue & Compliance', col2: 'Non-use / damaged PPE', col3: '9 (Med)', col4: 'Free issue + fit checks, PPE matrix by task, supervisor spot checks', badge: 'Res: 2 (Low)' },
  { col1: 'Safety Signage & Barriers Audit', col2: 'Missing or ignored warnings', col3: '9 (Med)', col4: 'Weekly audit walk, multilingual pictorial signage, barrier integrity checks', badge: 'Res: 2 (Low)' },
  { col1: 'Toolbox Talk Programme', col2: 'Generic talks with no task relevance', col3: '9 (Med)', col4: 'Task-specific TBT before each shift, attendance signed, topics logged weekly', badge: 'Res: 2 (Low)' },
  { col1: 'Management Site Tours', col2: 'Hazards normalised at worker level', col3: '9 (Med)', col4: 'Weekly leadership tour with close-out actions tracked to completion', badge: 'Res: 2 (Low)' },
  { col1: 'Change Management — Scope Variation', col2: 'Unassessed new hazards from changed method', col3: '16 (High)', col4: 'MOC form before variation starts, RA revision re-briefed to crew [HOLD POINT]', badge: 'Res: 4 (Low)' },
  { col1: 'Close-Out — Demobilisation', col2: 'Residual hazards left for others', col3: '10 (Med)', col4: 'Demob checklist, services capped and marked, final joint inspection', badge: 'Res: 3 (Low)' },
  { col1: 'Lessons Learned Register', col2: 'Repeat incidents across packages', col3: '9 (Med)', col4: 'Register reviewed monthly, actions briefed at TBT, trends to management review', badge: 'Res: 2 (Low)' },
  { col1: 'Audit & Inspection Schedule', col2: 'Drift from planned controls', col3: '9 (Med)', col4: 'Weekly HSE inspection, monthly audit, findings tracked with owners and dates', badge: 'Res: 2 (Low)' },
  { col1: 'Permit Office — Daily Board Control', col2: 'Conflicting live permits', col3: '16 (High)', col4: 'Permit board reviewed at shift start, conflicts resolved before issue [HOLD POINT]', badge: 'Res: 4 (Low)' },
];

function simplePage(
  title: string,
  note: string,
  headers: [string, string, string, string],
  rows: RowBank,
  docCode: string,
  footer: string
): SampleDocumentPage {
  return {
    pageNumber: 0,
    sectionTitle: title,
    docCode,
    revLabel: 'Rev. 0',
    summaryNote: note,
    headers,
    rows,
    footerNote: footer,
  };
}

function closingPages(
  kind: 'ra' | 'jsa' | 'method' | 'dns' | 'arch',
  docCode: string
): SampleDocumentPage[] {
  const sign = simplePage(
    'Review, Approval & Revision Record',
    'This document is a professional draft. Field use requires review and formal approval by the client/site HSE authority.',
    ['Role', 'Name / Organisation', 'Responsibility', 'Status'],
    [
      { col1: 'Prepared By', col2: 'SafetyWithAthar (remote)', col3: 'Draft preparation from supplied work-pack inputs', col4: 'Rev. 0 issued' },
      { col1: 'Reviewed By', col2: '[SITE INPUT REQUIRED]', col3: 'Site HSE review against actual conditions', col4: '[HOLD POINT]' },
      { col1: 'Approved By', col2: '[SITE INPUT REQUIRED]', col3: 'Client / site HSE authority approval', col4: '[HOLD POINT]' },
      { col1: 'Revision History', col2: 'Rev. 0 — first issue for review', col3: 'Superseded revisions withdrawn from field use', col4: 'Controlled' },
    ],
    docCode,
    DEMO_FOOTER
  );
  if (kind === 'ra' || kind === 'jsa') {
    return [
      simplePage(
        'Residual Risk Summary & ALARP Statement',
        'All activities are reduced to Low/Medium residual risk once the stated controls are verified in place. No activity may start on initial risk alone.',
        ['Risk Band', 'Count of Activities', 'Action Rule', 'Authority'],
        [
          { col1: 'High (15–25) initial', col2: 'Assessed per activity matrix', col3: 'Controls + hold points mandatory before start', col4: 'Site HSE authority' },
          { col1: 'Medium (8–12) residual', col2: 'Monitor at supervision level', col3: 'Daily TBT reinforcement + spot checks', col4: 'Supervisor' },
          { col1: 'Low (1–6) residual', col2: 'Majority of activities after controls', col3: 'Proceed under permit and supervision', col4: 'Permit issuer' },
          { col1: 'ALARP Statement', col2: 'Further risk reduction considered for every High initial item', col3: 'Grossly disproportionate measures documented, not silently dropped', col4: 'HSE Officer' },
        ],
        docCode,
        DEMO_FOOTER
      ),
      simplePage(
        'Hold Point Register',
        'Work must stop at each hold point until the named authority verifies and releases it. Hold points are never self-released.',
        ['Hold Point', 'Where It Applies', 'Released By', 'Evidence'],
        [
          { col1: 'HP-01 Permit Verification', col2: 'Start of each high-risk activity', col3: 'Permit issuer', col4: 'Signed permit at workface' },
          { col1: 'HP-02 Isolation / LOTO', col2: 'Energy isolation before work', col3: 'Authorised isolator', col4: 'Lock register + prove-dead test' },
          { col1: 'HP-03 Pre-Start Inspection', col2: 'Plant, scaffold, lifting gear', col3: 'Competent inspector', col4: 'Tag / inspection record' },
          { col1: 'HP-04 Authority Sign-Off', col2: 'Document approval before execution', col3: 'Client/site HSE authority', col4: 'Signed approval block' },
        ],
        docCode,
        DEMO_FOOTER
      ),
      sign,
    ];
  }
  if (kind === 'method') {
    return [
      simplePage(
        'Emergency Response Summary',
        'Site emergency arrangements to be confirmed against the actual project emergency plan before work starts.',
        ['Scenario', 'Immediate Action', 'Equipment', 'Notification'],
        [
          { col1: 'Injury / Collapse', col2: 'Stop work, first aid, call site emergency number', col3: 'First aid station + stretcher', col4: 'Supervisor → HSE Officer' },
          { col1: 'Fire', col2: 'Raise alarm, attack only if trained and safe', col3: 'Extinguishers at work point', col4: 'Control room / fire team' },
          { col1: 'Load Incident', col2: 'Cordon area, do not re-rig until inspected', col3: 'Barriers + lifting register', col4: 'Lifting supervisor → HSE' },
          { col1: 'Adverse Weather', col2: 'Stand down lifting/height work at limits', col3: 'Anemometer + lightning rule', col4: 'Site management broadcast' },
        ],
        docCode,
        DEMO_FOOTER
      ),
      sign,
    ];
  }
  if (kind === 'dns') {
    return [
      simplePage(
        'Verification Results & Sign-Off',
        'Authentication is verified from live DNS responses, not screenshots. Any failed check blocks warm-up until corrected.',
        ['Check', 'Tool / Method', 'Result', 'Status'],
        [
          { col1: 'SPF evaluation', col2: 'DNS lookup count + syntax validation', col3: '≤10 lookups, single record, aligned', col4: 'PASS' },
          { col1: 'DKIM signing', col2: 'Test mail header inspection', col3: '2048-bit signature verifies', col4: 'PASS' },
          { col1: 'DMARC enforcement', col2: 'Policy record + aggregate reports', col3: 'p=quarantine/reject with strict alignment', col4: 'PASS' },
          { col1: 'Sign-off', col2: 'Prepared by SafetyWithAthar', col3: 'Client domains fully redacted in this sample', col4: 'Rev. 0' },
        ],
        docCode,
        'Sanitized public demonstration • Rev. 0 • No client domains, credentials, or private IPs exposed.'
      ),
    ];
  }
  return [
    simplePage(
      'Readiness Audit & Handover',
      'Sending starts only after every readiness gate passes. Authentication improves deliverability readiness; it never guarantees inbox placement.',
      ['Gate', 'Evidence', 'Owner', 'Status'],
      [
        { col1: 'Authentication', col2: 'SPF/DKIM/DMARC all PASS', col3: 'SafetyWithAthar', col4: 'Required' },
        { col1: 'Blacklist Baseline', col2: 'Domain + IP checked against major lists', col3: 'SafetyWithAthar', col4: 'Required' },
        { col1: 'Warm-Up Plan', col2: '21-day ramp schedule issued', col3: 'Client sender', col4: 'Required' },
        { col1: 'Handover', col2: 'Configuration sheet + checklist delivered', col3: 'SafetyWithAthar', col4: 'Rev. 0' },
      ],
      docCode,
      'Sanitized public demonstration • Rev. 0 • No client domains, credentials, or private IPs exposed.'
    ),
  ];
}

function continuationPages(sample: PortfolioSampleRecord, docCode: string): SampleDocumentPage[] {
  const slug = sample.slug;
  const H: [string, string, string, string] = ['Step / Section', 'Detail', 'Control / Requirement', 'Verification'];
  if (sample.category === 'cold_email') {
    if (slug.includes('architecture') || slug.includes('warmup')) {
      return [
        simplePage('Domain Architecture Map', 'Primary domain is never used for cold outreach. Secondary domains carry all sending risk.', H, [
          { col1: 'Primary Root Domain', col2: 'Brand + transactional mail only', col3: 'No cold sending, ever', col4: 'Policy' },
          { col1: 'Secondary Domains (×3)', col2: 'Look-alike domains registered for outreach', col3: 'SPF/DKIM/DMARC per domain', col4: 'DNS verified' },
          { col1: 'Mailboxes (2–3 / domain)', col2: 'Named sender personas', col3: 'Profile complete + signature plain-text', col4: 'Checklist' },
          { col1: 'Tracking Subdomain', col2: 'CNAME to sending platform', col3: 'SSL active before first send', col4: 'HTTPS check' },
        ], docCode, DEMO_FOOTER),
        simplePage('Mailbox Distribution Matrix', 'Volume is spread so no single mailbox or domain carries campaign risk.', H, [
          { col1: 'Per Mailbox', col2: 'Max 30–50 sends/day at full ramp', col3: 'Warm-up tool pacing enabled', col4: 'Platform log' },
          { col1: 'Per Domain', col2: 'Max 3 mailboxes', col3: 'Domain-level caps respected', col4: 'Platform log' },
          { col1: 'Rotation', col2: 'Even rotation across mailboxes', col3: 'No mailbox exceeds daily cap', col4: 'Weekly review' },
          { col1: 'Bounce Guard', col2: 'Campaign pauses above 2% bounce', col3: 'List cleaning before relaunch', col4: 'Hard rule' },
        ], docCode, DEMO_FOOTER),
        simplePage('21-Day Warm-Up Schedule', 'Warm-up runs on peer-network engagement before any live campaign volume.', H, [
          { col1: 'Days 1–7', col2: '10–20 / day per mailbox', col3: 'Replies + rescue-from-spam actions', col4: 'Week 1 gate' },
          { col1: 'Days 8–14', col2: '20–35 / day per mailbox', col3: 'Engagement rate > 25% maintained', col4: 'Week 2 gate' },
          { col1: 'Days 15–21', col2: '35–45 / day per mailbox', col3: 'Postmaster signals reviewed', col4: 'Week 3 gate' },
          { col1: 'Day 22+', col2: 'Controlled campaign start', col3: 'Small segment first, monitor hourly', col4: 'Go / no-go' },
        ], docCode, DEMO_FOOTER),
      ];
    }
    return [
      simplePage('SPF Deep-Dive', 'One SPF record per domain, evaluated within the 10-lookup limit.', H, [
        { col1: 'Record Consolidation', col2: 'Duplicate TXT records merged', col3: 'Zero permerror responses', col4: 'DNS query' },
        { col1: 'Include Chain', col2: '_spf.google.com / platform includes', col3: 'Total lookups counted + documented', col4: 'Lookup audit' },
        { col1: 'Mechanism Order', col2: 'ip4 entries before includes where used', col3: 'No redirect loops', col4: 'Syntax check' },
        { col1: 'Softfail → Hardening', col2: '~all during testing, -all at enforcement', col3: 'Change logged with date', col4: 'Change record' },
      ], docCode, DEMO_FOOTER),
      simplePage('DKIM Verification', '2048-bit keys wherever the platform supports them; signatures verified from real test mail.', H, [
        { col1: 'Key Generation', col2: 'Platform-generated selector + public key TXT', col3: '2048-bit RSA minimum', col4: 'DNS published' },
        { col1: 'Selector Hygiene', col2: 'One active selector per service', col3: 'Retired selectors removed', col4: 'Register' },
        { col1: 'Header Test', col2: 'Authentication-Results inspected on test mail', col3: 'dkim=pass with aligned domain', col4: 'PASS' },
        { col1: 'Rotation', col2: 'Keys rotated on platform schedule', col3: 'Old key revoked after overlap', col4: 'Calendar' },
      ], docCode, DEMO_FOOTER),
      simplePage('DMARC Policy & Reporting', 'Policy tightens in stages while aggregate reports confirm legitimate sources are aligned.', H, [
        { col1: 'Stage 1 — Monitor', col2: 'p=none with rua reporting address', col3: '7–14 days of reports reviewed', col4: 'Report log' },
        { col1: 'Stage 2 — Quarantine', col2: 'p=quarantine pct=100', col3: 'Strict adkim/aspf alignment', col4: 'Report log' },
        { col1: 'Stage 3 — Reject', col2: 'p=reject for full enforcement', col3: 'Only after zero unexplained failures', col4: 'Sign-off' },
        { col1: 'Forensic Option', col2: 'ruf address where legally permitted', col3: 'Privacy reviewed', col4: 'Optional' },
      ], docCode, DEMO_FOOTER),
      simplePage('Tracking Domain, MX & Postmaster Checks', 'Supporting records that keep tracking branded and mail flow healthy.', H, [
        { col1: 'Custom Tracking CNAME', col2: 'Branded subdomain → platform endpoint', col3: 'SSL certificate active', col4: 'HTTPS check' },
        { col1: 'MX Integrity', col2: 'Workspace MX untouched by sending setup', col3: 'Inbound mail tested after changes', col4: 'Test mail' },
        { col1: 'Postmaster Registration', col2: 'Domains verified in Google Postmaster Tools', col3: 'Spam-rate dashboard reviewed weekly', col4: 'Account' },
        { col1: 'Blacklist Baseline', col2: 'Domain + sending IPs screened', col3: 'Delisting requested before warm-up if listed', col4: 'Baseline log' },
      ], docCode, DEMO_FOOTER),
    ];
  }
  // HSE continuations
  if (slug.includes('confined')) {
    return [
      ...matrixPages(['Matrix — Entry & Atmosphere', 'Matrix — Work Inside the Space'], RA_GENERIC_ROWS.slice(0, 8), docCode, DEMO_FOOTER),
      simplePage('Atmospheric Testing Log (Template)', 'Continuous 4-gas monitoring with logged readings at defined intervals. Alarm = evacuate immediately.', ['Parameter', 'Safe Range', 'Alarm Action', 'Frequency'], [
        { col1: 'Oxygen (O₂)', col2: '19.5% – 23.5%', col3: 'Evacuate + ventilate', col4: 'Continuous' },
        { col1: 'LEL (Flammables)', col2: '< 10% LEL', col3: 'Evacuate, no re-entry until cleared', col4: 'Continuous' },
        { col1: 'H₂S', col2: '< 10 ppm TWA', col3: 'Evacuate + respiratory protection review', col4: 'Continuous' },
        { col1: 'CO', col2: '< 25 ppm TWA', col3: 'Evacuate + source investigation', col4: 'Continuous' },
      ], docCode, DEMO_FOOTER),
      simplePage('Entry Control & Attendant Duties', 'The attendant never enters the space and never leaves the entry point while entrants are inside.', H, [
        { col1: 'Entry Permit', col2: 'Issued per entry, per shift', col3: 'Permit displayed at entry point [HOLD POINT]', col4: 'Permit board' },
        { col1: 'Attendant Log', col2: 'Entrant names, in/out times, comms checks', col3: 'Log updated in real time', col4: 'Entry log' },
        { col1: 'Retrieval System', col2: 'Tripod + winch rigged before entry', col3: 'Non-entry rescue is the default method', col4: 'Pre-entry check' },
        { col1: 'Ventilation', col2: 'Forced air, intake from clean zone', col3: 'Minimum air changes per assessment', col4: 'Flow check' },
      ], docCode, DEMO_FOOTER),
      simplePage('Rescue Plan Summary', 'Rescue arrangements are in place and briefed BEFORE entry — improvisation is not a rescue plan.', H, [
        { col1: 'Primary Method', col2: 'Non-entry retrieval (winch/harness)', col3: 'Tested at shift start', col4: 'Drill record' },
        { col1: 'Entry Rescue (Last Resort)', col2: 'Trained team with breathing apparatus only', col3: 'BA sets at entry point', col4: 'Competency certs' },
        { col1: 'Communications', col2: 'Radio check entrant ↔ attendant ↔ supervisor', col3: 'Backup signal agreed (line tugs)', col4: 'Comms log' },
        { col1: 'Drills', col2: 'Simulated rescue per project phase', col3: 'Timed + debriefed', col4: 'Drill report' },
      ], docCode, DEMO_FOOTER),
      ...matrixPages(['Matrix — Isolation & LOTO', 'Matrix — Ventilation & Access'], RA_PHASE_ROWS.slice(0, 8), docCode, DEMO_FOOTER),
      ...matrixPages(['Matrix — Monitoring & Housekeeping'], RA_GENERIC_ROWS.slice(8, 16), docCode, DEMO_FOOTER),
    ];
  }
  if (slug.includes('excavation') || sample.sample_type.toLowerCase().includes('jsa')) {
    const steps: Array<[string, RowBank]> = [
      ['Step Sequence — Preparation & Survey', [
        { col1: 'Review Drawings & Permits', col2: 'Utility drawings may be incomplete or outdated', col3: 'Permit-to-dig issued, drawings briefed at TBT', col4: 'Permit copy' },
        { col1: 'Mark Out Excavation', col2: 'Wrong location → service strike', col3: 'Survey pegs + spray lines verified with supervisor', col4: 'Walk-round' },
        { col1: 'Set Up Work Zone', col2: 'Public / plant interface', col3: 'Hard barriers + signage before breaking ground', col4: 'Checklist' },
        { col1: 'Brief the Crew (TBT)', col2: 'Unbriefed worker enters unsafe zone', col3: 'Task-specific TBT signed by all crew', col4: 'TBT record' },
      ]],
      ['Step Sequence — Utility Scan & Trial Pits', [
        { col1: 'CAT & Genny Scan', col2: 'Undetected live cable', col3: 'Calibrated scanner, trained operator, grid pattern scan [HOLD POINT]', col4: 'Scan record' },
        { col1: 'Hand-Dug Trial Pits', col2: 'Tool strike on service', col3: 'Insulated tools, hand-dig within 500 mm of marks', col4: 'Supervisor check' },
        { col1: 'Expose & Support Services', col2: 'Unsupported service sagging/damage', col3: 'Timber supports, service owner notified', col4: 'Photo record' },
        { col1: 'Re-Scan After Exposure', col2: 'Deeper unmarked services', col3: 'Second scan pass before machine dig', col4: 'Scan record' },
      ]],
      ['Step Sequence — Machine Excavation', [
        { col1: 'Position Excavator', col2: 'Plant overturn / edge surcharge', col3: 'Firm level pad, spoil ≥ 1 m from edge or per design', col4: 'Operator check' },
        { col1: 'Dig in Layers', col2: 'Undermining trench wall', col3: 'Shallow passes, banksman watching walls', col4: 'Visual' },
        { col1: 'Spoil Management', col2: 'Spoil rollback into trench', col3: 'Toe boards / stop blocks, haul route segregated', col4: 'Daily check' },
        { col1: 'Dewatering', col2: 'Water softening trench base', col3: 'Sump + pump, discharge to approved point', col4: 'Inspection' },
      ]],
      ['Step Sequence — Shoring & Access', [
        { col1: 'Install Support System', col2: 'Collapse during installation', col3: 'Install from safe position, designed system only [HOLD POINT]', col4: 'Competent person' },
        { col1: 'Ladder / Ramp Access', col2: 'Fall entering trench', col3: 'Secured ladders extending 1 m above lip, every 15 m', col4: 'Daily check' },
        { col1: 'Edge Protection', col2: 'Person or material falls in', col3: 'Guardrails or hard barriers at all open edges', col4: 'Walk-round' },
        { col1: 'Daily Inspection', col2: 'Ground movement after rain/weekend', col3: 'Competent-person inspection before each shift + after rain [HOLD POINT]', col4: 'Inspection form' },
      ]],
      ['Step Sequence — Work Inside the Excavation', [
        { col1: 'Pipe / Duct Laying', col2: 'Load swing over workers', col3: 'No workers under suspended loads, tag lines used', col4: 'Lift plan' },
        { col1: 'Compaction Works', col2: 'HAVS / plant interface', col3: 'HAVS log, pedestrian exclusion while compacting', col4: 'Log' },
        { col1: 'Housekeeping in Trench', col2: 'Trips in confined trench floor', col3: 'Materials stacked clear of access route', col4: 'Supervisor check' },
        { col1: 'Atmosphere Awareness', col2: 'Gas accumulation in deep trench', col3: 'Test atmosphere where depth/source requires', col4: 'Gas test record' },
      ]],
      ['Step Sequence — Backfill & Reinstatement', [
        { col1: 'Pre-Backfill Inspection', col2: 'Buried defect / unrecorded service', col3: 'As-built photos + inspection sign-off [HOLD POINT]', col4: 'Sign-off' },
        { col1: 'Layered Backfill', col2: 'Voids → later settlement', col3: '150–300 mm layers, compacted and tested per spec', col4: 'Test results' },
        { col1: 'Warning Tape & Markers', col2: 'Future dig strikes service', col3: 'Detectable tape 300 mm above service', col4: 'Photo record' },
        { col1: 'Surface Reinstatement', col2: 'Trip hazards at reopened route', col3: 'Level finish, barriers until surface accepted', col4: 'Handover check' },
      ]],
      ['Step Sequence — Close-Out', [
        { col1: 'Permit Closure', col2: 'Open permit hides live excavation', col3: 'Permit signed off only after reinstatement verified', col4: 'Permit office' },
        { col1: 'As-Built Records', col2: 'Future works rely on wrong data', col3: 'Survey + photos filed with document control', col4: 'Register' },
        { col1: 'Barrier Removal', col2: 'Premature public access', col3: 'Remove only on handover instruction', col4: 'Checklist' },
        { col1: 'Lessons Learned', col2: 'Repeat service near-misses', col3: 'Near-miss review into next JSA revision', col4: 'Register' },
      ]],
    ];
    return steps.map(([t, rows]) => simplePage(t, 'Each step is briefed to the crew before the shift starts; the JSA is re-validated if conditions change.', H, rows, docCode, DEMO_FOOTER));
  }
  if (slug.includes('lifting') || sample.sample_type.toLowerCase().includes('method')) {
    const secs: Array<[string, string, RowBank]> = [
      ['1. Scope & References', 'This statement covers the defined lifting scope only; variations require revision and re-approval.', [
        { col1: 'Applicable Codes', col2: 'LOLER / ASME B30 series / manufacturer manuals', col3: 'Current revisions held by document control', col4: 'Register' },
        { col1: 'Scope Boundary', col2: 'Loads, cranes and locations as listed in the lift plan', col3: 'Out-of-scope lifts need a new plan', col4: 'Plan' },
        { col1: 'Reference Drawings', col2: 'Plot plan + load charts [SITE INPUT REQUIRED]', col3: 'Verified revision at workface', col4: 'Doc control' },
        { col1: 'Interfaces', col2: 'SIMOPS with adjacent packages', col3: 'Daily coordination meeting', col4: 'Minutes' },
      ]],
      ['2. Roles & Responsibilities', 'Named, competent appointments for every lifting role — no informal substitution.', [
        { col1: 'Appointed Person', col2: 'Owns the lift plan and categorisation', col3: 'Competency certificate on file', col4: 'Appointment letter' },
        { col1: 'Lift Supervisor', col2: 'Controls the lift on the day', col3: 'Briefs crew, can stop the lift', col4: 'TBT record' },
        { col1: 'Crane Operator', col2: 'Operates within chart limits only', col3: 'Licence + medical current', col4: 'Cert check' },
        { col1: 'Slinger / Signaller', col2: 'Rigging and signals only', col3: 'Certified, uses standard signals / radio', col4: 'Cert check' },
      ]],
      ['3. Plant, Equipment & Certification', 'No equipment works without current third-party certification and pre-use checks.', [
        { col1: 'Crane Certification', col2: 'Third-party thorough examination current', col3: 'Cert displayed + copy in lift pack', col4: 'Register' },
        { col1: 'Lifting Accessories', col2: 'Slings, shackles, spreader beams colour-coded', col3: 'Quarantine bin for defective gear', col4: 'Gear register' },
        { col1: 'Ground Assessment', col2: 'Bearing capacity verified for outrigger loads', col3: 'Mats/pads sized per calculation [HOLD POINT]', col4: 'Calc sheet' },
        { col1: 'Pre-Use Checks', col2: 'Daily operator checklist before first lift', col3: 'Defects = machine stood down', col4: 'Checklist' },
      ]],
      ['4. Sequence of Operations — Rigging & Setup', 'Setup sequence is followed in order; shortcuts invalidate the lift plan.', [
        { col1: 'Position Crane', col2: 'Per plot plan, outriggers fully extended', col3: 'Level within manufacturer tolerance', col4: 'Supervisor check' },
        { col1: 'Rig the Load', col2: 'Sling angles ≥ design minimum, CoG confirmed', col3: 'Trial lift 100 mm to verify balance [HOLD POINT]', col4: 'Trial record' },
        { col1: 'Set Exclusion Zone', col2: 'Hard barriers at swing + drop radius', col3: 'Sentries posted at entry points', col4: 'Walk-round' },
        { col1: 'Comms Check', col2: 'Radio channel + hand-signal backup agreed', col3: 'All stations acknowledge', col4: 'Log' },
      ]],
      ['5. Sequence of Operations — The Lift', 'One signaller controls the lift. Any person may call STOP.', [
        { col1: 'Trial Lift', col2: 'Raise 100 mm, hold, check balance + brakes', col3: 'Abort and re-rig if load tilts', col4: 'Supervisor' },
        { col1: 'Travel / Slew', col2: 'Slow movements, tag lines controlling rotation', col3: 'Never over personnel — route pre-cleared', col4: 'Sentries' },
        { col1: 'Landing', col2: 'Load landed on prepared bearers', col3: 'Hands clear until load is stable', col4: 'Supervisor' },
        { col1: 'De-Rig', col2: 'Slings removed only after load secured', col3: 'Gear inspected before storage', col4: 'Gear register' },
      ]],
      ['6. Critical Lift Criteria', 'Lifts meeting any criterion are planned as critical with enhanced controls.', [
        { col1: '> 75% of Chart Capacity', col2: 'Utilisation calculated at worst radius', col3: 'Critical lift plan + AP sign-off [HOLD POINT]', col4: 'Plan' },
        { col1: 'Tandem / Multi-Crane', col2: 'Load share per crane calculated', col3: 'Single lift director, rehearsed signals', col4: 'Plan' },
        { col1: 'Personnel Lifting', col2: 'Only with certified man-basket + dedicated plan', col3: 'Separate approval [HOLD POINT]', col4: 'Permit' },
        { col1: 'Blind Lift', col2: 'Operator cannot see load or landing', col3: 'Relay signallers + CCTV where fitted', col4: 'Plan' },
      ]],
      ['7. Weather & Environmental Limits', 'Limits are hard stops, not guidance.', [
        { col1: 'Wind', col2: 'Stop at manufacturer limit or 20 kt default', col3: 'Anemometer at jib height', col4: 'Log' },
        { col1: 'Lightning', col2: '30-30 rule — stop, lower, stand clear', col3: 'Resume 30 min after last thunder', col4: 'Log' },
        { col1: 'Visibility', col2: 'Fog/darkness — lighting or postpone', col3: 'Signaller visible at all times', col4: 'Decision log' },
        { col1: 'Ground After Rain', col2: 'Re-verify bearing before resuming', col3: 'Re-inspection recorded', col4: 'Checklist' },
      ]],
      ['8. HSE Controls & PPE', 'Task PPE supplements — never substitutes — engineered controls.', [
        { col1: 'PPE Matrix', col2: 'Helmet, hi-vis, gloves (rigging), safety footwear', col3: 'Harness only where MEWP/basket work applies', col4: 'Issue record' },
        { col1: 'Exclusion Enforcement', col2: 'No entry under any circumstance during lift', col3: 'Sentries empowered to stop', col4: 'Briefing' },
        { col1: 'Housekeeping', col2: 'Rigging area kept clear of trip hazards', col3: 'Daily tidy of laydown', col4: 'Walk-round' },
        { col1: 'Fatigue', col2: 'Operator hours within site limits', col3: 'No lift with fatigued operator', col4: 'Roster' },
      ]],
      ['9. Quality — Inspection & Test Plan (Summary)', 'Hold and witness points agreed with the client inspector before work.', [
        { col1: 'Material Receiving', col2: 'Certs + visual inspection on delivery', col3: 'Witness point', col4: 'ITP sign' },
        { col1: 'Pre-Lift Inspection', col2: 'Crane + gear + ground verified', col3: 'Hold point', col4: 'ITP sign' },
        { col1: 'Trial Lift', col2: 'Balance and brake hold verified', col3: 'Hold point', col4: 'ITP sign' },
        { col1: 'Final Acceptance', col2: 'Load set and secured per drawing', col3: 'Sign-off before de-rig crew leaves', col4: 'ITP sign' },
      ]],
      ['10. Training & Competency Records', 'Copies held in the lift pack; originals with document control.', [
        { col1: 'Operator Licence', col2: 'Category-matched and in date', col3: 'Checked weekly against register', col4: 'Register' },
        { col1: 'Rigger Certification', col2: 'Level per national/company scheme', col3: 'Colour-coded ID', col4: 'Register' },
        { col1: 'Medical Fitness', col2: 'Fitness for role confirmed', col3: 'Expiry tracked', col4: 'Register' },
        { col1: 'Induction & Briefing', col2: 'Site induction + this statement briefed', col3: 'Signed briefing sheet', col4: 'File' },
      ]],
      ['11. Waste & Environmental Protection', 'Lifting operations protect ground and drains at setup and breakdown.', [
        { col1: 'Hydraulic Leaks', col2: 'Drip trays under parked plant', col3: 'Spill kit at crane pad', col4: 'Inspection' },
        { col1: 'Timber & Packing Waste', col2: 'Segregated at source', col3: 'Licensed removal route', col4: 'Waste log' },
        { col1: 'Noise', col2: 'Plant idling minimised near receptors', col3: 'Working hours respected', col4: 'Log' },
        { col1: 'Fuel Storage', col2: 'Bunded, away from drains', col3: 'Refuelling procedure followed', col4: 'Checklist' },
      ]],
      ['12. Management of Change', 'Any change to load, crane, ground, or sequence stops the job until re-planned.', [
        { col1: 'Change Trigger', col2: 'Different load weight/CoG or crane position', col3: 'STOP — notify Appointed Person', col4: 'MOC form' },
        { col1: 'Re-Planning', col2: 'Plan revised + re-briefed', col3: 'New revision number issued', col4: 'Doc control' },
        { col1: 'Field Copies', col2: 'Superseded plans withdrawn same shift', col3: 'Permit office check', col4: 'Register' },
        { col1: 'Crew Re-Brief', col2: 'Whole crew signs new revision', col3: 'No signature = no participation', col4: 'Briefing sheet' },
      ]],
      ['13. Records & Handover Pack', 'The completed lift pack is handed to document control at package close-out.', [
        { col1: 'Lift Plans (As-Used)', col2: 'Signed, with any field amendments marked', col3: 'Filed per package', col4: 'Pack index' },
        { col1: 'Checklists & Permits', col2: 'Daily checks + permits complete', col3: 'No gaps unexplained', col4: 'Pack index' },
        { col1: 'Incident / Near-Miss Reports', col2: 'All events logged, actions closed', col3: 'Lessons briefed to next package', col4: 'Register' },
        { col1: 'Certification Copies', col2: 'Crane + gear + personnel', col3: 'Valid at date of each lift', col4: 'Pack index' },
      ]],
      ['14. Interfaces With Other Contractors', 'Shared work areas are coordinated daily; assumptions are treated as hazards.', [
        { col1: 'SIMOPS Meeting', col2: 'Daily, all package supervisors', col3: 'Conflicts resolved before permits issue', col4: 'Minutes' },
        { col1: 'Shared Crane Use', col2: 'Booking system with priority rules', col3: 'No double-booking of radius zones', col4: 'Booking log' },
        { col1: 'Overhead Conflicts', col2: 'Adjacent cranes anti-collision briefing', col3: 'Slew limits set where fitted', col4: 'Plan' },
        { col1: 'Ground Sharing', col2: 'Outrigger zones kept clear by all trades', col3: 'Barriers respected site-wide', col4: 'Walk-round' },
      ]],
      ['15. Continuous Improvement', 'Each completed lift improves the next plan.', [
        { col1: 'Post-Lift Review', col2: 'Crew debrief after critical lifts', col3: 'Notes filed with plan', col4: 'Review note' },
        { col1: 'Near-Miss Trending', col2: 'Monthly review of lifting near-misses', col3: 'Actions tracked to close', col4: 'Register' },
        { col1: 'Plan Library', col2: 'Proven plans indexed for reuse (with re-validation)', col3: 'Re-validation mandatory per site', col4: 'Library' },
        { col1: 'Audit', col2: 'Quarterly lifting audit by HSE', col3: 'Findings to management review', col4: 'Audit report' },
      ]],
    ];
    return secs.map(([t, note, rows]) => simplePage(t, note, H, rows, docCode, DEMO_FOOTER));
  }
  // Default HSE: risk-assessment continuation sequence.
  return [
    ...matrixPages(
      ['Activity Matrix — Earthworks & Substructure', 'Activity Matrix — Formwork & Rebar', 'Activity Matrix — Steel & Roofing', 'Activity Matrix — MEP & Finishing'],
      RA_PHASE_ROWS, docCode, DEMO_FOOTER),
    ...matrixPages(
      ['Activity Matrix — Temporary Works & Electrics', 'Activity Matrix — Hot Works & Height', 'Activity Matrix — Plant & Logistics', 'Activity Matrix — Health Hazards', 'Activity Matrix — Traffic & Welfare', 'Activity Matrix — Weather & Fatigue', 'Activity Matrix — Interfaces & Public', 'Activity Matrix — Specialist Operations', 'Activity Matrix — Management Controls', 'Activity Matrix — Close-Out'],
      RA_GENERIC_ROWS, docCode, DEMO_FOOTER),
  ];
}

export function getSampleDocumentPages(
  sample: PortfolioSampleRecord
): SampleDocumentPage[] {
  const base = baseDocumentPages(sample);
  const target = Math.min(
    Math.max(sample.page_count ?? base.length, base.length),
    40
  );
  if (base.length >= target) return base;

  const docCode = base[0]?.docCode ?? 'SWA-DOC';
  const kind: 'ra' | 'jsa' | 'method' | 'dns' | 'arch' =
    sample.category === 'cold_email'
      ? sample.slug.includes('architecture') || sample.slug.includes('warmup')
        ? 'arch'
        : 'dns'
      : sample.slug.includes('excavation') ||
          sample.sample_type.toLowerCase().includes('jsa')
        ? 'jsa'
        : sample.slug.includes('lifting') ||
            sample.sample_type.toLowerCase().includes('method')
          ? 'method'
          : 'ra';

  const closers = closingPages(kind, docCode);
  const middle = continuationPages(sample, docCode);
  const pages = [...base];
  let i = 0;
  while (pages.length + closers.length < target && i < middle.length) {
    pages.push(middle[i]);
    i += 1;
  }
  // If the banks ran out before the target, repeat matrix continuations with
  // part numbers rather than leaving the document short.
  let part = 2;
  while (pages.length + closers.length < target) {
    const extra = matrixPages(
      [`Activity Matrix — Continuation Part ${part}`],
      RA_GENERIC_ROWS.slice(((part - 2) * 4) % RA_GENERIC_ROWS.length).concat(
        RA_GENERIC_ROWS.slice(0, ((part - 2) * 4) % RA_GENERIC_ROWS.length)
      ),
      docCode,
      DEMO_FOOTER
    );
    for (const p of extra) {
      if (pages.length + closers.length >= target) break;
      pages.push(p);
    }
    part += 1;
    if (part > 12) break;
  }
  pages.push(...closers);
  return pages.map((p, idx) => ({
    ...p,
    pageNumber: idx + 1,
    revLabel: p.revLabel.includes('Rev. 0') && !p.revLabel.includes('Page')
      ? `Rev. 0 · Page ${idx + 1}`
      : p.revLabel,
  }));
}
