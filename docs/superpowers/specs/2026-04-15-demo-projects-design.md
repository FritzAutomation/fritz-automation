# Demo Projects Design

**Date:** 2026-04-15
**Status:** Approved
**Branch strategy:** `demo-projects` branch off `main`, Vercel preview deploys, merge when approved.

## 1. Goals

Build two interactive demo projects that live on the Fritz Automation marketing site and prove internal-tool/automation capability to potential clients. Each demo frames a relatable pain point ("before"), provides a working interactive solution ("after"), and explains what a production version would include. All demos are entirely client-side — no backend, no data persistence, no auth.

## 2. Demo 1: CSV Dashboard (`/demos/csv-dashboard`)

### Pain-point framing

A terminal-style block showing the problem:

```
// the problem
$ open sales-data-Q1.xlsx
→ 14 tabs. 6 people editing. 3 versions on the shared drive.
→ Your Monday starts with 45 minutes of copy-paste to get one number.
```

### Interactive demo

- **File upload zone:** drag-and-drop or click-to-browse for a CSV file. A "Use sample data" button loads a bundled sample dataset by default so visitors don't need their own file.
- **Dashboard renders once data loads:**
  - Summary stat cards at top: total rows, auto-detected numeric column sums/averages.
  - Filterable, sortable data table showing the parsed rows.
  - 1–2 auto-generated charts via Recharts: bar chart for categorical columns, line chart if a date column is detected.
  - "Download report" button exports a cleaned summary as CSV.
- All processing is in-browser. No data leaves the visitor's machine.

### "In production" callout

```
// in production, this connects to your database
→ Live data from your POS, ERP, or spreadsheets — updated automatically.
→ Role-based access so your team sees what they need.
→ Scheduled email reports every Monday morning.
→ This demo runs entirely in your browser. Nothing is uploaded or stored.
```

### Tech badge

React, TypeScript, Recharts, CSV parsing

## 3. Demo 2: Client Portal (`/demos/client-portal`)

### Pain-point framing

```
// the problem
$ grep -r "status update" ~/inbox
→ 47 emails. 12 phone calls. 3 sticky notes.
→ Your client asks "where's my project?" and you dig for 10 minutes.
```

### Interactive demo

A tabbed mini-app with two views, toggled via IDE file tabs (`client-view.tsx` | `admin-view.tsx`):

**Client view (default):**
- Pre-populated list of 3 sample projects with statuses: In Progress, Under Review, Completed.
- Click a project → detail view: timeline of status updates, file list (mock), message thread (mock).
- "Submit new request" form adds a project to the list (client-side state).

**Admin view:**
- Same project list with controls: update status dropdown, add timeline note, mark complete.
- Changes in admin view reflect immediately in client view (shared React state).
- Demonstrates the "two sides of one tool" concept.

### "In production" callout

```
// in production, this connects to your database
→ Real authentication — clients log in and see only their projects.
→ Email notifications on status changes.
→ File upload and storage.
→ This demo uses sample data. Nothing is saved.
```

### Tech badge

React, TypeScript, Tailwind CSS, state management

## 4. Demos Index Page (`/demos`)

Replace the current empty-directory stub with:

- Standard dark hero (gradient, MouseGrid, DataStream, PathCrumbs `~/demos`).
- Headline: "Demos"
- Subtext: "Small working apps that show what I build on the internal-tools side. Play with them — everything runs in your browser."
- Two demo cards in a grid, each linking to its sub-route:
  - Card 1: `csv-dashboard.app` — "Spreadsheet chaos → clean dashboard"
  - Card 2: `client-portal.app` — "Email chaos → organized client portal"
- Cards styled like the homepage "what I build" file-cards (filename badge, one-sentence description, `open →` link).
- ScrollReveal on the card grid.

## 5. Shared visual patterns

All demo pages use:

- Dark gradient hero with PathCrumbs (`~/demos/csv-dashboard` or `~/demos/client-portal`).
- Pain-point "before" block in a terminal window chrome container (traffic lights + filename).
- Interactive demo in a separate window chrome container.
- "In production" callout in a terminal block below the demo.
- ScrollReveal on each section.
- "Start a project" CTA at the bottom linking to `/contact`.
- Reusable `DemoTerminalBlock` component for the terminal-chrome containers.

## 6. File structure

```
src/app/demos/
  page.tsx                    — demos index (replaces current stub)
  csv-dashboard/
    page.tsx                  — CSV dashboard demo page (server component shell)
  client-portal/
    page.tsx                  — client portal demo page (server component shell)

src/components/demos/
  CsvDashboard.tsx            — interactive CSV dashboard (client component)
  ClientPortal.tsx            — interactive client portal (client component)
  DemoTerminalBlock.tsx       — reusable terminal-chrome block for "before" and "in production" sections
  SampleData.ts              — bundled sample CSV data + sample portal project data

public/demos/
  sample-sales-data.csv       — downloadable sample CSV
```

## 7. Dependencies

- `recharts` — charting library for CSV dashboard.
- `papaparse` — CSV parsing library.
- Both installed via npm. Types for papaparse via `@types/papaparse`.

## 8. Component details

### DemoTerminalBlock

Reusable component for the terminal-chrome containers used for "before" blocks and "in production" callouts.

Props:
- `filename: string` — shown in the title bar (e.g., `~/the-problem.sh`)
- `children: ReactNode` — terminal content

Renders: traffic-light dots, filename, dark bg, monospace text. Same visual as the homepage "how it works" terminal block and the About page code-file container.

### CsvDashboard

Client component (`'use client'`). Internal state:
- `rawData: string[][] | null` — parsed CSV rows
- `columns: string[]` — detected column headers
- `filters: Record<string, string>` — active column filters
- `sortCol: string | null` and `sortDir: 'asc' | 'desc'`

Logic:
- On "Use sample data" click: load from `SampleData.ts`.
- On file upload: parse with PapaParse, populate state.
- Auto-detect column types: if all values parse as numbers → numeric (show sum/avg in stats). If values look like dates → date column (show line chart). Otherwise → categorical (show bar chart of top values).
- Chart rendering via Recharts `<BarChart>` and `<LineChart>`.
- "Download report" builds a summary CSV string and triggers a browser download via Blob URL.

### ClientPortal

Client component (`'use client'`). Internal state:
- `projects: Project[]` — list of projects with status, timeline entries, messages
- `activeView: 'client' | 'admin'` — current tab
- `selectedProject: string | null` — expanded project ID

Types:
```typescript
interface Project {
  id: string
  title: string
  client: string
  status: 'submitted' | 'in-progress' | 'under-review' | 'completed'
  timeline: { date: string; note: string }[]
  files: { name: string; size: string }[]
  messages: { from: string; text: string; date: string }[]
}
```

Initial data loaded from `SampleData.ts` (3 pre-populated projects). Client view is read-only + submit form. Admin view has status dropdowns and "add note" inputs that mutate the shared state, immediately visible in client view.

### SampleData

Exports:
- `sampleCsvData: string` — a realistic-looking sales dataset (~50 rows, columns: Date, Product, Category, Region, Units, Revenue). Formatted as a CSV string that PapaParse can parse.
- `sampleProjects: Project[]` — 3 sample projects with realistic timelines, mock files, and mock messages.

## 9. Out of scope

- Real backend / Supabase integration for demos.
- Authentication.
- Persisting demo state between visits.
- More than 2 demos (add more later).
- Touch-optimized chart interactions.
- Mobile-specific chart layouts (charts are responsive via Recharts `<ResponsiveContainer>` but not custom-tuned for small screens).

## 10. Development process

1. Branch: `demo-projects` off `main`.
2. Vercel preview on every push.
3. Production untouched until PR merged.
