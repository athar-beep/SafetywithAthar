export type ServiceId = 'cold_email' | 'hse_docs';
export type PackageTierId = 'basic' | 'standard' | 'premium' | 'custom';

export interface ServiceLaneConfig {
  id: ServiceId;
  anchorId: string;
  badgeText: string;
  title: string;
  subtitle: string;
  accentColor: 'blue' | 'orange';
  keyHighlight: string;
  deliverables: string[];
  disclaimer: string;
}

export interface PricingTier {
  id: PackageTierId;
  serviceId: ServiceId;
  name: string;
  priceUsd: number;
  currency: 'USD';
  status: 'published' | 'draft_owner_decision';
  summary: string;
  deliverables: string[];
  turnaround: string;
  revisions: string;
  ownerDecisionNote?: string;
}

export const serviceLanes: ServiceLaneConfig[] = [
  {
    id: 'cold_email',
    anchorId: 'lane-cold-email',
    badgeText: 'Lane A · Technical Sending Infrastructure',
    title: 'Cold Email Infrastructure Setup',
    subtitle:
      'Clean DNS authentication, secondary sending domain architecture, and mailbox configuration built for dependable outbound operations.',
    accentColor: 'blue',
    keyHighlight:
      'Focused on verifiable SPF, DKIM, and DMARC alignment, mailbox health checks, and structured warm-up readiness.',
    deliverables: [
      'SPF, DKIM (2048-bit where supported), and DMARC policy configuration & syntax verification',
      'Secondary domain and mailbox sending setup across Google Workspace or Microsoft 365',
      'Custom tracking domain CNAME alignment, MX routing checks, and blacklist baseline audit',
      'Practical warm-up schedule guidance and technical campaign readiness checklist',
    ],
    disclaimer:
      'Note: Technical authentication and clean sending configuration improve deliverability readiness, but never guarantee inbox placement on their own.',
  },
  {
    id: 'hse_docs',
    anchorId: 'lane-hse-docs',
    badgeText: 'Lane B · Remote Safety Engineering',
    title: 'HSE Documentation (Remote)',
    subtitle:
      'Activity-based Risk Assessments, JSA/JHA, Method Statements, HSE Plans, and inspection checklists structured for construction & industrial work packs.',
    accentColor: 'orange',
    keyHighlight:
      'You share your site inputs and work-pack data — I return controlled, audit-ready documents. Missing data is marked clearly, never invented.',
    deliverables: [
      'Activity-based Risk Assessments (5×5 initial & residual risk matrices with hierarchy of controls)',
      'Job Safety Analyses (JSA / JHA) broken down by task sequence, specific hazards, and hold points',
      'Method Statements (MOS / RAMS), Project HSE Plans, and custom site inspection checklists',
      'Delivered in editable Microsoft Word (.docx) and formatted PDF with clear revision blocks',
    ],
    disclaimer:
      'Note: All deliverables are professional drafts prepared for review, verification, and formal approval by your client or site HSE authority. No automatic site approval or legal certification is implied.',
  },
];

export const pricingTiers: PricingTier[] = [
  // Cold Email Tiers
  {
    id: 'basic',
    serviceId: 'cold_email',
    name: 'Basic',
    priceUsd: 20,
    currency: 'USD',
    status: 'published',
    summary: 'Single-domain technical authentication foundation.',
    deliverables: [
      '1 sending domain configured',
      'SPF record setup & consolidation check',
      'DKIM cryptographic signing configuration',
      'DMARC policy record deployment & verification',
    ],
    turnaround: 'From 2 days (after DNS access/inputs)',
    revisions: 'Configuration verification included',
  },
  {
    id: 'standard',
    serviceId: 'cold_email',
    name: 'Standard',
    priceUsd: 50,
    currency: 'USD',
    status: 'draft_owner_decision',
    summary: 'Mid-tier cold email setup package — awaiting owner scope lock.',
    deliverables: [
      'Deliverables for the $50 Standard tier are not yet defined in the source brief.',
      'No fabricated deliverables are shown publicly.',
      'Select "Ask a Question" or message on WhatsApp to confirm exact $50 scope for your domains.',
    ],
    turnaround: 'Confirmed upon scope definition',
    revisions: 'Confirmed upon scope definition',
    ownerDecisionNote:
      'Owner Action Required: Deliverables for Cold Email Standard ($50) are pending definition in the source brief.',
  },
  {
    id: 'premium',
    serviceId: 'cold_email',
    name: 'Premium',
    priceUsd: 100,
    currency: 'USD',
    status: 'published',
    summary: 'Complete authentication setup plus structured warm-up guidance.',
    deliverables: [
      'Full SPF, DKIM, and DMARC setup & alignment check',
      'Domain & mailbox sending configuration check',
      'Structured warm-up pacing & ramp-up guidance',
      'Pre-launch technical campaign readiness review',
    ],
    turnaround: 'From 2–3 days (after complete inputs)',
    revisions: '1 post-setup verification check',
  },

  // HSE Documentation Tiers
  {
    id: 'basic',
    serviceId: 'hse_docs',
    name: 'Basic',
    priceUsd: 5,
    currency: 'USD',
    status: 'published',
    summary: 'Focused single-document JSA/JHA or inspection checklist.',
    deliverables: [
      '1 JSA/JHA or custom HSE checklist',
      'Covers up to 10 work activities',
      'Editable Word (.docx) + formatted PDF handover',
      'Clear flagging of any missing site inputs',
    ],
    turnaround: '2-day turnaround (after inputs received)',
    revisions: '1 revision included',
  },
  {
    id: 'standard',
    serviceId: 'hse_docs',
    name: 'Standard',
    priceUsd: 10,
    currency: 'USD',
    status: 'published',
    summary: 'Comprehensive activity-based Risk Assessment with 5×5 matrix.',
    deliverables: [
      'Activity-based Risk Assessment (up to 25 activities)',
      '5×5 risk matrix with initial and residual risk scoring',
      'Hierarchy-of-controls actions & designated hold points',
      'Editable Word (.docx) + formatted PDF handover',
    ],
    turnaround: '3-day turnaround (after inputs received)',
    revisions: '2 revisions included',
  },
  {
    id: 'premium',
    serviceId: 'hse_docs',
    name: 'Premium',
    priceUsd: 15,
    currency: 'USD',
    status: 'published',
    summary: 'Full work-package safety pack: RA + Method Statement + JSA.',
    deliverables: [
      'Risk Assessment + Method Statement + JSA pack for 1 work package',
      'Covers up to 40 work activities across the package',
      '5×5 initial/residual matrix, sequence of operations & hold points',
      'Editable Word (.docx) + formatted PDF handover',
    ],
    turnaround: '5-day turnaround (after inputs received)',
    revisions: '2 revisions included',
  },
];

export const pricingPolicyNote =
  'Custom scope? Message me first — pricing confirmed before any work starts.';
export const pricingTimingNote =
  'All listed prices are in USD. Turnaround timing starts once required site or domain inputs are received and scope is confirmed.';

export function getPackagesForService(serviceId: ServiceId): Array<{
  value: PackageTierId;
  label: string;
}> {
  if (serviceId === 'cold_email') {
    return [
      { value: 'basic', label: 'Basic — $20 USD (1 Domain SPF/DKIM/DMARC)' },
      { value: 'standard', label: 'Standard — $50 USD (Scope confirmed on inquiry)' },
      { value: 'premium', label: 'Premium — $100 USD (Setup + Warm-Up Guidance)' },
      { value: 'custom', label: 'Custom Scope (Confirm pricing before work starts)' },
    ];
  }
  return [
    { value: 'basic', label: 'Basic — $5 USD (1 JSA/JHA or Checklist, up to 10 activities)' },
    { value: 'standard', label: 'Standard — $10 USD (Activity-Based RA, up to 25 activities)' },
    { value: 'premium', label: 'Premium — $15 USD (RA + Method Statement + JSA Pack, up to 40 activities)' },
    { value: 'custom', label: 'Custom Scope (Confirm pricing before work starts)' },
  ];
}
