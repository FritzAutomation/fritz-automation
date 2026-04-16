# Client Portal v2 — Slice 2: Project-Scoped Tickets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every ticket belongs to a project. Clients create tickets against their projects; ticket list shows the project column; project detail page lists its own tickets; admin gets project context on ticket views.

**Architecture:** Add a NOT NULL `project_id` foreign key to `tickets` (truncate first since no real tickets exist). Update RLS so clients can only create tickets for their own projects. Rework ticket creation form to require a project selector. Add tickets section to project detail pages. Admin ticket views surface the project.

**Tech Stack:** Next.js 15 App Router, Supabase (database + RLS), TypeScript, Tailwind CSS. No new npm dependencies.

**Development Process:**
- Branch: `portal-v2-tickets` off `main`.
- Vercel preview on every push.
- No test infrastructure; verification is manual.
- One migration applied via Supabase dashboard SQL editor (or CLI if linked).

**Design Spec Reference:** `docs/superpowers/specs/2026-04-16-client-portal-v2-design.md` (Section 5 applies to this slice).

**Depends on:** Slice 1 (Projects Layer) — already shipped to production.

**Out of scope:** Per-project file sharing (Slice 3); any redesign of the ticket detail/messaging UI; any email notification changes.

---

## Phase 0 — Setup

### Task 0.1: Create branch

**Files:** none

- [ ] **Step 1: Create and push branch**

```bash
git checkout main && git pull
git checkout -b portal-v2-tickets
git push -u origin portal-v2-tickets
```

---

## Phase 1 — Database migration

### Task 1.1: Migration to project-scope tickets

**Files:**
- Create: `supabase/migrations/20260416000002_tickets_project_scope.sql`

The migration truncates existing tickets (no real client data), adds a NOT NULL `project_id` FK, replaces the client INSERT RLS policy so clients can only create tickets for their own projects.

- [ ] **Step 1: Write the migration**

```sql
-- Truncate tickets and their messages. Slice 2 introduces project_id as
-- NOT NULL; any pre-existing tickets would violate the constraint because
-- they were never associated with a project. Safe to truncate because
-- no real clients have submitted tickets yet.
TRUNCATE TABLE public.ticket_messages;
TRUNCATE TABLE public.tickets CASCADE;

-- Add project_id as NOT NULL FK. ON DELETE CASCADE so deleting a project
-- cleans up its tickets (matches how project_updates behave).
ALTER TABLE public.tickets
  ADD COLUMN project_id UUID NOT NULL
  REFERENCES public.projects(id) ON DELETE CASCADE;

CREATE INDEX tickets_project_id_idx ON public.tickets(project_id);

-- Replace the client INSERT policy so clients can only create tickets for
-- projects they own. Drop the existing policy first (name varies between
-- environments; we look up and drop all INSERT policies on tickets that
-- apply to authenticated users).
DO $$
DECLARE
  policy_rec RECORD;
BEGIN
  FOR policy_rec IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'tickets'
      AND cmd = 'INSERT'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.tickets', policy_rec.policyname);
  END LOOP;
END $$;

-- Client INSERT: can create tickets only for projects they own.
CREATE POLICY tickets_insert_client
  ON public.tickets
  FOR INSERT
  WITH CHECK (
    client_id = auth.uid()
    AND project_id IN (
      SELECT id FROM public.projects WHERE client_id = auth.uid()
    )
  );

-- Admin INSERT: can insert any ticket.
CREATE POLICY tickets_insert_admin
  ON public.tickets
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin')
    )
  );
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/20260416000002_tickets_project_scope.sql
git commit -m "Migrate tickets to be project-scoped with updated RLS"
git push
```

### Task 1.2: Apply migration

**Files:** none (remote DB operation)

- [ ] **Step 1: Apply**

Open Supabase dashboard → SQL Editor (https://supabase.com/dashboard/project/fwewqxbrijdklgcqzeeb/sql/new) → paste the contents of `supabase/migrations/20260416000002_tickets_project_scope.sql` → Run.

Expected: success with no rows returned. Any pre-existing tickets are truncated.

- [ ] **Step 2: Verify**

In Supabase Table Editor → `tickets` table → confirm:
- Column `project_id` exists (uuid, NOT NULL, FK to projects)
- Index `tickets_project_id_idx` exists
- RLS policies: at least `tickets_insert_client` and `tickets_insert_admin` present

---

## Phase 2 — TypeScript types

### Task 2.1: Add project_id to tickets type

**Files:**
- Modify: `src/types/database.ts`

- [ ] **Step 1: Read the tickets type**

```bash
grep -n "tickets:" src/types/database.ts
```

Find the three type blocks: `Row`, `Insert`, `Update` for `tickets`.

- [ ] **Step 2: Add `project_id: string` to `Row` and `Insert`**

In the `Row` block:

```typescript
tickets: {
  Row: {
    id: string
    ticket_number: string
    client_id: string
    project_id: string              // <-- add this line
    subject: string
    description: string | null
    status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed'
    priority: 'low' | 'normal' | 'high' | 'urgent'
    category: string | null
    assigned_to: string | null
    created_at: string
    updated_at: string
    resolved_at: string | null
  }
```

In the `Insert` block, add `project_id: string` as required (not optional) since the DB column is NOT NULL:

```typescript
  Insert: {
    id?: string
    ticket_number?: string
    client_id: string
    project_id: string              // <-- add this line
    subject: string
    description?: string | null
    status?: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed'
    priority?: 'low' | 'normal' | 'high' | 'urgent'
    category?: string | null
    assigned_to?: string | null
    created_at?: string
    updated_at?: string
    resolved_at?: string | null
  }
```

In the `Update` block, add `project_id?: string` as optional:

```typescript
  Update: {
    id?: string
    ticket_number?: string
    client_id?: string
    project_id?: string             // <-- add this line
    subject?: string
    description?: string | null
    status?: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed'
    priority?: 'low' | 'normal' | 'high' | 'urgent'
    category?: string | null
    assigned_to?: string | null
    created_at?: string
    updated_at?: string
    resolved_at?: string | null
  }
}
```

- [ ] **Step 3: Add a joined helper type**

Find the existing helper type exports near the top of the file (where `TicketWithClient` is defined). Add:

```typescript
// Ticket joined with its parent project (for list views that need project title/status)
export type TicketWithProject = Ticket & {
  project: Pick<Project, 'id' | 'title' | 'status'> | null
}

// Ticket with both client and project (for admin views)
export type TicketWithClientAndProject = Ticket & {
  client: Pick<Profile, 'id' | 'first_name' | 'last_name' | 'email' | 'company_name' | 'phone'> | null
  project: Pick<Project, 'id' | 'title' | 'status'> | null
}
```

Note: `Project` is already exported from this file. If the new types reference `Project` before it's declared in the file, move the new helpers below the `Project` export, or reorder so `Project` is declared before these helpers.

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add src/types/database.ts
git commit -m "Add project_id to tickets type and joined helpers"
git push
```

---

## Phase 3 — Portal ticket creation with project selector

### Task 3.1: Update createTicket server action

**Files:**
- Modify: `src/app/portal/tickets/new/actions.ts`

- [ ] **Step 1: Update the `CreateTicketData` interface and function**

Replace the file with:

```tsx
'use server'

import { createClient } from '@/lib/supabase/server'
import { sendNewTicketNotification, sendTicketConfirmation } from '@/lib/email'

interface CreateTicketData {
  project_id: string
  subject: string
  category: string | null
  priority: string
  description: string
}

export async function createTicket(data: CreateTicketData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'You must be logged in to create a ticket' }
  }

  if (!data.project_id) {
    return { success: false, error: 'Please select a project for this ticket' }
  }

  // Verify the client owns the project before inserting. RLS will also enforce
  // this, but checking up front gives a clearer error message.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: project } = await (supabase as any)
    .from('projects')
    .select('id')
    .eq('id', data.project_id)
    .eq('client_id', user.id)
    .maybeSingle()

  if (!project) {
    return { success: false, error: 'Project not found' }
  }

  // Get user profile for email notification
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('first_name, last_name, email')
    .eq('id', user.id)
    .single()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: ticket, error } = await (supabase as any)
    .from('tickets')
    .insert({
      client_id: user.id,
      project_id: data.project_id,
      subject: data.subject,
      category: data.category || null,
      priority: data.priority,
      description: data.description,
    })
    .select('id, ticket_number')
    .single()

  if (error) {
    console.error('Ticket creation error:', error)
    return { success: false, error: error.message }
  }

  const clientName = profile
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Client'
    : 'Client'
  const clientEmail = profile?.email || user.email || ''

  if (ticket) {
    sendNewTicketNotification({
      ticketNumber: ticket.ticket_number,
      subject: data.subject,
      clientName,
      clientEmail,
      ticketId: ticket.id,
    }).catch((err) => console.error('Failed to send admin notification:', err))

    if (clientEmail) {
      sendTicketConfirmation({
        ticketNumber: ticket.ticket_number,
        subject: data.subject,
        clientName,
        clientEmail,
        ticketId: ticket.id,
      }).catch((err) => console.error('Failed to send client confirmation:', err))
    }
  }

  return { success: true, ticketId: ticket?.id }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/portal/tickets/new/actions.ts
git commit -m "Update createTicket action to require project_id"
```

---

### Task 3.2: Add project selector to NewTicketForm

**Files:**
- Modify: `src/app/portal/tickets/new/page.tsx`
- Modify: `src/app/portal/tickets/new/NewTicketForm.tsx`

The form needs a Project dropdown. The server page fetches the client's projects and passes them to the form. If a `?project=<id>` query param is present, preselect that project.

- [ ] **Step 1: Rewrite the server page to fetch projects and accept URL param**

Replace `src/app/portal/tickets/new/page.tsx`:

```tsx
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NewTicketForm } from './NewTicketForm'

export const metadata: Metadata = {
  title: 'New Ticket',
  description: 'Create a new support ticket',
}

interface PageProps {
  searchParams: Promise<{ project?: string }>
}

export default async function NewTicketPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: projects } = await (supabase as any)
    .from('projects')
    .select('id, title, status')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  const clientProjects = (projects || []) as { id: string; title: string; status: string }[]

  // If client has no projects, there's nothing they can scope a ticket to.
  // Redirect back to dashboard with an explanatory message.
  if (clientProjects.length === 0) {
    redirect('/portal?error=no-projects')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Create New Ticket</h1>
        <p className="text-slate-600 mt-1">Submit a support request scoped to one of your projects</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <NewTicketForm projects={clientProjects} defaultProjectId={params.project} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update NewTicketForm with project selector**

Replace `src/app/portal/tickets/new/NewTicketForm.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { createTicket } from './actions'
import { toast } from 'sonner'

interface FormErrors {
  project?: string
  subject?: string
  description?: string
}

interface ProjectOption {
  id: string
  title: string
  status: string
}

interface NewTicketFormProps {
  projects: ProjectOption[]
  defaultProjectId?: string
}

const selectClass =
  'w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all'

export function NewTicketForm({ projects, defaultProjectId }: NewTicketFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  // Preselect if defaultProjectId is valid, otherwise first project
  const initialProjectId = projects.find(p => p.id === defaultProjectId)?.id || projects[0]?.id || ''

  function validateForm(project_id: string, subject: string, description: string): FormErrors {
    const newErrors: FormErrors = {}
    if (!project_id) newErrors.project = 'Please pick a project'
    if (!subject || subject.trim().length < 5) {
      newErrors.subject = 'Please enter a subject (at least 5 characters)'
    } else if (subject.length > 200) {
      newErrors.subject = 'Subject must be less than 200 characters'
    }
    if (!description || description.trim().length < 20) {
      newErrors.description = 'Please provide more detail (at least 20 characters)'
    }
    return newErrors
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const project_id = formData.get('project_id') as string
    const subject = formData.get('subject') as string
    const category = formData.get('category') as string
    const priority = formData.get('priority') as string
    const description = formData.get('description') as string

    const validationErrors = validateForm(project_id, subject, description)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please fix the errors in the form')
      return
    }

    setErrors({})
    setIsLoading(true)

    const result = await createTicket({
      project_id,
      subject,
      category: category || null,
      priority,
      description,
    })

    if (!result.success) {
      toast.error(result.error || 'Failed to create ticket')
      setIsLoading(false)
      return
    }

    toast.success('Ticket created successfully! A confirmation email has been sent.')
    router.push('/portal/tickets')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="project_id" className="block text-sm font-medium text-slate-900 mb-1">
          Project
        </label>
        <select
          id="project_id"
          name="project_id"
          defaultValue={initialProjectId}
          required
          className={selectClass}
        >
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
        {errors.project && <p className="mt-1 text-sm text-red-600">{errors.project}</p>}
      </div>

      <Input
        id="subject"
        name="subject"
        label="Subject"
        placeholder="Short summary of your request"
        required
        minLength={5}
        maxLength={200}
        error={errors.subject}
      />

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-slate-900 mb-1">
          Category
        </label>
        <select id="category" name="category" defaultValue="general" className={selectClass}>
          <option value="general">General</option>
          <option value="technical">Technical</option>
          <option value="billing">Billing</option>
          <option value="feature">Feature Request</option>
          <option value="bug">Bug Report</option>
        </select>
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-slate-900 mb-1">
          Priority
        </label>
        <select id="priority" name="priority" defaultValue="normal" className={selectClass}>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <Textarea
        id="description"
        name="description"
        label="Description"
        placeholder="What's going on? The more detail you share, the faster I can help."
        rows={6}
        required
        minLength={20}
        error={errors.description}
      />

      <div className="flex gap-3">
        <Button type="submit" isLoading={isLoading}>Create Ticket</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  )
}
```

- [ ] **Step 3: Add the no-projects error handler to `/portal/page.tsx`**

Modify `src/app/portal/page.tsx` so it surfaces a banner when `?error=no-projects` is in the URL.

Read the current file, then add a `searchParams` prop to the `PortalDashboard` function signature:

```tsx
export default async function PortalDashboard({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const showNoProjectsError = params.error === 'no-projects'

  // ...existing code that fetches user, projects, profile...
```

Then, near the top of the rendered JSX (just after the greeting `<h1>`/`<p>` block, before the projects grid), add:

```tsx
{showNoProjectsError && (
  <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
    You don&apos;t have any projects yet, so there&apos;s nothing to scope a ticket to. I&apos;ll reach out when we kick off.
  </div>
)}
```

- [ ] **Step 4: Build and verify**

```bash
npm run build
```

Expected: clean build.

- [ ] **Step 5: Commit**

```bash
git add src/app/portal/tickets/new/ src/app/portal/page.tsx
git commit -m "Add project selector to new ticket form and no-projects redirect"
git push
```

---

## Phase 4 — Portal ticket list and detail

### Task 4.1: Portal tickets list with Project column

**Files:**
- Modify: `src/app/portal/tickets/page.tsx`

- [ ] **Step 1: Rewrite the file**

```tsx
import { createClient } from '@/lib/supabase/server'
import { getStatusColor, getPriorityColor, formatStatus } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import type { TicketWithProject } from '@/types/database'

export default async function TicketsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  let tickets: TicketWithProject[] = []

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from('tickets')
      .select('*, project:projects!tickets_project_id_fkey(id, title, status)')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false })

    tickets = (data || []) as TicketWithProject[]
  } catch {
    // Database might not exist yet
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tickets</h1>
          <p className="text-slate-600 mt-1">Your support requests across all projects</p>
        </div>
        <Link href="/portal/tickets/new">
          <Button>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Ticket
          </Button>
        </Link>
      </div>

      {tickets.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Ticket</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Project</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Subject</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Priority</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/portal/tickets/${ticket.id}`} className="text-primary font-medium hover:underline">
                      {ticket.ticket_number}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    {ticket.project ? (
                      <Link
                        href={`/portal/projects/${ticket.project.id}`}
                        className="text-sm text-slate-700 hover:text-primary"
                      >
                        {ticket.project.title}
                      </Link>
                    ) : (
                      <span className="text-sm text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/portal/tickets/${ticket.id}`} className="text-slate-900 hover:text-primary">
                      {ticket.subject}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status, 'light')}`}>
                      {formatStatus(ticket.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority, 'light')}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No tickets yet</h3>
          <p className="text-slate-600 mb-6">Pick a project and create a ticket when you need help.</p>
          <Link href="/portal/tickets/new">
            <Button>Create a Ticket</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/portal/tickets/page.tsx
git commit -m "Add Project column to portal tickets list"
```

---

### Task 4.2: Portal ticket detail shows project link

**Files:**
- Modify: `src/app/portal/tickets/[id]/page.tsx`

- [ ] **Step 1: Read the current file**

```bash
cat src/app/portal/tickets/[id]/page.tsx
```

Identify where the ticket metadata is displayed (subject, status, etc.) — there's typically a block showing ticket details near the top.

- [ ] **Step 2: Update the Supabase select to include the project**

Locate the `.from('tickets').select(...)` call. Change the select to join project info:

```tsx
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { data: ticket } = await (supabase as any)
  .from('tickets')
  .select('*, project:projects!tickets_project_id_fkey(id, title, status)')
  .eq('id', id)
  .eq('client_id', user.id)
  .maybeSingle()
```

Update the local type or cast to reflect the project join. If the page has a `Ticket` interface defined inline, add `project: { id: string; title: string; status: string } | null` to it. Or import `TicketWithProject` from `@/types/database`.

- [ ] **Step 3: Render the project in the metadata block**

In the JSX where ticket metadata is displayed (near ticket_number, status), add a project link:

```tsx
{ticket.project && (
  <div className="flex items-center gap-2 text-sm text-slate-600">
    <span>Project:</span>
    <Link
      href={`/portal/projects/${ticket.project.id}`}
      className="text-primary font-medium hover:underline"
    >
      {ticket.project.title}
    </Link>
  </div>
)}
```

Place this alongside the existing status/priority display, above the description. Adjust markup to match the existing page's style.

- [ ] **Step 4: Commit**

```bash
git add src/app/portal/tickets/[id]/page.tsx
git commit -m "Show parent project on portal ticket detail page"
git push
```

---

## Phase 5 — Portal project detail page shows tickets

### Task 5.1: Add Tickets section to project detail

**Files:**
- Modify: `src/app/portal/projects/[id]/page.tsx`

- [ ] **Step 1: Read current file**

```bash
cat src/app/portal/projects/[id]/page.tsx
```

- [ ] **Step 2: Fetch tickets for this project and add section**

Add a new Supabase query after the project + updates fetches:

```tsx
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ticketsResult = await sb
  .from('tickets')
  .select('id, ticket_number, subject, status, priority, created_at')
  .eq('project_id', id)
  .eq('client_id', user.id)
  .order('created_at', { ascending: false })

const projectTickets = (ticketsResult.data || []) as Array<{
  id: string
  ticket_number: string
  subject: string
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  created_at: string
}>
```

Then add a new section in the JSX, below the `<UpdatesFeed>` inside the left column (`<section>`), before the closing tag:

```tsx
<div className="mt-10">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-slate-900">Tickets</h2>
    <Link
      href={`/portal/tickets/new?project=${project.id}`}
      className="text-sm font-medium text-primary hover:underline"
    >
      + New ticket
    </Link>
  </div>

  {projectTickets.length === 0 ? (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <p className="text-sm text-slate-500">
        No tickets yet. Open one when you need help on this project.
      </p>
    </div>
  ) : (
    <ul className="space-y-2">
      {projectTickets.map(t => (
        <li key={t.id}>
          <Link
            href={`/portal/tickets/${t.id}`}
            className="block rounded-lg border border-slate-200 bg-white p-3 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{t.ticket_number}</span>
                  <span>·</span>
                  <span>{new Date(t.created_at).toLocaleDateString()}</span>
                </div>
                <div className="text-sm text-slate-900 mt-0.5 truncate">{t.subject}</div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                {t.status.replace('_', ' ')}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )}
</div>
```

- [ ] **Step 3: Commit**

```bash
git add src/app/portal/projects/[id]/page.tsx
git commit -m "Show tickets section on portal project detail page"
git push
```

---

## Phase 6 — Admin ticket views with project context

### Task 6.1: Admin tickets list with Project column

**Files:**
- Modify: `src/app/admin/tickets/page.tsx`

- [ ] **Step 1: Update the Supabase select to join the project**

Find the `dataQuery` variable (around line 59). Update the select:

```tsx
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let dataQuery = (supabase as any)
  .from('tickets')
  .select(`
    *,
    client:profiles!tickets_client_id_fkey(id, first_name, last_name, email, company_name, phone),
    project:projects!tickets_project_id_fkey(id, title, status)
  `)
```

- [ ] **Step 2: Update the TypeScript cast**

Around the existing cast (`tickets = (data || []) as unknown as TicketWithClient[]`), change to:

```tsx
import type { TicketWithClientAndProject } from '@/types/database'
// ...
let tickets: TicketWithClientAndProject[] = []
// ...
tickets = (data || []) as unknown as TicketWithClientAndProject[]
```

Replace the existing `TicketWithClient` import with `TicketWithClientAndProject` (or add it alongside).

- [ ] **Step 3: Add a Project column to the table**

In the table `<thead>` `<tr>`, insert a new column header between Ticket and Client:

```tsx
<SortableHeader column="ticket_number" label="Ticket" theme="dark" />
<th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wider">Project</th>
<th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wider">Client</th>
```

In the `<tbody>` row, add a matching `<td>`:

```tsx
<td className="px-6 py-4">
  {ticket.project ? (
    <Link
      href={`/admin/projects/${ticket.project.id}`}
      className="text-sm text-slate-200 hover:text-emerald-400"
    >
      {ticket.project.title}
    </Link>
  ) : (
    <span className="text-sm text-slate-500">—</span>
  )}
</td>
```

Insert this `<td>` right after the ticket_number `<td>` and before the client `<td>`.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/tickets/page.tsx
git commit -m "Add Project column to admin tickets list"
```

---

### Task 6.2: Admin ticket detail shows project link

**Files:**
- Modify: `src/app/admin/tickets/[id]/page.tsx`

- [ ] **Step 1: Read current file**

```bash
cat src/app/admin/tickets/[id]/page.tsx
```

- [ ] **Step 2: Update the select to join the project**

Find the `.from('tickets').select(...)` call. Update the select to include project:

```tsx
.select(`
  *,
  client:profiles!tickets_client_id_fkey(id, first_name, last_name, email, company_name, phone),
  project:projects!tickets_project_id_fkey(id, title, status)
`)
```

- [ ] **Step 3: Render the project link**

In the ticket metadata section (near the ticket_number, client info, etc.), add a project display:

```tsx
{ticket.project && (
  <div>
    <p className="text-xs text-slate-400 uppercase tracking-wide">Project</p>
    <Link
      href={`/admin/projects/${ticket.project.id}`}
      className="text-sm font-medium text-emerald-400 hover:text-emerald-300"
    >
      {ticket.project.title}
    </Link>
  </div>
)}
```

Place this alongside the existing ticket metadata blocks (status, client name, etc.), following whatever layout pattern is used.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/tickets/[id]/page.tsx
git commit -m "Show parent project on admin ticket detail page"
git push
```

---

## Phase 7 — Admin project detail page shows tickets

### Task 7.1: Add tickets section to admin project detail

**Files:**
- Modify: `src/app/admin/projects/[id]/page.tsx`

- [ ] **Step 1: Fetch tickets in the server page**

Open `src/app/admin/projects/[id]/page.tsx`. Near the top where `getProjectUpdates` is called, add a tickets fetch:

```tsx
import { createClient } from '@/lib/supabase/server'

// inside the component, after getting `project` and `updates`:
const supabase = await createClient()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { data: ticketsData } = await (supabase as any)
  .from('tickets')
  .select('id, ticket_number, subject, status, priority, created_at')
  .eq('project_id', id)
  .order('created_at', { ascending: false })

const projectTickets = (ticketsData || []) as Array<{
  id: string
  ticket_number: string
  subject: string
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  created_at: string
}>
```

- [ ] **Step 2: Render a Tickets section**

In the JSX, below the `<UpdatesFeed>` call (inside the right column section), add:

```tsx
<h2 className="text-lg font-semibold text-white mt-8 mb-4">Tickets</h2>
{projectTickets.length === 0 ? (
  <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-sm text-slate-500 text-center">
    No tickets on this project yet.
  </div>
) : (
  <ul className="space-y-2">
    {projectTickets.map(t => (
      <li key={t.id}>
        <Link
          href={`/admin/tickets/${t.id}`}
          className="block rounded-lg border border-slate-800 bg-slate-900/60 p-3 hover:border-emerald-500/40 transition-colors"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{t.ticket_number}</span>
                <span>·</span>
                <span>{new Date(t.created_at).toLocaleDateString()}</span>
              </div>
              <div className="text-sm text-slate-200 mt-0.5 truncate">{t.subject}</div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              {t.status.replace('_', ' ')}
            </span>
          </div>
        </Link>
      </li>
    ))}
  </ul>
)}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/projects/[id]/page.tsx
git commit -m "Show tickets section on admin project detail page"
git push
```

---

## Phase 8 — Build verification + PR

### Task 8.1: Full build

- [ ] **Step 1: Run build**

```bash
npm run build
```

Expected: clean build, all pages compile.

If there are TypeScript errors related to the `TicketWithProject` / `TicketWithClientAndProject` types, verify Task 2.1 was applied fully and that those exports exist in `src/types/database.ts`.

- [ ] **Step 2: Commit any polish fixes**

If you had to make small adjustments during the build check, commit them:

```bash
git add -A
git commit -m "Post-build fixes for Slice 2" || echo "No changes"
git push
```

### Task 8.2: Open PR

- [ ] **Step 1: Open PR**

```bash
gh pr create --title "Client portal v2 — Slice 2: project-scoped tickets" --body "$(cat <<'EOF'
## Summary
Second slice of the client portal v2 rebuild: tickets now belong to a project.

- Migration adds \`project_id NOT NULL\` FK to \`tickets\` (existing tickets truncated — no real clients yet). Client INSERT RLS rewritten to require a valid owned project.
- Portal ticket creation form requires selecting a project. "New ticket" button on project detail page pre-selects that project via URL param.
- Portal tickets list shows Project column; ticket detail shows parent project with link back.
- Portal project detail page gains a Tickets section with status badges and "+ New ticket" link scoped to the project.
- Admin tickets list and detail views both show project context with a link to the project detail page.
- Admin project detail page shows a Tickets section listing all tickets for that project.

## Design docs
- Spec: \`docs/superpowers/specs/2026-04-16-client-portal-v2-design.md\`
- Plan: \`docs/superpowers/plans/2026-04-16-portal-v2-slice-2-tickets.md\`

## Migration notes
Before merging, apply:
- \`supabase/migrations/20260416000002_tickets_project_scope.sql\`

This TRUNCATEs tickets and ticket_messages. Safe because no real clients exist yet.

## Test plan
- [ ] Migration applied; \`tickets.project_id\` column exists as NOT NULL FK.
- [ ] Client with no projects visits \`/portal/tickets/new\` → redirected to \`/portal\` with an explanatory banner.
- [ ] Client with projects sees project selector (defaults to first project).
- [ ] Client creates ticket against Project A → ticket appears in \`/portal/tickets\` with Project column populated.
- [ ] Client visits Project A detail page → ticket visible in Tickets section.
- [ ] Client clicks "+ New ticket" from Project B detail → new ticket form preselects Project B.
- [ ] Admin \`/admin/tickets\` shows Project column.
- [ ] Admin ticket detail page shows project name with link.
- [ ] Admin project detail page shows tickets for that project.
- [ ] Attempting to create a ticket for a project NOT owned by the client (e.g., hitting the server action directly with another client's project id) fails with "Project not found".

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 2: Report PR URL**

---

## Self-Review

**Spec coverage (Section 5 of the design spec):**
- Migration: truncate + add `project_id NOT NULL` FK → Task 1.1 ✅
- Ticket creation form: project selector → Task 3.2 ✅
- `createTicket` requires `project_id`, validates ownership → Task 3.1 ✅
- Portal ticket list: Project column → Task 4.1 ✅
- Portal ticket detail: project badge + link → Task 4.2 ✅
- Portal project detail: Tickets section with "+ New ticket" preselecting project → Task 5.1 ✅
- Admin ticket list: Project column + filter → Task 6.1 (column added; search-by-project filter deferred — not blocking, admin can filter by selecting Project link) ⚠️
- Admin ticket detail: project info → Task 6.2 ✅
- Admin project detail: tickets section → Task 7.1 ✅
- RLS update: client INSERT requires valid owned project → Task 1.1 ✅

**Note on deferred item:** The admin tickets list filter-by-project is a nice-to-have. Clicking a project link on a ticket row takes you to the project page where you see its tickets, so the workflow is already reachable. If it becomes a pain point, we add a FilterSelect for project in a follow-up.

**Placeholder scan:** No TBDs or vague steps. All code blocks are complete.

**Type consistency:** `TicketWithProject` and `TicketWithClientAndProject` defined in Task 2.1 and consumed in Tasks 4.1 and 6.1 respectively. `project_id` field name consistent across SQL migration, TypeScript types, server actions, and forms. Status enum values (`open`, `in_progress`, `waiting`, `resolved`, `closed`) unchanged — no touch on existing ticket statuses since Slice 2 is a relational refactor, not a workflow change.
