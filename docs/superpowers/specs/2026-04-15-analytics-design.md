# Analytics Design

**Date:** 2026-04-15
**Status:** Approved
**Branch strategy:** `analytics` branch off `main`, Vercel preview, merge when approved.

## 1. Goal

Add Vercel Analytics to the Fritz Automation marketing site. Track page views automatically on public pages and fire three custom conversion events for measuring actual engagement. Exclude authenticated and authentication routes from tracking.

## 2. Provider

**Vercel Analytics** via the `@vercel/analytics` npm package. The site is already hosted on Vercel, so the analytics dashboard lives in the existing Vercel project page. Free tier. Cookieless, no consent banner required.

## 3. What's tracked automatically

Page views on public marketing routes:

- `/` (Home)
- `/work`
- `/services`
- `/demos`
- `/demos/csv-dashboard`
- `/demos/client-portal`
- `/about`
- `/contact`
- `/privacy`, `/terms`, 404

## 4. What's excluded

- `/portal/*` (client portal — authenticated)
- `/admin/*` (admin dashboard — authenticated)
- `/login`, `/register`, `/forgot-password`, `/reset-password` (authentication flow)

Exclusion is implemented in code via a path-aware `AnalyticsWrapper` component that only mounts `<Analytics />` when `usePathname()` returns a public route. Chosen over Vercel-side exclusion config to keep the logic visible in the repo.

## 5. Custom events

### 5.1 `contact_form_submitted`

- **Fires when:** `submitContact` server action returns `success: true` in `ContactForm.tsx`.
- **Location:** inside the success branch of the existing `handleSubmit` function in `src/app/contact/ContactForm.tsx`.
- **Payload:**
  ```ts
  { subject_length: number }  // length of the subject field, rough signal of inquiry depth
  ```

### 5.2 `start_project_clicked`

- **Fires when:** any "Start a project" CTA Link is clicked.
- **Payload:**
  ```ts
  { source: string }  // which CTA fired the event
  ```
- **Sources:**
  - `'header_nav'` — header "Start a project" button
  - `'homepage_hero'` — homepage hero CTA
  - `'homepage_final_cta'` — homepage final CTA section
  - `'services_websites'` — Services page websites tab CTA
  - `'services_automation'` — Services page automation tab CTA
  - `'csv_dashboard_cta'` — CSV Dashboard demo page bottom CTA
  - `'client_portal_cta'` — Client Portal demo page bottom CTA

Each Link with a "Start a project" button gets an inline `onClick` handler that calls `track('start_project_clicked', { source: '<value>' })` before the Link navigates.

### 5.3 `demo_interaction`

- **Fires on four specific interactions:**
  - `{ action: 'sample_data_loaded' }` — CSV Dashboard "Use sample data" button clicked.
  - `{ action: 'file_uploaded' }` — CSV Dashboard file upload successfully parsed.
  - `{ action: 'request_submitted' }` — Client Portal "Submit new request" form submitted.
  - `{ action: 'view_switched_admin' }` — Client Portal switched to admin view. **Throttled** to once per component mount using a `useRef` flag so repeated toggles don't spam the event.

## 6. Files created / modified

| Path | Action | Purpose |
|------|--------|---------|
| `package.json` | Modify | Add `@vercel/analytics` dependency |
| `src/components/AnalyticsWrapper.tsx` | Create | Path-aware wrapper conditionally mounting `<Analytics />` |
| `src/app/layout.tsx` | Modify | Mount `<AnalyticsWrapper />` |
| `src/app/contact/ContactForm.tsx` | Modify | Fire `contact_form_submitted` |
| `src/app/page.tsx` | Modify | Fire `start_project_clicked` on hero + final CTA |
| `src/app/services/page.tsx` | Modify | Fire `start_project_clicked` from both tab CTAs |
| `src/app/demos/csv-dashboard/page.tsx` | Modify | Fire `start_project_clicked` on bottom CTA |
| `src/app/demos/client-portal/page.tsx` | Modify | Fire `start_project_clicked` on bottom CTA |
| `src/components/layout/Header.tsx` | Modify | Fire `start_project_clicked` on header CTA |
| `src/components/demos/CsvDashboard.tsx` | Modify | Fire `demo_interaction` for sample + file upload |
| `src/components/demos/ClientPortal.tsx` | Modify | Fire `demo_interaction` for submit + admin view |

## 7. Core component: AnalyticsWrapper

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

## 8. Event-firing pattern

Custom events use the `track()` function from `@vercel/analytics`. Pattern for CTA clicks:

```tsx
import { track } from '@vercel/analytics'

// Before: <Link href="/contact"><Button>Start a project</Button></Link>
// After:
<Link
  href="/contact"
  onClick={() => track('start_project_clicked', { source: 'homepage_hero' })}
>
  <Button>Start a project</Button>
</Link>
```

For `track()` calls inside form submissions and demo interactions, call the function before or alongside the existing logic — doesn't block anything, fires asynchronously.

## 9. Out of scope

- A/B testing or Speed Insights (separate Vercel products).
- Tracking every link click on the site.
- User identification or cross-session tracking.
- Embedded analytics dashboards on the marketing site.
- Analytics on portal/admin pages.
- Custom GA-style funnel reports (Vercel dashboard handles its own view).

## 10. Privacy & compliance

Vercel Analytics is cookieless and does not collect PII. No GDPR cookie banner is required. Adding a brief sentence to the privacy policy is prudent but outside the scope of this task.

## 11. Development process

1. Branch: `analytics` off `main`.
2. Vercel preview on every push.
3. Production untouched until PR merged.
