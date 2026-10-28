import type { PackageTierId, ServiceId } from '../config/servicesConfig';

export interface InquiryFormInput {
  name: string;
  email: string;
  service: string;
  packageTier: string;
  message: string;
  honeypot?: string;
  pageSource?: string;
  idempotencyKey?: string;
}

export interface InquiryFieldErrors {
  name?: string;
  email?: string;
  service?: string;
  packageTier?: string;
  message?: string;
}

export interface InquiryValidationResult {
  valid: boolean;
  isSpamHoneypot: boolean;
  errors: InquiryFieldErrors;
  sanitized?: {
    name: string;
    email: string;
    service: ServiceId;
    packageTier: PackageTierId;
    message: string;
    pageSource: string;
    idempotencyKey: string;
  };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const VALID_SERVICES: ServiceId[] = ['cold_email', 'hse_docs'];
const VALID_PACKAGES: PackageTierId[] = ['basic', 'standard', 'premium', 'custom'];

export function validateInquiryInput(input: InquiryFormInput): InquiryValidationResult {
  const honeypot = (input.honeypot ?? '').trim();
  if (honeypot.length > 0) {
    return {
      valid: false,
      isSpamHoneypot: true,
      errors: {},
    };
  }

  const errors: InquiryFieldErrors = {};
  const name = (input.name ?? '').trim();
  const email = (input.email ?? '').trim().toLowerCase();
  const service = (input.service ?? '').trim() as ServiceId;
  const packageTier = (input.packageTier ?? '').trim() as PackageTierId;
  const message = (input.message ?? '').trim();

  if (name.length < 2) {
    errors.name = 'Please enter your name (at least 2 characters).';
  } else if (name.length > 100) {
    errors.name = 'Name must be 100 characters or fewer.';
  }

  if (!email) {
    errors.email = 'Please enter your email address.';
  } else if (!EMAIL_REGEX.test(email) || email.length > 160) {
    errors.email = 'Please enter a valid email address (e.g. name@domain.com).';
  }

  if (!VALID_SERVICES.includes(service)) {
    errors.service = 'Please select a valid service lane.';
  }

  if (!VALID_PACKAGES.includes(packageTier)) {
    errors.packageTier = 'Please select a valid package option.';
  }

  if (message.length < 20) {
    errors.message = `Please share at least 20 characters describing your scope (currently ${message.length}).`;
  } else if (message.length > 3000) {
    errors.message = 'Message must be 3,000 characters or fewer.';
  }

  const valid = Object.keys(errors).length === 0;

  if (!valid) {
    return {
      valid: false,
      isSpamHoneypot: false,
      errors,
    };
  }

  return {
    valid: true,
    isSpamHoneypot: false,
    errors: {},
    sanitized: {
      name,
      email,
      service,
      packageTier,
      message,
      pageSource: (input.pageSource ?? '/safetywithathar/').slice(0, 200),
      idempotencyKey: (input.idempotencyKey ?? `inq_${Date.now()}`).slice(0, 120),
    },
  };
}

export interface PortfolioSampleInput {
  title: string;
  slug?: string;
  category: 'hse_docs' | 'cold_email';
  sample_type: string;
  summary: string;
  description?: string;
  tags?: string[];
  source_label?: string;
  revision_label?: string;
  sort_order?: number;
  is_published: boolean;
  permission_confirmed: boolean;
  page_count?: number;
  highlights?: string[];
}

export interface SampleValidationResult {
  valid: boolean;
  error?: string;
  slug: string;
}

export function slugifyTitle(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function validateSampleInput(input: PortfolioSampleInput): SampleValidationResult {
  const title = (input.title ?? '').trim();
  const sampleType = (input.sample_type ?? '').trim();
  const summary = (input.summary ?? '').trim();
  const slug = slugifyTitle(input.slug && input.slug.trim() ? input.slug : title);

  if (title.length < 3) {
    return { valid: false, error: 'Sample title must be at least 3 characters.', slug };
  }
  if (!['hse_docs', 'cold_email'].includes(input.category)) {
    return { valid: false, error: 'Category must be HSE Documentation or Cold Email Setup.', slug };
  }
  if (sampleType.length < 2) {
    return { valid: false, error: 'Sample type is required (e.g. Risk Assessment, Setup Checklist).', slug };
  }
  if (summary.length < 15) {
    return { valid: false, error: 'Summary must be at least 15 characters.', slug };
  }
  if (input.is_published && !input.permission_confirmed) {
    return {
      valid: false,
      error:
        'Before publishing, you must confirm ownership/permission to share and verify that all confidential client/site data is redacted.',
      slug,
    };
  }

  return { valid: true, slug };
}
