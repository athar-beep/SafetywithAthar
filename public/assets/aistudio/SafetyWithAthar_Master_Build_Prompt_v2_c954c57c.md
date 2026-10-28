# SafetyWithAthar — Master Website Build Prompt v2
**Prepared:** 29 October 2026  
**Brand:** SafetyWithAthar  
**Repository:** `safetywithathar`  
**Target URL:** `https://athar-beep.github.io/safetywithathar/`  
**Stack:** Next.js static export + GitHub Pages + Supabase (Database, Storage, Auth, Edge Functions) + Resend email API

## How to use this prompt
Run **Part 1**, let the coding agent complete it and report back, then run **Part 2**, and finally **Part 3**. Do not ask the agent to pretend later parts are complete. The site is final only after Part 3 has been tested and genuinely deployed. Keep the same repository and component registry across all parts.

---

# PART 1 — Foundation, visual system, navigation, hero and service lanes

## Mandatory preamble
This is Part 1 of 3 of one production website. Use the strongest available reasoning. Before coding, inspect the current project, repository state, package manager, and available project skills. If `local-component-registry`, `local-component-search`, `local-web-animation`, or `local-error-handling` skills are installed, read their full instructions and follow them. If any are unavailable, report that briefly and proceed using equivalent documented engineering practices; do not invent skill contents or stop the project solely because an optional skill is missing.

Create and maintain `docs/COMPONENT_REGISTRY.md`. Search the registry and existing source before creating a component. Reuse components and design tokens. Do not overwrite unrelated existing work. Animate only `transform` and `opacity`; avoid layout-thrashing animation. Prioritize mobile, accessibility, performance, and a distinctive premium visual identity. Finish only Part 1, report what is done, list the registry entries, and stop. Do not implement Part 2 or Part 3 yet.

## 1. Brand and visual direction — non-negotiable
Build a premium, **black glossy glassmorphism** website, not a generic SaaS dashboard or a plain dark landing page.

- Base: polished obsidian/near-black (`#08090B` to `#111418`) with subtle glossy gradients and restrained ambient highlights. Avoid a flat, featureless pure-black canvas.
- Glass: visible translucent graphite panels, subtle inner highlights, thin soft-white borders, layered blur, gentle reflections and realistic depth. Glass must be noticeable at a glance, but never make content hard to read.
- Type: bright silver/light gray for headings (`#E7E9ED` range), readable medium-light gray for body text (`#B8BEC7` range), and muted gray for metadata. Do not use dark-gray text on black.
- Lane accents: restrained safety orange for HSE documentation and electric blue for cold-email infrastructure. Keep these as lane identifiers and small glow/edge accents, not competing full-page themes.
- **Every CTA button must be a pill/capsule shape and use glassmorphism**: translucent fill, thin border, visible text, subtle gloss, clear focus state, and a tasteful hover/pressed interaction. No square CTA buttons. Keep pill buttons consistent across nav, cards, pricing, forms, gallery, and floating contact controls.
- Use premium typography, deliberate whitespace, subtle animated light/reflection, carefully composed layouts, and section-specific visual details. Avoid excessive neon, overdone blur, generic gradient blobs, repetitive cards, and motion that harms usability.
- Support reduced-motion preferences, keyboard navigation, visible focus rings, semantic headings, adequate contrast and at least 44px touch targets. On mobile, reduce blur and heavy effects if needed for performance.
- Respect the animation rule: animate `transform`/`opacity` only. Static `backdrop-filter` and gradients are allowed; do not animate blur, width, height, top/left, or layout dimensions.

## 2. Scaffold and deployment foundations
- Use Next.js with static export: `output: 'export'`, `basePath: '/safetywithathar'`, and a route/export strategy that works on GitHub Pages. Prefer `trailingSlash: true` if it avoids path issues.
- The production path is `https://athar-beep.github.io/safetywithathar/`; every internal asset, navigation link, image, PDF link, and route must work under this subpath. Never assume the site is hosted at `/`.
- Use a GitHub Actions workflow to build and deploy the `out/` export to GitHub Pages. Pin a compatible Node version and dependency installation method. Include a useful 404 page and a clear README with local run/build/deploy steps.
- Since the frontend is statically exported, do not use Next.js server-only APIs, API routes, server actions, or runtime SSR. Supabase Edge Functions provide server-side capabilities.
- Configure static-safe image handling (`unoptimized` for `next/image` if required) and avoid runtime image optimization APIs. Do not add large libraries without need.
- Add `.env.example` with placeholders only. Never commit live keys. Public frontend variables may include only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`/publishable key. Server-only keys must never appear in `NEXT_PUBLIC_*` variables, built assets, GitHub commits, browser code, or logs.

## 3. Shared design system and reusable components
Create tokens for colors, glass surfaces, borders, shadow/glow, spacing, radius, type scale and animation timing. Build reusable components as appropriate, such as:
- `SiteNav`, `PillGlassButton`, `GlassPanel`, `SectionHeading`, `ServiceLaneCard`, `TrustStrip`, `StatsStrip`, `WhatsAppFloat`, `SectionReveal`, and `SiteFooter`.
- Use a shared `siteConfig` for all profile/contact links and a shared `servicesConfig`/data model for service names, CTA destinations and pricing, so the same data is not duplicated in multiple components.
- Keep `docs/COMPONENT_REGISTRY.md` accurate as the build progresses.

## 4. Navigation and hero
Sticky navigation:
- Brand wordmark: `SafetyWithAthar`.
- Links: Services, Samples, Pricing, Process, About, FAQ.
- A glass capsule CTA: `Get a Quote`, which scrolls to the inquiry form (the form will be added in Part 3). If the target is not built yet, preserve the anchor contract for later; do not add a fake form.
- Mobile menu must be accessible, keyboard-operable, and work under the GitHub Pages base path.

Hero copy:
- Headline: **“Cold Email Systems & HSE Documents — Done For You. Done Right.”**
- Supporting line plainly explains both service lanes: cold-email authentication/sending infrastructure and remote HSE documentation.
- Two pill-glass CTAs: `Cold Email Setup` and `HSE Documentation`, scrolling to the correct service lane.
- Trust strip: `NEBOSH IGC (Credit) • SPF / DKIM / DMARC Specialist • Remote • Worldwide`.
- Use an elegant glass composition and subtle ambient gloss rather than a stock-photo hero or generic tech dashboard.

## 5. Service lanes
Create two prominent but visually distinct glass panels/cards. Use orange as the HSE lane accent and electric blue as the cold-email lane accent. Each card must have three consistent pill-glass actions: **Order on Fiverr**, **WhatsApp**, **LinkedIn**.

### Lane A — Cold Email Infrastructure Setup
- SPF/DKIM/DMARC authentication setup.
- Domain and mailbox sending setup, configuration checks, warm-up guidance, and campaign readiness.
- Focus on correct configuration and improving deliverability readiness. Never guarantee inbox placement or claim that authentication alone guarantees delivery.

### Lane B — HSE Documentation (Remote)
- Activity-based Risk Assessments, JSA/JHA, Method Statements, HSE Plans and checklists.
- Exact sentence: “You share your site inputs and work-pack data — I return controlled, audit-ready documents. Missing data is marked clearly, never invented.”
- Clearly state that documents are professional drafts for review/approval by the client/site HSE authority; do not imply automatic site approval or legal certification.

Contact links:
- WhatsApp: `https://wa.me/923414826804?text=Hi%20Athar%2C%20I%20want%20to%20ask%20about%20your%20services.`
- LinkedIn: `https://www.linkedin.com/in/muhammad-athar-ba35a1257/`
- Fiverr profile: `https://www.fiverr.com/safetywithathar`
- Put URLs in `siteConfig`, not repeated across the codebase. Do not invent a gig-specific URL, Upwork URL or Freelancer URL. If an exact profile URL is not supplied/configured, hide that link or mark it as needing configuration; never use `#` as a fake destination.

## 6. Trust and stats strip
Display these facts without inflating them:
- `39-page sample Risk Assessment`
- `~2.7 years on-site HSE — NESPAK • M. Saddique Ch & Co`
- `Delivery from 2 days` (actual turnaround depends on scope and complete inputs)
- `100% remote • Worldwide`

Do not invent client logos, testimonials, performance metrics, sample files or endorsements. Do not claim a PDF exists unless a real file is supplied/uploaded.

### Part 1 acceptance check
Run lint/typecheck/build if scripts exist, fix errors caused by this part, verify responsive layout and internal anchors, and inspect the built export path. Report: files created/changed, commands and results, local preview URL if actually running, component registry entries, and anything that requires real credentials/assets. Stop here.

---

# PART 2 — Real sample gallery, private admin panel, pricing, process, about and FAQ

## Mandatory preamble
This is Part 2 of 3. Re-read the full instructions for `local-component-search` and `local-web-animation` if they are available, inspect Part 1's `docs/COMPONENT_REGISTRY.md`, and reuse the existing design system. If either skill is unavailable, state that and continue with equivalent practices. Do not remove or restyle Part 1 without a requirement in this part. Finish only Part 2 and stop; do not implement Part 3's inquiry email flow or claim the site is final.

## 7. Supabase-powered sample gallery — users must be able to manage it
The website needs a **real dynamic gallery**, not hard-coded mock cards. I must be able to log into a private admin area, add new work samples whenever I want, edit their details, upload/replace files and thumbnails, reorder them, publish/unpublish them, and remove them. Once published, the sample appears in the public gallery without editing website code or redeploying GitHub Pages.

### Public gallery UI
- Filters: `All Samples`, `HSE Documentation`, `Cold Email Setup`.
- Responsive glass sample cards with title, category, document/sample type, short summary, tags, revision/source label where relevant, and pill-glass `View Sample` / `Download` actions.
- Show HSE types such as Risk Assessment, JSA/JHA, Method Statement, HSE Plan and checklist; show cold-email types such as setup checklist, sanitized authentication/configuration walkthrough, process diagram, and redacted case-study evidence.
- For screenshots/images, provide an accessible preview/lightbox. For PDFs, open a secure view/download URL in a new tab with appropriate `rel` attributes. Handle loading, empty, failed-to-load, expired-link and retry states.
- When no items are published, display a polished empty state such as `New samples are being prepared. Please check back soon.` Never fill the gallery with fake cards, broken sample links, invented PDFs or invented achievements.
- Each applicable HSE public demo must be labelled: `Public-source demo sample • Rev. 0 • For review only`. Apply it only when the source and permission status genuinely support that label.
- Before publication, require the admin to confirm that they own the file or have permission to share it and have redacted sensitive material. Never publish unredacted client/site names, signatures, IDs, email addresses, domains, IPs, credentials, internal project data or confidential records. Prefer public-source, authorized, redacted or purpose-created demo samples.

### Admin route and authentication
- Create a responsive `/admin` dashboard with Supabase Auth email/password sign-in for one explicitly authorized owner/admin. No public user registration, no visitor accounts, no public admin signup, and no hard-coded password.
- Create/add the admin user through the Supabase Dashboard or a trusted admin-only setup step, then store the authorized user's UUID in an admin allowlist table. Provide exact setup instructions; do not assume or invent the UUID.
- The admin can create/edit/delete entries; upload PDFs and thumbnail images; preview before publishing; set title, slug, category, sample type, short/long description, tags, revision/source label, sort order, publish status, and optional external reference; and see useful upload errors/progress. Validate file types and configured maximum sizes.
- Enforce permissions in Supabase RLS and Storage policies, not just by hiding admin UI. Unauthenticated/public users must never gain upload/edit/delete access by calling APIs directly.
- Use a private Supabase Storage bucket for PDFs and non-public drafts. Public cards should only obtain a time-limited signed URL from a server-side Edge Function after it verifies that the requested sample exists and is published. Store thumbnails separately with explicit access rules; never expose unpublished files by a public URL. Delete or replace old objects safely when a sample changes.
- Add database migrations under `supabase/migrations/` and Edge Function source under `supabase/functions/`. Do not rely on undocumented manual database changes alone.

### Suggested sample data model
Create a `portfolio_samples` table with fields suitable for: `id`, `created_at`, `updated_at`, `title`, `slug`, `category` (`hse_docs` / `cold_email`), `sample_type`, `summary`, `description`, `tags`, `storage_path`, `thumbnail_path`, `file_type`, `source_label`, `revision_label`, `sort_order`, `is_published`, and `permission_confirmed`. Add constraints, indexes, safe defaults and RLS. Public visitors may select only published metadata; only allowlisted admins may insert/update/delete. Adapt the exact schema if the repository already has an appropriate migration, but document the final schema.

### Sample file policy
The following are planned sample categories/names, not permission to fabricate their contents: Jafurah Gas Plant RA (39 pp), Habshan RA (21 pp), Ras Laffan RA (22 pp), Engro Daharki RA (22 pp), Qadirpur RA (22 pp), a Cold Email Setup Checklist, and an optional live Fiverr profile card. Only add a real downloadable record after the corresponding file exists and its sharing rights have been checked. If the files are not supplied yet, build the upload workflow and empty state instead of fake download buttons. Do not expose third-party copyrighted or confidential reports without clear permission.

## 8. Pricing
Use responsive pricing groups/tables inside glass panels. Every tier's CTA is a pill-glass button. Each tier should include `Order on Fiverr`, `WhatsApp`, and `Ask a Question` (scroll to the inquiry form that will be added in Part 3). No direct card payments, checkout, credit-card fields or payment database.

### Cold Email
- Basic — `$20`: one domain; SPF/DKIM/DMARC setup.
- Standard — `$50`: **deliverables are not defined in the source brief yet**. Do not invent or publish made-up deliverables. Keep this tier marked as draft/unpublished or explicitly flag the owner decision required before it can go live.
- Premium — `$100`: setup + warm-up guidance.

### HSE Documentation
- Basic — `$5`: one JSA/JHA or checklist, up to 10 activities, Word + PDF, 2-day turnaround, 1 revision.
- Standard — `$10`: activity-based RA, up to 25 activities, 5×5 matrix with initial and residual risk, hierarchy-of-controls actions, hold points, 3-day turnaround, 2 revisions.
- Premium — `$15`: RA + Method Statement + JSA pack for one work package, up to 40 activities, 5-day turnaround, 2 revisions.

Display this note: `Custom scope? Message me first — pricing confirmed before any work starts.` State that timing starts once the required inputs are received and scope is confirmed. Keep listed prices editable in a single configuration file and label currency clearly as USD. Never claim all jobs can be completed within the listed turnaround regardless of scope.

## 9. Process — four steps
1. Message with your scope.
2. Price and timeline confirmed.
3. Draft delivered (Word + PDF where relevant).
4. Revisions and final handover.

Use a clean visual timeline or four-step sequence, responsive on mobile.

## 10. About
Use a full-colour photo of Muhammad Athar if a real image is supplied. Do not make a face image up, use a black-and-white treatment, or substitute an AI-generated person for the owner. If no photo exists yet, use a polished initials/abstract glass placeholder and clearly mark the photo asset as pending.

Copy to use, subject to owner verification: `Muhammad Athar — Safety Officer`; `NEBOSH IGC (Credit)`, `IOSH Managing Safely`, `OSHA 30-Hr`; approximately 2.7 years of construction HSE experience with NESPAK and M. Saddique Ch & Co; providing both service lanes remotely worldwide. Certification chips: `NEBOSH IGC (Credit)`, `IOSH MS`, `OSHA 30-Hr`, `Highfield L2 Risk Assessment`, `Highfield L3 First Aid`, `COSHH`, `Fire Safety`. Never display a certification the owner has not verified; document any unverified claim for owner review before publishing.

## 11. FAQ — six honest answers
1. **Turnaround:** From 2 days for defined scopes after complete inputs; custom jobs need confirmation.
2. **What HSE inputs are needed?** Scope/work pack, activity sequence, equipment/materials, site conditions, workforce, applicable client/site requirements, and available controls. Ask questions and flag missing data rather than inventing it.
3. **Are documents site-approved?** No automatic approval. They are professional drafts for review and approval by the client's/site's responsible HSE authority.
4. **Can you guarantee inbox placement?** No. Correct authentication and configuration help, but placement depends on many factors; no guaranteed-deliverability claims.
5. **How do payments work?** Through agreed Fiverr/Upwork escrow arrangements where available. No direct website payments. Do not promise an unavailable payment method or link.
6. **What about revisions?** Explain the number included in each package; scope changes or extra revisions must be agreed before work proceeds.

### Part 2 acceptance check
Test admin sign-in, authorization, sample upload/edit/publish/unpublish/delete, public filters, signed URL generation, expired URL handling, RLS, storage permissions, pricing links and mobile layouts. Provide migration/setup instructions and report which real files/credentials are still missing. Do not claim notification emails or final deployment are complete yet. Stop here.

---

# PART 3 — Inquiry backend, notification email, final QA and real deployment

## Mandatory preamble
This is Part 3 of 3 and the site is not final until this part has actually passed its checks. Re-read the full `local-error-handling` and `local-web-animation` skill instructions if installed; if unavailable, report that and apply equivalent practices. Inspect the existing code, migrations, component registry and Part 1/2 acceptance notes. Before coding, map the form's success and every failure state. Never fail silently, fake success, claim tests were run if they were not, or claim a live deployment if it did not happen.

## 12. Inquiry form — not user registration
This website is a service website, not a membership product. **Do not create public visitor accounts, sign-up/login pages, or a “registration” workflow.** A visitor submits an inquiry form; that submission is saved in Supabase and triggers an email notification to the owner.

Form fields:
- Name (required)
- Email (required, validated)
- Service dropdown: `Cold Email Infrastructure Setup` (`cold_email`) / `HSE Documentation` (`hse_docs`)
- Package dropdown: `Basic`, `Standard`, `Premium`, `Custom` (adapt options to selected service; allow Custom)
- Message (required, sensible minimum/maximum length)
- Hidden honeypot and basic anti-spam protections
- `page_source` captured safely from the page/route

Use clear labels, inline validation, loading state, accessible error messages, submit-disabled state while sending, and a polite success announcement. Do not erase the visitor's text when a request fails. After confirmed storage success show: `Received. I reply within 24 hours — for a faster answer, tap WhatsApp.`

## 13. Secure Supabase submission and notification architecture
Preferred implementation: the static client calls a public `submit-inquiry` Supabase Edge Function with the public publishable key. The function performs server-side input validation, anti-spam checks/rate limiting, inserts the inquiry with server-side credentials, sends the owner notification through Resend, and returns a truthful result. The browser must never send/possess a secret/service-role key. CORS is not an authorization substitute.

- Keep RLS enabled for all exposed tables. Anonymous clients must have no SELECT/UPDATE/DELETE access to inquiries. Prefer denying direct table writes and allowing submissions only through the validating Edge Function; if direct anon INSERT is chosen for a documented reason, it must be strictly RLS-limited and the asynchronous email notification limitation must be explained. Do not accidentally leave public table write access broader than required.
- Suggested `inquiries` fields: `id`, `created_at`, `name`, `email`, `service` (`cold_email` / `hse_docs`), `package` (`basic` / `standard` / `premium` / `custom`), `message`, `page_source`, `notification_status`, `notification_error_code`, `notified_at`, and optional idempotency token. Add appropriate checks, indexes, retention considerations and RLS policies.
- Secrets live only in Supabase Edge Function secrets: Resend API key and the server-only Supabase key required by the chosen SDK. Never write secrets to migrations, `.env.example` with real values, source control, client bundles or logs. Use the currently supported server-side secret/service-role key name for the project and document setup precisely.
- Configure Resend with an actual verified sending domain before production. Do not invent a sending domain or claim delivery works before the owner configures it. Use a verified sender in `from`, send to `muhammadatharhse@gmail.com`, set `reply_to` to the visitor's validated email, and use subject: `New Inquiry — SafetyWithAthar — [Service] — [Name]`. Include all submitted fields in readable HTML and plain text. Do not include secrets in email or logs.
- Suggested sender display name: `SafetyWithAthar Website`; use a verified sender address configured by the owner, not an assumed/unverified address.
- Implement bounded retries or an admin-only retry action for failed notifications if practical. Store only safe error codes/status in the database; keep detailed debugging in protected function logs.
- Do not return internal stack traces, credentials or database details to visitors.

### Honest form outcomes (mandatory)
1. **Input validation fails:** show the exact field-level correction; do not call the backend.
2. **Honeypot/spam/rate limit triggers:** reject or politely ask the user to try later; do not claim the inquiry was received.
3. **Network/CORS/function failure before save:** show `Something went wrong — please email muhammadatharhse@gmail.com or tap WhatsApp.` Keep their filled form data intact.
4. **Database insert fails:** same honest fallback; no success state.
5. **Database save succeeds and notification email succeeds:** show the normal success message.
6. **Database save succeeds but notification email fails:** do **not** pretend the inquiry was lost or fully emailed. Show a distinct message such as: `Your inquiry was saved, but the notification email could not be confirmed. For a faster response, contact me by WhatsApp or email. You do not need to submit the form again.` Record the notification failure for admin review.
7. **Repeated click/retry:** prevent accidental duplicate records where practical with a request/idempotency key and a clear UI state.

## 14. Contact band and footer
Contact band and footer must use working configured destinations only:
- Email: `muhammadatharhse@gmail.com`
- WhatsApp: the configured wa.me URL
- LinkedIn: `https://www.linkedin.com/in/muhammad-athar-ba35a1257/`
- Fiverr profile: `https://www.fiverr.com/safetywithathar`
- Upwork and Freelancer: only show these once their exact profile URLs are supplied in site configuration; never fabricate links.

Footer copy: `© 2026 SafetyWithAthar — Muhammad Athar • Pakistan • Working worldwide, remotely.` Add quick links to Services, Samples, Pricing, Process, About, FAQ and Contact. Use clear `mailto:` and `wa.me` destinations.

## 15. Final QA, accessibility, SEO and deployment
- Add page title, meta description, canonical/site URL where appropriate, Open Graph metadata, social preview image if a real asset exists, favicon, `robots.txt`, sitemap where appropriate, and useful static `404.html` output. Ensure metadata and links work under `/safetywithathar/`.
- Test Chrome desktop and mobile widths; confirm glass remains readable on small screens and all CTA buttons remain pill-shaped. Check keyboard focus, labels, color contrast, reduced-motion mode, scrolling, menu behavior, modal behavior and touch targets.
- Test all external links, every CTA, every gallery filter, published/unpublished access, file uploads, download/view links, admin authorization, inquiry validation, Supabase insert, email sending, failure paths and retry behavior.
- Run lint, typecheck and production build. Inspect the exported `out/` files and verify project-subpath links. Aim for Lighthouse performance 90+ **where practical** without sacrificing readable glass effects or security; report actual measured scores, not estimated scores.
- Submit an end-to-end test inquiry only after the owner has configured required secrets/sender verification. Confirm that the row exists and the actual notification email reached `muhammadatharhse@gmail.com` (ask the owner to confirm inbox delivery if you cannot access that mailbox). Never claim email receipt based solely on a successful API response.
- Deploy using GitHub Actions to `https://athar-beep.github.io/safetywithathar/` only if the repository permissions and secrets allow it. Verify the actual published URL after deployment. If GitHub/Supabase/Resend credentials or permissions are unavailable, finish the code, provide exact setup/deployment steps, list blockers, and clearly say deployment or email receipt is **not verified**. Do not invent a live preview URL, database, sample asset, successful test, or delivered email.

## Final handover required
At the end of Part 3, provide:
1. Actual live URL only if verified.
2. Repository changes and component registry summary.
3. Supabase migrations, Edge Functions, Storage buckets and RLS policy summary.
4. Required environment variables/secrets by **name only**, never values.
5. Exact one-time setup steps for Supabase admin user, Storage, Resend verified sender/domain and GitHub Pages.
6. A test checklist with pass/fail/not-tested states and evidence for each important flow.
7. Missing assets/links/credentials that require the owner's action.
8. Known limitations and any measured Lighthouse results.

**Final rule:** ship a real, maintainable and secure website—not a visual mockup. If a third-party account, secret, PDF, photo, exact profile URL or verification step is unavailable, make that dependency explicit and never fabricate completion.
