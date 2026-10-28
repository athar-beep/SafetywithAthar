export interface NavItem {
  label: string;
  href: string;
}

export interface StatItem {
  label: string;
  subnote?: string;
}

export interface ProcessStep {
  stepNumber: string;
  title: string;
  description: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const siteConfig = {
  brandName: 'SafetyWithAthar',
  welcomeBrand: 'AtharWorld',
  welcomeTitle: 'Welcome to AtharWorld',
  welcomeTagline: 'Where Precision Meets Possibility.',
  welcomeCta: 'Enter My World',
  ownerName: 'Muhammad Athar',
  ownerRole: 'Safety Officer & Cold Email Infrastructure Specialist',
  location: 'Pakistan • Working worldwide, remotely',
  basePath: '/safetywithathar',
  targetUrl: 'https://athar-beep.github.io/safetywithathar/',

  contact: {
    email: 'muhammadatharhse@gmail.com',
    mailtoUrl: 'mailto:muhammadatharhse@gmail.com?subject=Inquiry%20%E2%80%94%20SafetyWithAthar',
    whatsappUrl:
      'https://wa.me/923414826804?text=Hi%20Athar%2C%20I%20want%20to%20ask%20about%20your%20services.',
    linkedinUrl: 'https://www.linkedin.com/in/muhammad-athar-ba35a1257/',
    fiverrUrl: 'https://www.fiverr.com/safetywithathar',
    // Upwork and Freelancer URLs are intentionally null until owner supplies exact verified URLs
    upworkUrl: null as string | null,
    freelancerUrl: null as string | null,
  },

  navLinks: [
    { label: 'Services', href: '#services' },
    { label: 'Samples', href: '#samples' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Process', href: '#process' },
    { label: 'About', href: '#about' },
    { label: 'FAQ', href: '#faq' },
  ] satisfies NavItem[],

  footerLinks: [
    { label: 'Services', href: '#services' },
    { label: 'Samples', href: '#samples' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Process', href: '#process' },
    { label: 'About', href: '#about' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#inquiry' },
  ] satisfies NavItem[],

  hero: {
    eyebrow: 'SAFETYWITHATHAR / INDEPENDENT SPECIALIST / WORKING WORLDWIDE',
    headline: 'Precision for the inbox. Clarity for the worksite.',
    supportingLine:
      'Cold email infrastructure and remote HSE documentation, engineered around your requirements.',
    descriptor: 'COLD EMAIL SYSTEMS  /  HSE DOCUMENTATION',
    trustStrip: 'NEBOSH IGC (Credit) • SPF / DKIM / DMARC Specialist • Remote • Worldwide',
  },

  statsStrip: [
    {
      label: '39-page sample Risk Assessment',
      subnote: 'Structured activity-based hazard & control breakdown',
    },
    {
      label: '~2.7 years on-site HSE — NESPAK • M. Saddique Ch & Co',
      subnote: 'Practical civil & construction field background',
    },
    {
      label: 'Delivery from 2 days',
      subnote: 'Actual turnaround depends on scope and complete inputs',
    },
    {
      label: '100% remote • Worldwide',
      subnote: 'Clear asynchronous handover in Word, PDF, and DNS records',
    },
  ] satisfies StatItem[],

  processSteps: [
    {
      stepNumber: '01',
      title: 'Message with your scope.',
      description:
        'Share your domain/mailbox environment or your construction work-pack, site conditions, and activity list.',
    },
    {
      stepNumber: '02',
      title: 'Price and timeline confirmed.',
      description:
        'You receive a clear confirmation of deliverables, required inputs, USD price, and delivery window before any work begins.',
    },
    {
      stepNumber: '03',
      title: 'Draft delivered (Word + PDF where relevant).',
      description:
        'Receive verified DNS/mailbox configurations or controlled editable Word + PDF HSE drafts with missing site inputs clearly flagged.',
    },
    {
      stepNumber: '04',
      title: 'Revisions and final handover.',
      description:
        'Included package revisions are completed promptly so your team or site HSE authority can review and sign off.',
    },
  ] satisfies ProcessStep[],

  about: {
    heading: 'Muhammad Athar — Safety Officer',
    bioPrimary:
      'With approximately 2.7 years of on-site construction HSE experience with NESPAK and M. Saddique Ch & Co, I bridge field-tested safety documentation standards with disciplined technical execution.',
    bioSecondary:
      'Operating remotely worldwide, I provide two specialized technical services: audit-ready HSE documentation drafted strictly from your work-pack inputs, and clean SPF, DKIM, and DMARC cold-email infrastructure configuration.',
    coreCredentials: ['NEBOSH IGC (Credit)', 'IOSH Managing Safely', 'OSHA 30-Hr'],
    certificationList: [
      'NEBOSH IGC (Credit)',
      'IOSH MS',
      'OSHA 30-Hr',
      'Highfield L2 Risk Assessment',
      'Highfield L3 First Aid',
      'COSHH',
      'Fire Safety',
    ],
    verificationNote:
      'Owner portrait asset is currently set to an abstract monogram emblem pending a full-colour owner photograph. All listed certifications are subject to owner verification prior to public certificate file attachment.',
  },

  faqs: [
    {
      id: 'turnaround',
      question: 'What is your typical turnaround time?',
      answer:
        'Turnaround starts from 2 days for defined package scopes once all required site or domain inputs are received and confirmed. Custom or multi-package scopes require individual timeline confirmation before work begins.',
    },
    {
      id: 'hse-inputs',
      question: 'What HSE inputs are needed to prepare my documents?',
      answer:
        'Please share your scope or work pack, activity sequence, equipment and materials list, site conditions, workforce roles, applicable client/site HSE requirements, and existing controls. If any site data is missing, I ask clarifying questions and flag hold points clearly rather than inventing data.',
    },
    {
      id: 'site-approval',
      question: 'Are the HSE documents automatically site-approved?',
      answer:
        'No automatic approval is implied. Every Risk Assessment, JSA/JHA, Method Statement, or HSE Plan is delivered as a controlled professional draft for review, adaptation, and formal sign-off by your client or site responsible HSE authority.',
    },
    {
      id: 'inbox-placement',
      question: 'Can you guarantee inbox placement for cold email?',
      answer:
        'No. Correct SPF, DKIM, DMARC, custom tracking domain, and mailbox configuration establish strong technical readiness, but inbox placement also depends on domain reputation, recipient filters, sending volume, and copy. I never make guaranteed-deliverability claims.',
    },
    {
      id: 'payments',
      question: 'How do payments work?',
      answer:
        'Orders are handled through agreed Fiverr escrow arrangements (or Upwork where configured). There are no direct credit-card checkouts or payment forms on this website.',
    },
    {
      id: 'revisions',
      question: 'What about revisions?',
      answer:
        'Each HSE documentation package includes a defined number of revisions (1 revision on Basic, 2 revisions on Standard and Premium) for adjustments within the original scope. Scope expansions or additional revisions are agreed transparently before extra work proceeds.',
    },
  ] satisfies FaqItem[],

  footerCopyright:
    '© 2026 SafetyWithAthar — Muhammad Athar • Pakistan • Working worldwide, remotely.',
};
