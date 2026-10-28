import test from 'node:test';
import assert from 'node:assert/strict';
import {
  shouldShowWelcome,
  markWelcomeSeen,
  resetWelcomeSeen,
  WELCOME_STORAGE_KEY,
  WELCOME_AUTO_DISMISS_MS,
  type StorageLike,
} from './welcomeState';
import { validateInquiryInput, validateSampleInput } from './validation';
import { getPackagesForService, pricingTiers } from '../config/servicesConfig';
import { siteConfig } from '../config/siteConfig';
import {
  paginateSamples,
  getSampleDocumentPages,
  GALLERY_PAGE_SIZE,
} from './sampleDocuments';

function createMemoryStorage(): StorageLike {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => {
      map.set(k, v);
    },
    removeItem: (k: string) => {
      map.delete(k);
    },
  };
}

test('AtharWorld welcome experience auto-dismiss duration is within 2-3 seconds and persists per session', () => {
  assert.ok(
    WELCOME_AUTO_DISMISS_MS >= 2000 && WELCOME_AUTO_DISMISS_MS <= 3000,
    'Auto-dismiss timer must be between 2000ms and 3000ms'
  );
  const storage = createMemoryStorage();
  assert.equal(shouldShowWelcome({ searchQuery: '', storage }), true);

  markWelcomeSeen(storage);
  assert.equal(storage.getItem(WELCOME_STORAGE_KEY), '1');
  assert.equal(shouldShowWelcome({ searchQuery: '', storage }), false);

  resetWelcomeSeen(storage);
  assert.equal(shouldShowWelcome({ searchQuery: '', storage }), true);
});

test('Hero configuration uses the exact editorial eyebrow, headline, supporting copy, and descriptor', () => {
  assert.equal(
    siteConfig.hero.eyebrow,
    'SAFETYWITHATHAR / INDEPENDENT SPECIALIST / WORKING WORLDWIDE'
  );
  assert.equal(
    siteConfig.hero.headline,
    'Precision for the inbox. Clarity for the worksite.'
  );
  assert.equal(
    siteConfig.hero.supportingLine,
    'Cold email infrastructure and remote HSE documentation, engineered around your requirements.'
  );
  assert.equal(
    siteConfig.hero.descriptor,
    'COLD EMAIL SYSTEMS  /  HSE DOCUMENTATION'
  );
});

test('AtharWorld welcome experience respects ?autostart=1 and ?welcome=1 overrides', () => {
  const storage = createMemoryStorage();
  assert.equal(shouldShowWelcome({ searchQuery: '?autostart=1', storage }), false);

  markWelcomeSeen(storage);
  assert.equal(shouldShowWelcome({ searchQuery: '?welcome=1', storage }), true);
});

test('validateInquiryInput rejects invalid fields with specific error messages and passes valid inquiries', () => {
  const invalidResult = validateInquiryInput({
    name: 'A',
    email: 'invalid-email',
    service: 'invalid_lane',
    packageTier: 'basic',
    message: 'Too short',
  });

  assert.equal(invalidResult.valid, false);
  assert.equal(invalidResult.isSpamHoneypot, false);
  assert.ok(invalidResult.errors.name);
  assert.ok(invalidResult.errors.email);
  assert.ok(invalidResult.errors.service);
  assert.ok(invalidResult.errors.message);

  const validResult = validateInquiryInput({
    name: 'Engr. Tariq Mahmood',
    email: 'tariq@example.com',
    service: 'hse_docs',
    packageTier: 'standard',
    message: 'We need an activity-based Risk Assessment for 18 civil excavation activities.',
    pageSource: '/safetywithathar/#inquiry',
  });

  assert.equal(validResult.valid, true);
  assert.equal(validResult.isSpamHoneypot, false);
  assert.equal(validResult.sanitized?.email, 'tariq@example.com');
  assert.equal(validResult.sanitized?.service, 'hse_docs');
  assert.equal(validResult.sanitized?.packageTier, 'standard');
});

test('validateInquiryInput detects honeypot spam submissions', () => {
  const spamResult = validateInquiryInput({
    name: 'Bot User',
    email: 'bot@example.com',
    service: 'cold_email',
    packageTier: 'basic',
    message: 'Valid length message from automated filler script.',
    honeypot: 'http://spam-link.example',
  });

  assert.equal(spamResult.valid, false);
  assert.equal(spamResult.isSpamHoneypot, true);
});

test('validateSampleInput enforces permission & redaction confirmation before publishing', () => {
  const unconfirmedPublish = validateSampleInput({
    title: 'Pipeline Hydrotest Risk Assessment',
    category: 'hse_docs',
    sample_type: 'Risk Assessment',
    summary: 'Sanitized 5x5 risk assessment for pipeline hydrotesting operations.',
    is_published: true,
    permission_confirmed: false,
  });

  assert.equal(unconfirmedPublish.valid, false);
  assert.ok(unconfirmedPublish.error?.includes('permission'));

  const confirmedPublish = validateSampleInput({
    title: 'Pipeline Hydrotest Risk Assessment',
    category: 'hse_docs',
    sample_type: 'Risk Assessment',
    summary: 'Sanitized 5x5 risk assessment for pipeline hydrotesting operations.',
    is_published: true,
    permission_confirmed: true,
  });

  assert.equal(confirmedPublish.valid, true);
  assert.equal(confirmedPublish.slug, 'pipeline-hydrotest-risk-assessment');
});

test('servicesConfig keeps Cold Email Standard $50 tier explicitly marked as draft_owner_decision', () => {
  const coldEmailStandard = pricingTiers.find(
    (t) => t.serviceId === 'cold_email' && t.id === 'standard'
  );
  assert.ok(coldEmailStandard);
  assert.equal(coldEmailStandard.priceUsd, 50);
  assert.equal(coldEmailStandard.status, 'draft_owner_decision');
  assert.equal(getPackagesForService('cold_email').length, 4);
  assert.equal(getPackagesForService('hse_docs').length, 4);
});

test('Sample gallery paginates up to 6 cards per view and generates Page-1 document sheets', () => {
  assert.equal(GALLERY_PAGE_SIZE, 6);
  const sevenItems = Array.from({ length: 7 }, (_, i) => ({ id: `s_${i + 1}` }));
  const page1 = paginateSamples(sevenItems, 1);
  assert.equal(page1.visibleItems.length, 6);
  assert.equal(page1.totalPages, 2);

  const page2 = paginateSamples(sevenItems, 2);
  assert.equal(page2.visibleItems.length, 1);

  const pages = getSampleDocumentPages({
    id: 'test-1',
    created_at: '',
    updated_at: '',
    title: 'Pipeline Risk Assessment',
    slug: 'pipeline-risk-assessment',
    category: 'hse_docs',
    sample_type: 'Risk Assessment',
    summary: 'Structured 5x5 risk matrix for pipeline hydrotesting.',
    description: '',
    tags: [],
    storage_path: null,
    thumbnail_path: null,
    file_type: 'PDF',
    source_label: 'Public-source demo sample',
    revision_label: 'Rev. 0',
    sort_order: 1,
    is_published: true,
    permission_confirmed: true,
  });

  assert.ok(pages.length >= 1);
  assert.equal(pages[0].pageNumber, 1);
  assert.ok(pages[0].rows.length >= 3);
});

