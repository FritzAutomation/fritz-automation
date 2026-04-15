# Fritz Automation — Site Reframe Design

**Date:** 2026-04-14
**Status:** Draft for review
**Branch strategy:** all work happens on a `reframe-site` branch with Vercel preview deploys; production stays untouched until merged.

## 1. Goals

Reframe the Fritz Automation marketing site so it honestly represents a one-person software studio with a personal-voice brand, removes positioning that could create conflict-of-interest concerns with Joshua's day-job employer (CNH Industrial, manufacturing IT), and turns the site itself into a piece of software that demonstrates craft.

The site must:

- Represent Fritz Automation LLC as a real company (contracts, invoices, client portal) with a visible human founder doing the work.
- Serve two audiences cleanly: small businesses needing a customer-facing site, and small/mid businesses needing internal tools or automation.
- Prove technical capability through the site's own design and interactions, since most prior work cannot be shown publicly.
- Avoid any manufacturing-industry framing, enterprise-scale claims, or fictional case studies.

## 2. Strategic Decisions

### Audience
Small and mid-sized businesses without an in-house dev team. One buyer persona, two project types: (a) a marketing website or online store; (b) an internal tool, dashboard, or automation.

### Voice
First-person "I'm Josh" voice throughout. Fritz Automation LLC is the company wrapper (logo, legal, invoicing, portal); Josh is the brand and the builder. The site never says "we" or "our team"; it says "I" and "I'll."

### Experience narrative
Problem-solver framing: "For 15 years I've been the person coworkers came to with their spreadsheet nightmares. The person who said 'I can just build that.' Now I do it for other companies through Fritz Automation." This bridges both services under one identity and explains the 15-year arc (self-taught → software degree → professional roles → independent) without referencing specific employers.

### Positioning tagline (working direction)
Hero copy direction: `"Hi, I'm Josh. I build custom software for small businesses — websites that sell and tools that save hours."` Final wording refined during implementation.

### Services
Two offerings, outcome-named:

- **Websites & online stores** — "Your customers can find you and buy from you."
- **Internal tools & automation** — "Your team stops wasting hours on manual work."

One services page with two tabbed sections (IDE-file-tab styled), not two separate pages.

### Proof strategy
Live work on the site = the two shipped sites (Iowan Foodie, Two Makers Co). For the internal-tools side, where no past-employer work is showable:

- Demo projects to be built *after* this reframe ships — 2–3 standalone internal-tool examples.
- Honest messaging on the Services page: "I've built these kinds of tools for past employers. Ask me about specifics on a call."
- No GitHub links in v1; revisit once there's a public repo worth pointing at.

### Pricing
Show ranges with softening language: *"Most projects land in $X,XXX–$YY,XXX."* Exact numbers filled in before launch. Separate range for each service.

## 3. Aesthetic Direction

The site reads as a piece of software — an IDE-flavored, modern-app experience. This is a heavy commitment, not decorative sprinkles: the metaphor runs through every page. The strategic justification is that the site itself is currently the strongest portfolio piece, since past work isn't showable and demos don't exist yet.

### Visual palette
- **Keep:** emerald primary (`#10b981`-range), cyan accent glows, slate-900 dark backgrounds, MouseGrid, DataStream.
- **Add:** a code-flavored monospace face (JetBrains Mono, Geist Mono, or Berkeley Mono — final pick during implementation) paired with the existing Inter body text. Monospace is used for accents, labels, file paths, status bar, code-style blocks, button microcopy — not for body prose.

### Persistent chrome (every page)
- **IDE-style tab bar** at the top showing open pages. Switching tabs navigates. Current page = active tab.
- **Status bar** pinned to the bottom (VS Code style) with current path, a live clock, subtle state indicators. Decorative but reinforces metaphor constantly.
- **⌘K command palette** — floating search/nav. Developers love it; non-developers ignore it since normal nav still works.
- **File-path breadcrumbs** — `~/work/iowan-foodie` instead of `Home > Work > Iowan Foodie`.
- MouseGrid + DataStream kept; they already fit the metaphor.

### Per-page treatments
- **Homepage hero** — typing-cursor animation that writes out the tagline letter-by-letter.
- **Homepage "What I build"** — two offerings shown as "files" in an IDE sidebar, each opening to a preview.
- **Homepage "How it works"** — fake terminal output: `$ fritz init project` followed by step output.
- **About** — laid out like a source file: line numbers down the left gutter, syntax-highlighted "comments" for story text, `const` declarations for values/skills. Fully readable prose framed as code.
- **Services** — two IDE file tabs at the top (`websites.tsx` | `automation.py`). Clicking switches the active section; URL updates like opening different files.
- **Work** — file-explorer tree on the left, preview pane on the right, like opening files in an IDE.
- **Contact** — form styled as filling out a config file or dev-tool form. Submit button labeled "deploy" or similar.

Underneath the aesthetic, every page is still a normal, accessible website — real links, real scroll, real form behavior. Non-developer visitors can use it without knowing what an IDE is.

## 4. Page Inventory

### Keep (with rewrites to new voice and structure)
- `/` — Home
- `/about` — About
- `/services` — Services (one page, two tabbed sections)
- `/work` — Work (renamed/merged from Portfolio + real Case Studies)
- `/demos` — Demos (placeholder for v1; filled in as demo projects are built)
- `/contact` — Contact
- `/privacy`, `/terms`, 404 — keep, minor cleanup only
- `/portal/**` and `/admin/**` — functionally untouched; de-emphasized in public nav (footer link, not main nav)

### Delete
- `/industries` — contradicts focus, agency-scale thinking
- `/case-studies` — fictional enterprise case studies; real work moves into `/work`
- `/roi-calculator` — enterprise-flavored, wrong audience fit

### Navigation (flat, no dropdowns)
Main nav: `Work · Services · About · Contact`

Client Portal link moves to the footer or a small top-right utility link, not main nav.

## 5. Homepage Section Order

Ordered to answer a cold visitor's questions in sequence:

1. **Hero** — name + one-sentence positioning + primary CTA. Typing-cursor animation. MouseGrid/DataStream backdrop.
2. **What I build** — two "file" cards (Websites & online stores; Internal tools & automation). Each has a one-sentence outcome, 3 bullets, link into the corresponding Services section.
3. **Selected work** — 2–4 real projects with screenshots. At launch: Iowan Foodie and Two Makers Co. Demos added as they ship.
4. **Who you're working with** — 2–3 sentence personal intro + photo placeholder + link to full About.
5. **How it works** — 3–4 engagement steps rendered as terminal output.
6. **Final CTA** — "Have a project in mind? Let's talk." → Contact.

### Deliberately NOT included on the homepage
- Stats bar with scale claims.
- Testimonials section (none are real yet; added post-launch as clients ship).
- Tech-logo grid (makes a solo studio look like it's trying to look bigger).
- Pricing on the homepage (lives on Services page).

## 6. Page-by-Page Outline

### Home
See section 5.

### About
Single-column, code-file treatment. Content blocks:
- Personal intro (who I am, where I'm based)
- The 15-year arc (self-taught start → software degree → professional roles → independent through Fritz Automation), framed as the problem-solver narrative
- Values / how I work (3–5 short statements)
- Contact CTA at the bottom

### Services
Tabbed layout. Two sections:

**Websites & online stores**
- Outcome-first intro
- What's included (bulleted scope)
- Typical project shapes (marketing site, portfolio, e-commerce)
- Timeline ranges
- Price range with softening language
- Link to Work page filtered to website projects
- CTA to Contact

**Internal tools & automation**
- Outcome-first intro
- What's included (bulleted scope)
- Typical project shapes (dashboards, internal apps, automation pipelines)
- Timeline ranges
- Price range with softening language
- Honest "ask me about past work" note covering the showable-work gap
- Link to Demos page
- CTA to Contact

### Work
File-tree sidebar + preview pane layout. At launch, two project entries: Iowan Foodie and Two Makers Co. Each project page: screenshot hero, project summary, goals, what was built, tech stack, link to live site. Written honestly — these are small websites, framed as small websites done well.

### Demos
Placeholder in v1: short statement explaining these are standalone demo projects showing internal-tool capability, with a "more coming soon" note. Populated as demo projects are built in follow-up work.

### Contact
Single-form page in dev-tool-form treatment. Fields: name, email, company (optional), project type (radio: website / internal tool / not sure), budget range (optional select), message. Form submits to existing backend (already wired up in current site). Simple confirmation state on success.

### Portal, Admin, Privacy, Terms, 404
No structural changes. Typography and chrome updated to match the new visual system. Portal moves to footer link.

## 7. Copy Voice Guidelines

- First-person always: "I", never "we" or "our team."
- Concrete over abstract: "save your team 6 hours a week" beats "drive operational efficiency."
- No enterprise vocabulary: no "solutions", "synergy", "leverage", "mission-critical", "enterprise-grade." Plain language only.
- No scale claims (record counts, uptime percentages, client counts).
- No fictional clients or testimonials.
- Short sentences. Honest tone. Confident without bluster.
- Technical terms OK when accurate ("PostgreSQL", "Next.js") but never as decoration.

## 8. Out of Scope (for this reframe)

- Building new demo projects for the Demos page — follow-up work.
- Writing new case studies for clients we haven't served.
- Any portal/admin functionality changes.
- Blog, newsletter, or content marketing infrastructure.
- Analytics or A/B testing setup.
- SEO work beyond metadata hygiene on updated pages.

## 9. Development & Review Process

1. All work happens on branch `reframe-site` off of `main`.
2. Every push triggers a Vercel preview deploy at a branch-specific URL.
3. User reviews the preview and gives feedback between implementation checkpoints.
4. Production is not affected until the PR is merged to `main`.
5. If the reframe is rejected, the branch is deleted and production is unchanged.

## 10. Open Items to Resolve During Implementation

- Final monospace typeface choice (JetBrains Mono vs. Geist Mono vs. Berkeley Mono).
- Actual pricing numbers for both services.
- Whether the ⌘K command palette ships in v1 or is deferred to a post-launch polish pass.
- Whether existing animations (MouseGrid, DataStream) need density tuning after the new typography lands.
- Final tagline wording.
