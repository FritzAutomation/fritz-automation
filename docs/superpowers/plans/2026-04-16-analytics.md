# Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Vercel Analytics to the public marketing site with path-based exclusion for authenticated routes and three custom conversion events.

**Architecture:** One new `AnalyticsWrapper` client component conditionally mounts `<Analytics />` from `@vercel/analytics/react` based on `usePathname()`. Custom events fire via the `track()` function from `@vercel/analytics` inline at the call sites (CTA click handlers, form success branches, demo interaction handlers). No shared event constants — events are string literals inline since they're only called in a few specific places and grepping the codebase makes them easy to audit.

**Tech Stack:** Next.js 15 App Router, React 19, `@vercel/analytics` v1.x.

**Development Process:**
- Branch: `analytics` off `main`.
- Vercel preview deploys on every push.
- No test infrastructure; verification via Vercel Analytics dashboard post-deploy (events may take a few minutes to appear).

**Design Spec Reference:** `docs/superpowers/specs/2026-04-15-analytics-design.md`

---

## Phase 1 — Setup + AnalyticsWrapper

### Task 1.1: Create branch and install dependency

**Files:** `package.json`

- [ ] **Step 1: Create branch off main**

```bash
git checkout main && git pull
git checkout -b analytics
```

- [ ] **Step 2: Install @vercel/analytics**

```bash
npm install @vercel/analytics
```

- [ ] **Step 3: Commit and push**

```bash
git add package.json package-lock.json
git commit -m "Add @vercel/analytics dependency"
git push -u origin analytics
```

---

### Task 1.2: Create AnalyticsWrapper component

**Files:**
- Create: `src/components/AnalyticsWrapper.tsx`

- [ ] **Step 1: Create the file**

```tsx
'use client'

import { Analytics } from '@vercel/analytics/react'
import { usePathname } from 'next/navigation'

const EXCLUDED_PREFIXES = [
  '/portal',
  '/admin',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
]

function isExcluded(pathname: string): boolean {
  return EXCLUDED_PREFIXES.some(
    prefix => pathname === prefix || pathname.startsWith(prefix + '/')
  )
}

export function AnalyticsWrapper() {
  const pathname = usePathname()
  if (isExcluded(pathname)) return null
  return <Analytics />
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AnalyticsWrapper.tsx
git commit -m "Add AnalyticsWrapper with auth-route exclusion"
```

---

### Task 1.3: Mount AnalyticsWrapper in root layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Add the import**

In `src/app/layout.tsx`, add the import alongside the other component imports near the top of the file:

```tsx
import { AnalyticsWrapper } from '@/components/AnalyticsWrapper'
```

- [ ] **Step 2: Mount the component**

Inside the `<body>` JSX in `RootLayout`, add `<AnalyticsWrapper />` near the other global client components. Place it after `<CursorEffects />` (or wherever other global components are mounted — just before the closing `</body>`):

```tsx
<AnalyticsWrapper />
```

- [ ] **Step 3: Build and verify**

```bash
npm run build
```

Expected: clean build, no TypeScript errors.

- [ ] **Step 4: Commit and push**

```bash
git add src/app/layout.tsx
git commit -m "Mount AnalyticsWrapper in root layout"
git push
```

---

**CHECKPOINT 1 — Vercel preview deployed with basic page-view tracking active. Verify page views start appearing in the Vercel dashboard after a few minutes.**

---

## Phase 2 — `start_project_clicked` Events

Each "Start a project" CTA Link gets an `onClick` that fires the event before navigation. Each has a different `source` so we know which page/section drove the click.

### Task 2.1: Header CTA

**Files:**
- Modify: `src/components/layout/Header.tsx`

- [ ] **Step 1: Add the import**

Add at the top of the file, alongside the existing imports:

```tsx
import { track } from '@vercel/analytics'
```

- [ ] **Step 2: Add onClick to the desktop "Start a project" Link**

Find the desktop header CTA block. The Link currently looks like:

```tsx
<Link href="/contact">
  <Button size="sm">Start a project</Button>
</Link>
```

Change to:

```tsx
<Link
  href="/contact"
  onClick={() => track('start_project_clicked', { source: 'header_nav' })}
>
  <Button size="sm">Start a project</Button>
</Link>
```

- [ ] **Step 3: Add onClick to the mobile menu CTA**

Further down in the same file, the mobile drawer has its own "Start a project" Link:

```tsx
<Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
  <Button className="w-full">Start a project</Button>
</Link>
```

Change to:

```tsx
<Link
  href="/contact"
  onClick={() => {
    track('start_project_clicked', { source: 'header_mobile_menu' })
    setMobileMenuOpen(false)
  }}
>
  <Button className="w-full">Start a project</Button>
</Link>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "Track start_project_clicked from header CTAs"
```

---

### Task 2.2: Homepage CTAs

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Convert homepage to a client component**

`src/app/page.tsx` is currently a server component. `track()` must be called from client code. Two options: (a) convert the whole page to `'use client'`, or (b) extract the CTA into a tiny client component.

Use option (a) since the homepage already imports client-only components (`TypingHero`) and the conversion adds no meaningful cost — Next.js will still statically render the shell.

At the top of `src/app/page.tsx`, add `'use client'` as the first line:

```tsx
'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
// ... existing imports
```

- [ ] **Step 2: Add the track import**

Add alongside the existing imports:

```tsx
import { track } from '@vercel/analytics'
```

- [ ] **Step 3: Add onClick to the hero "Start a project" Link**

In the hero section, the Link currently looks like:

```tsx
<Link href="/contact"><Button size="lg">Start a project</Button></Link>
```

Change to:

```tsx
<Link
  href="/contact"
  onClick={() => track('start_project_clicked', { source: 'homepage_hero' })}
>
  <Button size="lg">Start a project</Button>
</Link>
```

- [ ] **Step 4: Add onClick to the final CTA section Link**

Near the bottom of the page, in the final CTA section:

```tsx
<Link href="/contact"><Button size="lg">Start a project</Button></Link>
```

Change to:

```tsx
<Link
  href="/contact"
  onClick={() => track('start_project_clicked', { source: 'homepage_final_cta' })}
>
  <Button size="lg">Start a project</Button>
</Link>
```

- [ ] **Step 5: Build and verify**

```bash
npm run build
```

The homepage should still compile. `metadata` export will now produce a build warning because client components can't export metadata — if the homepage currently has `export const metadata` at the top, it needs to be moved to a `layout.tsx` file or removed.

Check `src/app/layout.tsx` — the root layout already has site-wide metadata, and the homepage path (`/`) uses the root layout's defaults automatically. If there's a page-specific `metadata` export on the homepage, move it to a new `src/app/(home)/layout.tsx` or simply delete the page-level export (the root layout's title defaults apply).

If the homepage has no `metadata` export (very possible — the root layout's `title.default` is "Fritz Automation — Custom software for small businesses"), no action needed.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Track start_project_clicked from homepage CTAs"
```

---

### Task 2.3: Services page CTAs

**Files:**
- Modify: `src/app/services/page.tsx`

This file is already a client component (it has `'use client'` for the tabbed interface).

- [ ] **Step 1: Add the track import**

```tsx
import { track } from '@vercel/analytics'
```

- [ ] **Step 2: Update the WebsitesPanel Start-a-project Link**

In the `WebsitesPanel` function, the CTA currently:

```tsx
<Link href="/contact"><Button>Start a project</Button></Link>
```

Change to:

```tsx
<Link
  href="/contact"
  onClick={() => track('start_project_clicked', { source: 'services_websites' })}
>
  <Button>Start a project</Button>
</Link>
```

- [ ] **Step 3: Update the AutomationPanel Start-a-project Link**

In the `AutomationPanel` function, same pattern:

```tsx
<Link
  href="/contact"
  onClick={() => track('start_project_clicked', { source: 'services_automation' })}
>
  <Button>Start a project</Button>
</Link>
```

- [ ] **Step 4: Commit**

```bash
git add src/app/services/page.tsx
git commit -m "Track start_project_clicked from services page CTAs"
```

---

### Task 2.4: Demo page CTAs

**Files:**
- Modify: `src/app/demos/csv-dashboard/page.tsx`
- Modify: `src/app/demos/client-portal/page.tsx`

Both pages are currently server components. The CTA is a small inline button. Extract it to avoid converting the whole page to a client component.

- [ ] **Step 1: Create a reusable TrackedStartProjectButton component**

Create `src/components/TrackedStartProjectButton.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { track } from '@vercel/analytics'
import { Button } from '@/components/ui/Button'

export function TrackedStartProjectButton({
  source,
  size = 'lg',
}: {
  source: string
  size?: 'sm' | 'md' | 'lg'
}) {
  return (
    <Link
      href="/contact"
      onClick={() => track('start_project_clicked', { source })}
    >
      <Button size={size}>Start a project</Button>
    </Link>
  )
}
```

- [ ] **Step 2: Replace the CTA in CSV Dashboard demo page**

In `src/app/demos/csv-dashboard/page.tsx`, find the final CTA block. Currently:

```tsx
<Link href="/contact"><Button size="lg">Start a project</Button></Link>
```

Replace with:

```tsx
<TrackedStartProjectButton source="csv_dashboard_cta" />
```

Remove the now-unused `Button` import if nothing else uses it. Add the new import:

```tsx
import { TrackedStartProjectButton } from '@/components/TrackedStartProjectButton'
```

- [ ] **Step 3: Replace the CTA in Client Portal demo page**

In `src/app/demos/client-portal/page.tsx`, same change:

```tsx
<TrackedStartProjectButton source="client_portal_cta" />
```

Add the import. Remove the unused `Button` import if nothing else uses it (check — the import may still be needed for other buttons; if so, leave it).

- [ ] **Step 4: Build**

```bash
npm run build
```

- [ ] **Step 5: Commit and push**

```bash
git add -A
git commit -m "Track start_project_clicked from demo page CTAs"
git push
```

---

**CHECKPOINT 2 — All `start_project_clicked` events wired up. Verify on Vercel dashboard after preview deploys.**

---

## Phase 3 — `contact_form_submitted` Event

### Task 3.1: Fire event on successful contact form submission

**Files:**
- Modify: `src/app/contact/ContactForm.tsx`

The `handleSubmit` function at approximately lines 52–80 handles the form submission. The `track()` call goes inside the success branch (the `if (result.success)` block at line 67).

- [ ] **Step 1: Add the track import**

At the top of the file, alongside existing imports:

```tsx
import { track } from '@vercel/analytics'
```

- [ ] **Step 2: Fire the event on success**

In `handleSubmit`, inside the `if (result.success)` block (starting around line 67), add the `track()` call. The full updated block:

```tsx
if (result.success) {
  const subject = (formData.get('subject') as string) || ''
  track('contact_form_submitted', { subject_length: subject.trim().length })
  toast.success("Message sent! I'll reply within a day.")
  // Reset form
  const form = document.getElementById('contact-form') as HTMLFormElement
  form?.reset()
} else {
  toast.error(result.error || 'Failed to send message. Please try again.')
}
```

- [ ] **Step 3: Build**

```bash
npm run build
```

- [ ] **Step 4: Commit and push**

```bash
git add src/app/contact/ContactForm.tsx
git commit -m "Track contact_form_submitted on successful submit"
git push
```

---

## Phase 4 — `demo_interaction` Events

### Task 4.1: CSV Dashboard demo events

**Files:**
- Modify: `src/components/demos/CsvDashboard.tsx`

Two events: `sample_data_loaded` (fires when user clicks "Use sample data") and `file_uploaded` (fires when a file successfully parses — NOT on every failed upload).

- [ ] **Step 1: Add the track import**

At the top of the file:

```tsx
import { track } from '@vercel/analytics'
```

- [ ] **Step 2: Fire sample_data_loaded event**

Find the button with `onClick={() => parseCSV(sampleCsvString)}`. Change to:

```tsx
<button
  onClick={() => {
    track('demo_interaction', { action: 'sample_data_loaded' })
    parseCSV(sampleCsvString)
  }}
  className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg font-mono text-sm transition-colors border border-emerald-500/30"
>
  Use sample data
</button>
```

- [ ] **Step 3: Fire file_uploaded event**

The `handleFileUpload` and `handleDrop` callbacks both end up calling `parseCSV(text)` inside `reader.onload`. To track only successful parses without duplicating logic, fire the event inside the `parseCSV` function itself — but only when called from a real file (not from the sample button).

Change the `parseCSV` callback to accept an optional `source` flag:

```tsx
const parseCSV = useCallback((csvText: string, source: 'sample' | 'file' = 'file') => {
  const result = Papa.parse<Record<string, string>>(csvText.trim(), {
    header: true,
    skipEmptyLines: true,
  })
  if (result.data.length > 0 && result.meta.fields) {
    setData({ headers: result.meta.fields, rows: result.data })
    setFilters({})
    setSortCol(null)
    if (source === 'file') {
      track('demo_interaction', { action: 'file_uploaded' })
    }
  }
}, [])
```

Then in the "Use sample data" button, explicitly pass `'sample'`:

```tsx
onClick={() => {
  track('demo_interaction', { action: 'sample_data_loaded' })
  parseCSV(sampleCsvString, 'sample')
}}
```

The existing `handleFileUpload` and `handleDrop` callers don't pass a second argument, so they default to `'file'` and the upload event fires on parse success.

- [ ] **Step 4: Build**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/components/demos/CsvDashboard.tsx
git commit -m "Track demo_interaction events in CSV Dashboard"
```

---

### Task 4.2: Client Portal demo events

**Files:**
- Modify: `src/components/demos/ClientPortal.tsx`

Two events: `request_submitted` (fires when the client-view new-request form submits successfully) and `view_switched_admin` (fires the first time the user switches to admin view, throttled per component mount via a ref).

- [ ] **Step 1: Add the track import and useRef**

The file already imports from React. Add `track` and make sure `useRef` is imported:

```tsx
import { useState, useCallback, useRef } from 'react'
import { track } from '@vercel/analytics'
```

- [ ] **Step 2: Add the admin-view tracking ref inside the component**

At the top of the `ClientPortal` function component, add the ref:

```tsx
export function ClientPortal() {
  const [projects, setProjects] = useState<Project[]>(sampleProjects)
  const [view, setView] = useState<'client' | 'admin'>('client')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [newNote, setNewNote] = useState('')
  const adminViewTracked = useRef(false)
  // ...rest of component
```

- [ ] **Step 3: Track admin view switch**

Find the admin tab button. Currently:

```tsx
<button
  onClick={() => setView('admin')}
  className={`px-4 py-2 font-mono text-sm border-b-2 transition-colors ${...}`}
>
  admin-view.tsx
</button>
```

Change to:

```tsx
<button
  onClick={() => {
    if (!adminViewTracked.current) {
      track('demo_interaction', { action: 'view_switched_admin' })
      adminViewTracked.current = true
    }
    setView('admin')
  }}
  className={`px-4 py-2 font-mono text-sm border-b-2 transition-colors ${...}`}
>
  admin-view.tsx
</button>
```

(Keep the `${...}` className exactly as it was in the original file — only the onClick is changing.)

- [ ] **Step 4: Track request submission**

Find the `handleSubmitRequest` callback. Inside the callback, after the `setProjects(...)` call and before `setSelectedId(newProject.id)`, add the track call. The updated function:

```tsx
const handleSubmitRequest = useCallback((e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  const form = e.currentTarget
  const formData = new FormData(form)
  const title = formData.get('title') as string
  const message = formData.get('message') as string
  if (!title.trim()) return

  const today = new Date().toISOString().split('T')[0]
  const newProject: Project = {
    id: `proj-${Date.now()}`,
    title: title.trim(),
    client: 'You',
    status: 'submitted',
    timeline: [{ date: today, note: 'Project submitted' }],
    files: [],
    messages: message.trim()
      ? [{ from: 'You', text: message.trim(), date: today }]
      : [],
  }
  setProjects(prev => [newProject, ...prev])
  track('demo_interaction', { action: 'request_submitted' })
  form.reset()
  setSelectedId(newProject.id)
}, [])
```

- [ ] **Step 5: Build**

```bash
npm run build
```

- [ ] **Step 6: Commit and push**

```bash
git add src/components/demos/ClientPortal.tsx
git commit -m "Track demo_interaction events in Client Portal"
git push
```

---

## Phase 5 — PR

### Task 5.1: Open PR

- [ ] **Step 1: Open the PR**

```bash
gh pr create --title "Add Vercel Analytics with conversion event tracking" --body "$(cat <<'EOF'
## Summary
- Adds Vercel Analytics to public marketing pages (auto page-view tracking).
- Path-based exclusion skips `/portal/*`, `/admin/*`, and auth routes so analytics reflect prospective clients only.
- Three custom conversion events track real engagement:
  - `contact_form_submitted` — fires on successful form submit, payload includes subject length
  - `start_project_clicked` — fires on each "Start a project" CTA, payload identifies which CTA (header, hero, services tabs, demo pages)
  - `demo_interaction` — fires on key demo moments (sample data loaded, file uploaded, request submitted, admin view first switch)
- One new `TrackedStartProjectButton` component extracts the CTA-with-tracking pattern for demo pages (avoids converting whole pages to client components).

## Design docs
- Spec: `docs/superpowers/specs/2026-04-15-analytics-design.md`
- Plan: `docs/superpowers/plans/2026-04-16-analytics.md`

## Test plan
- [ ] Vercel preview deploys without errors.
- [ ] Open the preview site and browse — page views should appear in the Vercel Analytics dashboard within a few minutes.
- [ ] Click each "Start a project" button — events should appear with correct `source` values.
- [ ] Submit the contact form — `contact_form_submitted` event fires.
- [ ] Open `/demos/csv-dashboard`, click "Use sample data" — `demo_interaction` with action `sample_data_loaded` fires.
- [ ] Upload a CSV on the dashboard — event with `file_uploaded` fires.
- [ ] Open `/demos/client-portal`, submit a new request — event with `request_submitted` fires.
- [ ] Switch to admin view — event with `view_switched_admin` fires once; switching back and forth doesn't re-fire.
- [ ] Browse `/portal` or `/admin` pages — no page view events recorded (auth-gated exclusion working).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 2: Report the PR URL**

---

## Self-Review

**Spec coverage:**
- Provider choice (Vercel Analytics) → Task 1.1 ✅
- AnalyticsWrapper with path exclusion → Tasks 1.2, 1.3 ✅
- `contact_form_submitted` event → Task 3.1 ✅
- `start_project_clicked` (7 sources) → Tasks 2.1 (header), 2.2 (homepage hero + final), 2.3 (services two panels), 2.4 (two demo pages) ✅
- `demo_interaction` (four actions) → Tasks 4.1 (sample + file), 4.2 (submit + admin switch) ✅
- View-switch throttling via `useRef` → Task 4.2 ✅
- TrackedStartProjectButton reusable component → Task 2.4 ✅

**Placeholder scan:** No TBDs or vague steps. All code blocks are complete.

**Type consistency:** `track()` signature comes from `@vercel/analytics`. Event names are consistent: `'contact_form_submitted'`, `'start_project_clicked'`, `'demo_interaction'`. The `parseCSV` callback signature change in Task 4.1 extends the existing single-argument call sites — existing callers (`handleFileUpload`, `handleDrop`) use the default `'file'` source, only the sample-data button explicitly passes `'sample'`.

**Note on homepage client-component conversion:** Task 2.2 converts `src/app/page.tsx` from a server component to a client component so `track()` can be called from inline onClick handlers. The alternative — extracting two tiny wrapper components — would leave the homepage as a server component but adds two more files. Went with the direct conversion because the homepage already imports `TypingHero` (a client component), adds no meaningful bundle cost, and keeps the page single-file. If the homepage ever needs to fetch server data, the wrapper-component approach can be revisited.
