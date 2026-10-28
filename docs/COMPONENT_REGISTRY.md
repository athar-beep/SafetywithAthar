# SafetyWithAthar — Component Registry (`docs/COMPONENT_REGISTRY.md`)

**Brand:** SafetyWithAthar · AtharWorld  
**Visual System:** Glossy Obsidian Glassmorphism (`#08090B` to `#111418`), translucent graphite glass panels, `Syne` editorial display typography paired with `Sora` / `Manrope` body copy and `JetBrains Mono` technical metadata, bright silver headings (`#E7E9ED`), Electric Blue (`#38BDF8`) for Cold Email Infrastructure (`inbox`), and Safety Orange (`#F97316`) for Remote HSE Documentation (`worksite`).  
**Motion Contract:** Only `transform` and `opacity` are animated; `prefers-reduced-motion: reduce` disables transitions/animations immediately.

---

## 1. Configuration & Pure Logic Modules

| Module Path | Responsibility | Key Exports |
| :--- | :--- | :--- |
| `src/config/siteConfig.ts` | Single source of truth for brand copy, AtharWorld welcome messages, editorial hero copy, contact URLs (WhatsApp, LinkedIn, Fiverr, mailto), trust strip, stats strip, process steps, About bio/certifications, and 6 honest FAQs. | `siteConfig` |
| `src/config/servicesConfig.ts` | Service lane definitions, USD pricing tiers (including Cold Email Standard $50 flagged as `draft_owner_decision`), disclaimers, and service-to-package mapping. | `serviceLanes`, `pricingTiers`, `getPackagesForService` |
| `src/utils/welcomeState.ts` | Pure session-scoped visibility state and 2.6s auto-skip timing (`WELCOME_AUTO_DISMISS_MS = 2600`) for the AtharWorld welcome experience (`sessionStorage`, `?autostart=1`, `?welcome=1`). | `shouldShowWelcome`, `markWelcomeSeen`, `resetWelcomeSeen`, `WELCOME_STORAGE_KEY`, `WELCOME_AUTO_DISMISS_MS` |
| `src/utils/validation.ts` | Pure validation for inquiry form submissions (field checks, honeypot check, sanitization) and admin portfolio sample publishing (`permission_confirmed` enforcement). | `validateInquiryInput`, `validateSampleInput`, `slugifyTitle` |
| `src/utils/sampleDocuments.ts` | Structured Page-1 miniature document/configuration sheet builder, multi-page document reader data, and 6-card gallery pagination (`GALLERY_PAGE_SIZE = 6`). | `getSampleDocumentPages`, `paginateSamples`, `GALLERY_PAGE_SIZE` |
| `src/utils/validation.test.ts` | Node `node:test` unit test suite verifying welcome state, 2.6s auto-dismiss timer, hero copy, 6-card gallery pagination, Page-1 document preview generation, inquiry validation, honeypot detection, and sample publishing guard. | Unit tests |

---

## 2. Design System UI Primitives

| Component | Path | Description |
| :--- | :--- | :--- |
| `PillGlassButton` | `src/components/ui/PillGlassButton.tsx` | Capsule/pill-shaped glassmorphism CTA button (`rounded-full`, translucent fill, specular top highlight, thin border, 44px+ touch target, keyboard focus ring). Renders `<button>` or `<a>`. |
| `GlassPanel` | `src/components/ui/GlassPanel.tsx` | Translucent obsidian/graphite glass surface with top specular highlight line and optional lane edge glow (`blue`, `orange`, `silver`). |
| `SectionHeading` | `src/components/ui/SectionHeading.tsx` | Editorial section heading with optional index label (`01.`–`07.`), balanced display typography, and subtitle. |

---

## 3. Feature & Section Components

| Component | Path | Description |
| :--- | :--- | :--- |
| `WelcomeOverlay` | `src/components/WelcomeOverlay.tsx` | **Welcome Experience — AtharWorld**: Displays *“Welcome to AtharWorld”* and *“Where Precision Meets Possibility.”* with glossy black glassmorphism, soft reflections, *“Enter My World”* pill-glass CTA, *“Skip”* button, and **automatic 2.6s self-skip** with a sleek progress bar. |
| `SiteNav` | `src/components/SiteNav.tsx` | Sticky 3-zone top bar: `SafetyWithAthar` wordmark, 6 single-line nav links, `Get a Quote` pill-glass CTA, and accessible mobile menu drawer. |
| `HeroSection` | `src/components/HeroSection.tsx` | Art-directed editorial hero with `SAFETYWITHATHAR / INDEPENDENT SPECIALIST / WORKING WORLDWIDE` eyebrow, oversized `Syne` two-line headline (*“Precision for the inbox. Clarity for the worksite.”* with electric-blue *inbox* and safety-orange *worksite*), calm supporting copy, `COLD EMAIL SYSTEMS / HSE DOCUMENTATION` descriptor, dual pill-glass CTAs, interactive Technical Specification glass ledger, Trust Strip, and Stats Strip. |
| `ServiceLanesSection` | `src/components/ServiceLanesSection.tsx` | Lane A (Cold Email Infrastructure Setup — electric blue) and Lane B (HSE Documentation Remote — safety orange) with required disclaimers and `Order on Fiverr`, `WhatsApp`, and `LinkedIn` pill-glass actions. |
| `SampleGallerySection` | `src/components/SampleGallerySection.tsx` | **Always-Visible Document Preview Gallery**: Displays up to 6 compact near-square cards in a 3×2 desktop / 2-col mobile grid with immediate Page-1 document/configuration previews (`MiniatureDocumentPreview`), pagination when >6 samples exist, category filters, and a full scrollable multi-page document reader + PDF download (`/api/samples/:id/document.pdf`). |
| `PricingSection` | `src/components/PricingSection.tsx` | USD package tables for Cold Email ($20 / $50 Draft / $100) and HSE Documentation ($5 / $10 / $15) with `Order on Fiverr`, `WhatsApp`, and `Ask a Question` pill-glass CTAs. |
| `ProcessAboutFaqSection` | `src/components/ProcessAboutFaqSection.tsx` | 4-step execution protocol, About section (`Muhammad Athar — Safety Officer` with monogram placeholder and unboxed certification list), and 6 honest FAQ accordions. |
| `InquirySection` | `src/components/InquirySection.tsx` | Service inquiry form (not visitor registration) with inline validation, honeypot field, idempotency token, and all 7 honest outcome banners. |
| `AdminModal` | `src/components/AdminModal.tsx` | Private `/admin` owner dashboard for sample creation, mandatory redaction/ownership confirmation, publish/unpublish toggling, deletion, and inquiry review. |
| `SiteFooter` | `src/components/SiteFooter.tsx` | Contact band, quick navigation links, copyright notice, and *“Replay AtharWorld Welcome”* trigger. |
| `WhatsAppFloat` | `src/components/WhatsAppFloat.tsx` | Floating bottom-right pill-glass WhatsApp button. |
