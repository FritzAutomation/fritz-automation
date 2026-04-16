# Client Portal v2 — Slice 1: Projects Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce a `projects` concept to the client portal. Clients see their projects and project detail with an updates feed; admin creates, edits, and posts updates on projects; invite-only signup replaces public registration.

**Architecture:** Two new Supabase tables (`projects`, `project_updates`) with RLS. New portal routes show the client's projects. New admin routes let Josh CRUD projects and post updates. A new admin "Invite client" flow uses `supabase.auth.admin.inviteUserByEmail` via the existing service-role pattern. Public registration is replaced with a redirect+explainer.

**Tech Stack:** Next.js 15 App Router, Supabase (database + auth + RLS), TypeScript, Tailwind CSS. No new npm dependencies.

**Development Process:**
- Branch: `portal-v2-projects` off `main`.
- Vercel preview on every push.
- No test infrastructure; verification is manual (dev server + preview).
- Database migrations apply via Supabase CLI or dashboard SQL editor when the branch is deployed.

**Design Spec Reference:** `docs/superpowers/specs/2026-04-16-client-portal-v2-design.md` (Sections 3, 4 apply to this slice).

**Out of scope for this slice:** Project-scoped tickets (Slice 2), per-project files (Slice 3), dark-theme portal redesign, email notifications.

---

## Phase 0 — Setup

### Task 0.1: Create branch

**Files:** none

- [ ] **Step 1: Create and push branch**

```bash
git checkout main && git pull
git checkout -b portal-v2-projects
git push -u origin portal-v2-projects
```

---

## Phase 1 — Database migrations

### Task 1.1: Add projects and project_updates tables

**Files:**
- Create: `supabase/migrations/20260416000000_projects_and_updates.sql`

- [ ] **Step 1: Write the migration**

```sql
-- Enum for project status
create type project_status as enum (
  'proposed',
  'approved',
  'in_progress',
  'in_review',
  'on_hold',
  'completed'
);

-- Projects table
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  status project_status not null default 'proposed',
  start_date date,
  target_date date,
  wave_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_client_id_idx on public.projects(client_id);
create index projects_status_idx on public.projects(status);

-- Auto-update updated_at on row changes
create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.update_updated_at_column();

-- Project updates (timeline feed entries)
create table public.project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  message text not null,
  created_at timestamptz not null default now()
);

create index project_updates_project_id_idx on public.project_updates(project_id, created_at desc);

-- Enable RLS
alter table public.projects enable row level security;
alter table public.project_updates enable row level security;
```

- [ ] **Step 2: Check that `update_updated_at_column()` function exists**

The trigger above uses an existing Postgres function. Search `supabase/migrations/20241211000000_initial_schema.sql` for `update_updated_at_column`. If it exists, the trigger works. If it does not exist, append this function definition above the trigger statement in the migration:

```sql
-- Only add this block if the function does NOT already exist
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;
```

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260416000000_projects_and_updates.sql
git commit -m "Add projects and project_updates tables with RLS enabled"
```

---

### Task 1.2: Add RLS policies for projects and project_updates

**Files:**
- Create: `supabase/migrations/20260416000001_projects_rls_policies.sql`

- [ ] **Step 1: Write the policies**

```sql
-- Helper: check if the current user is admin or superadmin
-- Check existing schema — a helper may already exist. If it does, use it; otherwise inline the role check below.

-- ---------- projects policies ----------

-- Clients: can read their own projects
create policy projects_select_own
  on public.projects
  for select
  using (client_id = auth.uid());

-- Admins: can read all projects
create policy projects_select_admin
  on public.projects
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'superadmin')
    )
  );

-- Admins: can insert projects
create policy projects_insert_admin
  on public.projects
  for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'superadmin')
    )
  );

-- Admins: can update projects
create policy projects_update_admin
  on public.projects
  for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'superadmin')
    )
  );

-- Admins: can delete projects
create policy projects_delete_admin
  on public.projects
  for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'superadmin')
    )
  );

-- ---------- project_updates policies ----------

-- Clients: can read updates on their own projects
create policy project_updates_select_own
  on public.project_updates
  for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_updates.project_id and p.client_id = auth.uid()
    )
  );

-- Admins: can read all updates
create policy project_updates_select_admin
  on public.project_updates
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'superadmin')
    )
  );

-- Admins: can insert updates
create policy project_updates_insert_admin
  on public.project_updates
  for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'superadmin')
    )
  );

-- Admins: can delete updates
create policy project_updates_delete_admin
  on public.project_updates
  for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'superadmin')
    )
  );
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/20260416000001_projects_rls_policies.sql
git commit -m "Add RLS policies for projects and project_updates"
```

---

### Task 1.3: Apply migrations to the Supabase project

**Files:** none (remote DB operation)

- [ ] **Step 1: Apply the migrations**

If the project uses the Supabase CLI with linked project:

```bash
supabase db push
```

If migrations are applied manually, open the Supabase dashboard SQL editor and paste the two migration files' contents in order.

- [ ] **Step 2: Verify tables exist**

In Supabase dashboard → Table Editor, confirm `projects` and `project_updates` tables are listed. Check RLS is enabled on both.

- [ ] **Step 3: Push branch**

```bash
git push
```

No code commit needed — this task only applies SQL to the remote database.

---

## Phase 2 — TypeScript types

### Task 2.1: Add project types

**Files:**
- Modify: `src/types/database.ts`

- [ ] **Step 1: Read current file**

```bash
cat src/types/database.ts
```

Find the `Database['public']['Tables']` interface and the helper-type exports at the bottom.

- [ ] **Step 2: Add projects and project_updates table definitions**

Inside the `Database['public']['Tables']` interface, add two new keys alongside the existing ones (the exact shape follows the existing `tickets` table pattern). Example structure to match:

```typescript
projects: {
  Row: {
    id: string
    client_id: string
    title: string
    description: string | null
    status: 'proposed' | 'approved' | 'in_progress' | 'in_review' | 'on_hold' | 'completed'
    start_date: string | null
    target_date: string | null
    wave_url: string | null
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    client_id: string
    title: string
    description?: string | null
    status?: 'proposed' | 'approved' | 'in_progress' | 'in_review' | 'on_hold' | 'completed'
    start_date?: string | null
    target_date?: string | null
    wave_url?: string | null
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    client_id?: string
    title?: string
    description?: string | null
    status?: 'proposed' | 'approved' | 'in_progress' | 'in_review' | 'on_hold' | 'completed'
    start_date?: string | null
    target_date?: string | null
    wave_url?: string | null
    created_at?: string
    updated_at?: string
  }
  Relationships: []
}

project_updates: {
  Row: {
    id: string
    project_id: string
    author_id: string
    message: string
    created_at: string
  }
  Insert: {
    id?: string
    project_id: string
    author_id: string
    message: string
    created_at?: string
  }
  Update: {
    id?: string
    project_id?: string
    author_id?: string
    message?: string
    created_at?: string
  }
  Relationships: []
}
```

Insert these two table entries into the existing `Tables: { ... }` object alongside `profiles`, `tickets`, etc.

- [ ] **Step 3: Add helper-type exports**

At the bottom of the file, next to the existing helper types like `export type Profile = ...`, add:

```typescript
export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']
export type ProjectStatus = Project['status']

export type ProjectUpdateRow = Database['public']['Tables']['project_updates']['Row']
export type ProjectUpdateInsert = Database['public']['Tables']['project_updates']['Insert']

// Joined: project with client profile
export type ProjectWithClient = Project & {
  client: Pick<Profile, 'id' | 'first_name' | 'last_name' | 'email' | 'company_name'> | null
}

// Joined: update with author
export type ProjectUpdateWithAuthor = ProjectUpdateRow & {
  author: Pick<Profile, 'id' | 'first_name' | 'last_name' | 'role'> | null
}
```

- [ ] **Step 4: Run type-check to confirm no syntax errors**

```bash
npx tsc --noEmit
```

Expected: no new errors. Pre-existing type issues may already produce output — confirm the list is unchanged from before this task.

- [ ] **Step 5: Commit**

```bash
git add src/types/database.ts
git commit -m "Add TypeScript types for projects and project_updates"
git push
```

---

## Phase 3 — Shared UI primitives

### Task 3.1: Create ProjectStatusBadge component

**Files:**
- Create: `src/components/portal/ProjectStatusBadge.tsx`

- [ ] **Step 1: Create the component**

```tsx
import type { ProjectStatus } from '@/types/database'

const STATUS_STYLES: Record<ProjectStatus, { label: string; className: string }> = {
  proposed: {
    label: 'Proposed',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  approved: {
    label: 'Approved',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  in_review: {
    label: 'In Review',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  on_hold: {
    label: 'On Hold',
    className: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  completed: {
    label: 'Completed',
    className: 'bg-green-100 text-green-700 border-green-200',
  },
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const { label, className } = STATUS_STYLES[status]
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}
    >
      {label}
    </span>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/portal/ProjectStatusBadge.tsx
git commit -m "Add ProjectStatusBadge component"
```

---

### Task 3.2: Create ProjectCard component

**Files:**
- Create: `src/components/portal/ProjectCard.tsx`

- [ ] **Step 1: Create the component**

```tsx
import Link from 'next/link'
import { ProjectStatusBadge } from './ProjectStatusBadge'
import type { Project } from '@/types/database'

function formatDate(dateString: string | null): string | null {
  if (!dateString) return null
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function ProjectCard({ project }: { project: Project }) {
  const start = formatDate(project.start_date)
  const target = formatDate(project.target_date)

  return (
    <Link
      href={`/portal/projects/${project.id}`}
      className="block rounded-xl border border-slate-200 bg-white p-5 hover:border-primary/30 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900 truncate">{project.title}</h3>
          {project.description && (
            <p className="text-sm text-slate-600 mt-1 line-clamp-2">{project.description}</p>
          )}
        </div>
        <ProjectStatusBadge status={project.status} />
      </div>

      {(start || target) && (
        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
          {start && <span>Started {start}</span>}
          {target && <span>Target {target}</span>}
        </div>
      )}
    </Link>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/portal/ProjectCard.tsx
git commit -m "Add ProjectCard component for portal project list"
```

---

### Task 3.3: Create UpdatesFeed component

**Files:**
- Create: `src/components/portal/UpdatesFeed.tsx`

- [ ] **Step 1: Create the component**

```tsx
import type { ProjectUpdateWithAuthor } from '@/types/database'

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function UpdatesFeed({ updates }: { updates: ProjectUpdateWithAuthor[] }) {
  if (updates.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <p className="text-sm text-slate-500">
          I&apos;ll post progress here as we build. You&apos;ll see updates the moment I hit save.
        </p>
      </div>
    )
  }

  return (
    <ol className="space-y-4">
      {updates.map((update) => {
        const authorName = update.author
          ? `${update.author.first_name ?? ''} ${update.author.last_name ?? ''}`.trim()
          : 'Unknown'
        return (
          <li
            key={update.id}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-medium text-slate-700">{authorName || 'Fritz Automation'}</span>
              <time className="text-xs text-slate-500">{formatDate(update.created_at)}</time>
            </div>
            <p className="text-sm text-slate-800 whitespace-pre-wrap">{update.message}</p>
          </li>
        )
      })}
    </ol>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/portal/UpdatesFeed.tsx
git commit -m "Add UpdatesFeed component for project timeline"
git push
```

---

## Phase 4 — Portal: dashboard and project detail

### Task 4.1: Rewrite portal dashboard to show projects

**Files:**
- Modify: `src/app/portal/page.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
import { createClient } from '@/lib/supabase/server'
import { ProjectCard } from '@/components/portal/ProjectCard'
import type { Project, Profile } from '@/types/database'

export default async function PortalDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  let projects: Project[] = []
  let profile: Profile | null = null

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any

    const projectsResult = await sb
      .from('projects')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false })

    projects = projectsResult.data || []

    const profileResult = await sb
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    profile = profileResult.data
  } catch {
    // Tables may not exist yet in this environment
  }

  const firstName = profile?.first_name || 'there'
  const activeCount = projects.filter(p => p.status !== 'completed' && p.status !== 'on_hold').length

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Hi {firstName}
        </h1>
        <p className="text-slate-600 mt-1">
          {activeCount > 0
            ? `Here's where your ${activeCount === 1 ? 'project stands' : `${activeCount} projects stand`}.`
            : 'No active projects yet. I\u2019ll post here when we kick off.'}
        </p>
      </div>

      {projects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <h2 className="font-semibold text-slate-900 mb-2">No projects yet</h2>
          <p className="text-sm text-slate-600">
            Once we kick off a project together, it&apos;ll show up here with its status and progress updates.
          </p>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify locally**

```bash
npm run dev
```

Navigate to `/portal`. Should see "No projects yet" empty state (no projects exist in DB yet).

- [ ] **Step 3: Commit**

```bash
git add src/app/portal/page.tsx
git commit -m "Rewrite portal dashboard to show client projects"
```

---

### Task 4.2: Create project detail page

**Files:**
- Create: `src/app/portal/projects/[id]/page.tsx`

- [ ] **Step 1: Create the detail page**

```tsx
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ProjectStatusBadge } from '@/components/portal/ProjectStatusBadge'
import { UpdatesFeed } from '@/components/portal/UpdatesFeed'
import type { Project, ProjectUpdateWithAuthor } from '@/types/database'

function formatDate(dateString: string | null): string | null {
  if (!dateString) return null
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const projectResult = await sb
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('client_id', user.id)
    .maybeSingle()

  const project = projectResult.data as Project | null
  if (!project) return notFound()

  const updatesResult = await sb
    .from('project_updates')
    .select('*, author:profiles(id, first_name, last_name, role)')
    .eq('project_id', id)
    .order('created_at', { ascending: false })

  const updates = (updatesResult.data || []) as ProjectUpdateWithAuthor[]

  const start = formatDate(project.start_date)
  const target = formatDate(project.target_date)

  return (
    <div>
      <div className="mb-6">
        <Link href="/portal" className="text-sm text-slate-500 hover:text-primary">
          ← All projects
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-3xl font-bold text-slate-900">{project.title}</h1>
          <ProjectStatusBadge status={project.status} />
        </div>
        {project.description && (
          <p className="text-slate-600 max-w-3xl whitespace-pre-wrap">{project.description}</p>
        )}
      </div>

      <div className="grid md:grid-cols-[2fr_1fr] gap-8">
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Updates</h2>
          <UpdatesFeed updates={updates} />
        </section>

        <aside className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Project details</h3>
            <dl className="space-y-2 text-sm">
              {start && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Started</dt>
                  <dd className="text-slate-900">{start}</dd>
                </div>
              )}
              {target && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Target</dt>
                  <dd className="text-slate-900">{target}</dd>
                </div>
              )}
            </dl>
          </div>

          {project.wave_url && (
            <a
              href={project.wave_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-slate-200 bg-white p-5 hover:border-primary/30 transition-colors"
            >
              <h3 className="text-sm font-semibold text-slate-900">Invoices &amp; Quotes</h3>
              <p className="text-xs text-slate-500 mt-1">Opens in Wave</p>
              <span className="inline-block mt-3 text-sm text-primary">Open in Wave →</span>
            </a>
          )}
        </aside>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify locally**

`/portal/projects/<any-id>` should 404 (no projects exist yet). After admin creates one (later task), this page renders.

- [ ] **Step 3: Commit**

```bash
git add src/app/portal/projects/[id]/page.tsx
git commit -m "Add portal project detail page with updates feed"
```

---

### Task 4.3: Update PortalSidebar nav

**Files:**
- Modify: `src/app/portal/PortalSidebar.tsx`

- [ ] **Step 1: Replace the navItems array**

Find the existing `navItems` array (around line 61). Replace its contents:

```tsx
const navItems = [
  {
    href: '/portal',
    label: 'Projects',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  },
  {
    href: '/portal/tickets',
    label: 'Tickets',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  },
  {
    href: '/portal/files',
    label: 'Files',
    icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
  },
  {
    href: '/portal/settings',
    label: 'Settings',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  },
]
```

This renames "Dashboard" → "Projects" (pointing at the same `/portal` route) and renames "Support Tickets" → "Tickets" (Slice 2 will tie tickets to projects; for now they stand alone).

- [ ] **Step 2: Verify**

Navigate to `/portal`. Sidebar shows "Projects" (active when at `/portal`) and "Tickets".

- [ ] **Step 3: Commit**

```bash
git add src/app/portal/PortalSidebar.tsx
git commit -m "Rename portal sidebar nav items for projects-first layout"
git push
```

---

## Phase 5 — Admin project CRUD

### Task 5.1: Shared project queries & admin actions

**Files:**
- Create: `src/lib/projects/queries.ts`
- Create: `src/lib/projects/actions.ts`

- [ ] **Step 1: Create queries helpers**

```tsx
// src/lib/projects/queries.ts
import { createClient } from '@/lib/supabase/server'
import type { Project, ProjectWithClient, ProjectUpdateWithAuthor } from '@/types/database'

export async function getClientProjects(userId: string): Promise<Project[]> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('projects')
    .select('*')
    .eq('client_id', userId)
    .order('created_at', { ascending: false })
  return data || []
}

export async function getAllProjectsForAdmin(): Promise<ProjectWithClient[]> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('projects')
    .select('*, client:profiles!projects_client_id_fkey(id, first_name, last_name, email, company_name)')
    .order('created_at', { ascending: false })
  return data || []
}

export async function getProjectForAdmin(id: string): Promise<ProjectWithClient | null> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('projects')
    .select('*, client:profiles!projects_client_id_fkey(id, first_name, last_name, email, company_name)')
    .eq('id', id)
    .maybeSingle()
  return data
}

export async function getProjectUpdates(projectId: string): Promise<ProjectUpdateWithAuthor[]> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('project_updates')
    .select('*, author:profiles(id, first_name, last_name, role)')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
  return data || []
}
```

- [ ] **Step 2: Create admin actions**

```tsx
// src/lib/projects/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ProjectStatus } from '@/types/database'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated', supabase: null, user: null }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'superadmin'].includes(profile.role)) {
    return { ok: false, error: 'Admin only', supabase: null, user: null }
  }
  return { ok: true, error: null, supabase, user }
}

export async function createProject(input: {
  client_id: string
  title: string
  description?: string
  status?: ProjectStatus
  start_date?: string | null
  target_date?: string | null
  wave_url?: string | null
}) {
  const check = await assertAdmin()
  if (!check.ok || !check.supabase) {
    return { success: false, error: check.error ?? 'Unauthorized' }
  }

  if (!input.title.trim()) {
    return { success: false, error: 'Title is required' }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (check.supabase as any)
    .from('projects')
    .insert({
      client_id: input.client_id,
      title: input.title.trim(),
      description: input.description ?? null,
      status: input.status ?? 'proposed',
      start_date: input.start_date ?? null,
      target_date: input.target_date ?? null,
      wave_url: input.wave_url ?? null,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/projects')
  revalidatePath('/portal')
  return { success: true, project: data }
}

export async function updateProject(id: string, input: {
  title?: string
  description?: string | null
  status?: ProjectStatus
  start_date?: string | null
  target_date?: string | null
  wave_url?: string | null
}) {
  const check = await assertAdmin()
  if (!check.ok || !check.supabase) {
    return { success: false, error: check.error ?? 'Unauthorized' }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (check.supabase as any)
    .from('projects')
    .update(input)
    .eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/projects')
  revalidatePath(`/admin/projects/${id}`)
  revalidatePath('/portal')
  revalidatePath(`/portal/projects/${id}`)
  return { success: true }
}

export async function deleteProject(id: string) {
  const check = await assertAdmin()
  if (!check.ok || !check.supabase) {
    return { success: false, error: check.error ?? 'Unauthorized' }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (check.supabase as any)
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/projects')
  return { success: true }
}

export async function postProjectUpdate(projectId: string, message: string) {
  const check = await assertAdmin()
  if (!check.ok || !check.supabase || !check.user) {
    return { success: false, error: check.error ?? 'Unauthorized' }
  }

  const trimmed = message.trim()
  if (!trimmed) return { success: false, error: 'Message is required' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (check.supabase as any)
    .from('project_updates')
    .insert({
      project_id: projectId,
      author_id: check.user.id,
      message: trimmed,
    })

  if (error) return { success: false, error: error.message }

  revalidatePath(`/admin/projects/${projectId}`)
  revalidatePath(`/portal/projects/${projectId}`)
  return { success: true }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/projects
git commit -m "Add project queries and admin server actions"
git push
```

---

### Task 5.2: Admin projects list page

**Files:**
- Create: `src/app/admin/projects/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ProjectStatusBadge } from '@/components/portal/ProjectStatusBadge'
import { getAllProjectsForAdmin } from '@/lib/projects/queries'

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsForAdmin()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-slate-400 mt-1">Create, edit, and post updates on client projects.</p>
        </div>
        <Link href="/admin/projects/new">
          <Button>+ New project</Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 p-12 text-center">
          <h2 className="font-semibold text-white">No projects yet</h2>
          <p className="text-sm text-slate-500 mt-2">
            Create your first project to start tracking client work.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-800">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Project</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Client</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {projects.map((project) => {
                const clientName = project.client
                  ? `${project.client.first_name ?? ''} ${project.client.last_name ?? ''}`.trim() || project.client.email
                  : 'Unknown'
                return (
                  <tr key={project.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="text-sm font-medium text-white hover:text-emerald-400"
                      >
                        {project.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">{clientName}</td>
                    <td className="px-4 py-3">
                      <ProjectStatusBadge status={project.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/projects/page.tsx
git commit -m "Add admin projects list page"
```

---

### Task 5.3: Admin create-project page

**Files:**
- Create: `src/app/admin/projects/new/page.tsx`
- Create: `src/app/admin/projects/new/CreateProjectForm.tsx`

- [ ] **Step 1: Create the server page that loads clients**

```tsx
// src/app/admin/projects/new/page.tsx
import { createClient } from '@/lib/supabase/server'
import { CreateProjectForm } from './CreateProjectForm'

export default async function NewProjectPage() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: clients } = await (supabase as any)
    .from('profiles')
    .select('id, first_name, last_name, email, company_name')
    .eq('role', 'client')
    .order('email', { ascending: true })

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">New project</h1>
      <CreateProjectForm clients={clients || []} />
    </div>
  )
}
```

- [ ] **Step 2: Create the client-side form**

```tsx
// src/app/admin/projects/new/CreateProjectForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { createProject } from '@/lib/projects/actions'
import type { ProjectStatus } from '@/types/database'

interface ClientOption {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  company_name: string | null
}

const STATUSES: { value: ProjectStatus; label: string }[] = [
  { value: 'proposed', label: 'Proposed' },
  { value: 'approved', label: 'Approved' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'in_review', label: 'In Review' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
]

const inputClass = 'w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500 outline-none'

export function CreateProjectForm({ clients }: { clients: ClientOption[] }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    setIsSubmitting(true)
    const result = await createProject({
      client_id: formData.get('client_id') as string,
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || undefined,
      status: (formData.get('status') as ProjectStatus) || 'proposed',
      start_date: (formData.get('start_date') as string) || null,
      target_date: (formData.get('target_date') as string) || null,
      wave_url: (formData.get('wave_url') as string) || null,
    })
    setIsSubmitting(false)

    if (result.success) {
      toast.success('Project created')
      router.push(`/admin/projects/${result.project?.id || ''}`)
    } else {
      toast.error(result.error || 'Failed to create project')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div>
        <label className="block text-sm text-slate-400 mb-1">Client</label>
        <select name="client_id" required className={inputClass}>
          <option value="">Select a client…</option>
          {clients.map((c) => {
            const name = `${c.first_name ?? ''} ${c.last_name ?? ''}`.trim()
            return (
              <option key={c.id} value={c.id}>
                {name ? `${name} (${c.email})` : c.email}
                {c.company_name ? ` — ${c.company_name}` : ''}
              </option>
            )
          })}
        </select>
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">Title</label>
        <input name="title" type="text" required className={inputClass} />
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">Description</label>
        <textarea name="description" rows={4} className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Status</label>
          <select name="status" defaultValue="proposed" className={inputClass}>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Wave URL (optional)</label>
          <input name="wave_url" type="url" placeholder="https://…" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Start date</label>
          <input name="start_date" type="date" className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Target date</label>
          <input name="target_date" type="date" className={inputClass} />
        </div>
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Create project'}
        </Button>
      </div>
    </form>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/projects/new
git commit -m "Add admin create-project page"
```

---

### Task 5.4: Admin project detail page with edit + updates

**Files:**
- Create: `src/app/admin/projects/[id]/page.tsx`
- Create: `src/app/admin/projects/[id]/EditProjectForm.tsx`
- Create: `src/app/admin/projects/[id]/PostUpdateForm.tsx`

- [ ] **Step 1: Create the server page**

```tsx
// src/app/admin/projects/[id]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProjectForAdmin, getProjectUpdates } from '@/lib/projects/queries'
import { EditProjectForm } from './EditProjectForm'
import { PostUpdateForm } from './PostUpdateForm'
import { UpdatesFeed } from '@/components/portal/UpdatesFeed'

export default async function AdminProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = await getProjectForAdmin(id)
  if (!project) return notFound()

  const updates = await getProjectUpdates(id)

  const clientName = project.client
    ? `${project.client.first_name ?? ''} ${project.client.last_name ?? ''}`.trim() || project.client.email
    : 'Unknown'

  return (
    <div>
      <div className="mb-4">
        <Link href="/admin/projects" className="text-sm text-slate-500 hover:text-emerald-400">
          ← All projects
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-white mb-2">{project.title}</h1>
      <p className="text-slate-400 mb-8">Client: {clientName}</p>

      <div className="grid md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">Edit details</h2>
          <EditProjectForm project={project} />
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-4">Post update</h2>
          <PostUpdateForm projectId={project.id} />

          <h2 className="text-lg font-semibold text-white mt-8 mb-4">Timeline</h2>
          <UpdatesFeed updates={updates} />
        </section>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create the edit form**

```tsx
// src/app/admin/projects/[id]/EditProjectForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { updateProject, deleteProject } from '@/lib/projects/actions'
import type { Project, ProjectStatus } from '@/types/database'

const STATUSES: { value: ProjectStatus; label: string }[] = [
  { value: 'proposed', label: 'Proposed' },
  { value: 'approved', label: 'Approved' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'in_review', label: 'In Review' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
]

const inputClass = 'w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500 outline-none'

export function EditProjectForm({ project }: { project: Project }) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    setIsSaving(true)
    const result = await updateProject(project.id, {
      title: (formData.get('title') as string).trim(),
      description: (formData.get('description') as string) || null,
      status: formData.get('status') as ProjectStatus,
      start_date: (formData.get('start_date') as string) || null,
      target_date: (formData.get('target_date') as string) || null,
      wave_url: (formData.get('wave_url') as string) || null,
    })
    setIsSaving(false)

    if (result.success) toast.success('Saved')
    else toast.error(result.error || 'Failed to save')
  }

  async function handleDelete() {
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return
    setIsDeleting(true)
    const result = await deleteProject(project.id)
    setIsDeleting(false)

    if (result.success) {
      toast.success('Project deleted')
      router.push('/admin/projects')
    } else {
      toast.error(result.error || 'Failed to delete')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm text-slate-400 mb-1">Title</label>
        <input name="title" type="text" required defaultValue={project.title} className={inputClass} />
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">Description</label>
        <textarea name="description" rows={3} defaultValue={project.description ?? ''} className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Status</label>
          <select name="status" defaultValue={project.status} className={inputClass}>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Wave URL</label>
          <input name="wave_url" type="url" defaultValue={project.wave_url ?? ''} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Start date</label>
          <input name="start_date" type="date" defaultValue={project.start_date ?? ''} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Target date</label>
          <input name="target_date" type="date" defaultValue={project.target_date ?? ''} className={inputClass} />
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save changes'}
        </Button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-sm text-red-400 hover:text-red-300"
        >
          {isDeleting ? 'Deleting…' : 'Delete project'}
        </button>
      </div>
    </form>
  )
}
```

- [ ] **Step 3: Create the post-update form**

```tsx
// src/app/admin/projects/[id]/PostUpdateForm.tsx
'use client'

import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { postProjectUpdate } from '@/lib/projects/actions'

const inputClass = 'w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500 outline-none'

export function PostUpdateForm({ projectId }: { projectId: string }) {
  const [isPosting, setIsPosting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const message = formData.get('message') as string

    setIsPosting(true)
    const result = await postProjectUpdate(projectId, message)
    setIsPosting(false)

    if (result.success) {
      toast.success('Update posted')
      formRef.current?.reset()
    } else {
      toast.error(result.error || 'Failed to post update')
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
      <textarea
        name="message"
        required
        rows={3}
        placeholder="What did you just ship? What's happening next?"
        className={inputClass}
      />
      <Button type="submit" disabled={isPosting}>
        {isPosting ? 'Posting…' : 'Post update'}
      </Button>
    </form>
  )
}
```

- [ ] **Step 4: Verify locally**

`/admin/projects/new` creates a project. After creation, the detail page loads. Editing saves. Posting an update appears in the timeline.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/projects/[id]
git commit -m "Add admin project detail page with edit and update posting"
git push
```

---

### Task 5.5: Add "Projects" link to AdminSidebar

**Files:**
- Modify: `src/app/admin/AdminSidebar.tsx`

- [ ] **Step 1: Read current AdminSidebar**

```bash
cat src/app/admin/AdminSidebar.tsx
```

Locate the navigation items array (similar to PortalSidebar).

- [ ] **Step 2: Add a "Projects" nav entry**

Insert a new entry into the admin `navItems` array AFTER the Dashboard entry and BEFORE the Tickets entry. Use the same icon pattern as other admin nav items:

```tsx
{
  href: '/admin/projects',
  label: 'Projects',
  icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
},
```

- [ ] **Step 3: Verify**

Navigate to `/admin`. Sidebar shows Dashboard, Projects, Tickets, Users, Contact Submissions.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/AdminSidebar.tsx
git commit -m "Add Projects link to admin sidebar"
git push
```

---

## Phase 6 — Invite-only signup

### Task 6.1: Add invite-client server action

**Files:**
- Create or modify: `src/app/admin/users/actions.ts` (create if does not exist; otherwise append)

- [ ] **Step 1: Check existing file**

```bash
ls src/app/admin/users/
```

If `actions.ts` exists at that path, append. Otherwise create it.

- [ ] **Step 2: Create/append the invite action**

```tsx
// src/app/admin/users/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/types/database'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false as const, error: 'Not authenticated' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'superadmin'].includes(profile.role)) {
    return { ok: false as const, error: 'Admin only' }
  }
  return { ok: true as const }
}

export async function inviteClient(input: {
  email: string
  first_name?: string
  last_name?: string
}) {
  const check = await assertAdmin()
  if (!check.ok) return { success: false, error: check.error }

  const email = input.email.trim().toLowerCase()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Valid email required' }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    return { success: false, error: 'Server configuration error' }
  }

  const adminClient = createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { error } = await adminClient.auth.admin.inviteUserByEmail(email, {
    data: {
      first_name: input.first_name ?? '',
      last_name: input.last_name ?? '',
    },
  })

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/users')
  return { success: true }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/users/actions.ts
git commit -m "Add inviteClient admin action using service role"
```

---

### Task 6.2: Add invite-client UI to /admin/users

**Files:**
- Create: `src/app/admin/users/InviteClientDialog.tsx`
- Modify: `src/app/admin/users/page.tsx`

- [ ] **Step 1: Create the dialog component**

```tsx
// src/app/admin/users/InviteClientDialog.tsx
'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { inviteClient } from './actions'

const inputClass = 'w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500 outline-none'

export function InviteClientDialog() {
  const [open, setOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    setIsSending(true)
    const result = await inviteClient({
      email: formData.get('email') as string,
      first_name: (formData.get('first_name') as string) || undefined,
      last_name: (formData.get('last_name') as string) || undefined,
    })
    setIsSending(false)

    if (result.success) {
      toast.success('Invite sent')
      setOpen(false)
    } else {
      toast.error(result.error || 'Failed to send invite')
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>+ Invite client</Button>

      {open && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Invite a client</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-slate-500 hover:text-slate-300"
                >
                  esc
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Email</label>
                  <input name="email" type="email" required className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">First name</label>
                    <input name="first_name" type="text" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Last name</label>
                    <input name="last_name" type="text" className={inputClass} />
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  They&apos;ll get an email with a one-click link to set their password and access the portal.
                </p>
                <div className="pt-2">
                  <Button type="submit" disabled={isSending}>
                    {isSending ? 'Sending…' : 'Send invite'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  )
}
```

- [ ] **Step 2: Add the dialog to the admin users page**

Read `src/app/admin/users/page.tsx` first:

```bash
cat src/app/admin/users/page.tsx
```

Find the page header (likely a `<h1>` and description). Add the `<InviteClientDialog />` button in the top-right next to the heading, using the same flex-between pattern used in the admin projects list page:

```tsx
import { InviteClientDialog } from './InviteClientDialog'

// replace the existing header block with:
<div className="flex items-center justify-between mb-8">
  <div>
    {/* existing h1 and subtitle */}
  </div>
  <InviteClientDialog />
</div>
```

- [ ] **Step 3: Verify locally**

`/admin/users` now has an "Invite client" button. Clicking opens a modal. Submitting sends the invite (you can test against your own secondary email to confirm).

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/users
git commit -m "Add Invite Client dialog on admin users page"
git push
```

---

### Task 6.3: Replace public register page with redirect + explainer

**Files:**
- Modify: `src/app/register/page.tsx`

- [ ] **Step 1: Replace the file**

```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export const metadata = {
  title: 'Invite only',
  description: 'Fritz Automation client portal is invite-only.',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-3">Portal access is invite-only</h1>
        <p className="text-slate-600 mb-6">
          The Fritz Automation client portal is for clients I&apos;ve kicked off a project with.
          If that&apos;s you and you&apos;re looking for your account, contact me and I&apos;ll get you set up.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/contact"><Button>Contact me</Button></Link>
          <Link href="/login">
            <Button variant="outline">I already have an account</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Remove "Register" link from login page**

```bash
cat src/app/login/page.tsx
```

Find any "Register" / "Sign up" / "Create account" link. Remove it. Keep the "Forgot password?" link.

- [ ] **Step 3: Verify**

`/register` shows the invite-only explainer. `/login` has no register link.

- [ ] **Step 4: Commit**

```bash
git add src/app/register/page.tsx src/app/login/page.tsx
git commit -m "Replace public register with invite-only explainer"
git push
```

---

## Phase 7 — PR

### Task 7.1: Open PR

- [ ] **Step 1: Open the PR**

```bash
gh pr create --title "Client portal v2 — Slice 1: projects layer" --body "$(cat <<'EOF'
## Summary
First slice of the client portal v2 rebuild.

- New `projects` and `project_updates` tables with RLS (clients read their own; admins do everything).
- Portal dashboard now shows the client's projects instead of tickets; new project detail page with metadata and an updates feed.
- Admin gets a full projects section: list, create, edit, delete, post updates.
- Invite-only onboarding: admin can invite a client by email; Supabase emails them a one-click magic link to set their password.
- Public `/register` replaced with an invite-only explainer; "Register" link removed from login.
- Existing tickets and files functionality untouched in this slice (Slices 2 and 3 handle those).

## Design docs
- Spec: \`docs/superpowers/specs/2026-04-16-client-portal-v2-design.md\`
- Plan: \`docs/superpowers/plans/2026-04-16-portal-v2-slice-1-projects.md\`

## Migration notes
Two migrations must be applied before the merged code works:
1. \`20260416000000_projects_and_updates.sql\`
2. \`20260416000001_projects_rls_policies.sql\`

Apply via \`supabase db push\` or the Supabase dashboard SQL editor.

## Test plan
- [ ] Migrations applied; \`projects\` and \`project_updates\` tables exist with RLS.
- [ ] Admin can create a project from \`/admin/projects/new\` and assign to a client.
- [ ] Admin can edit project fields and status on \`/admin/projects/[id]\`.
- [ ] Admin can post an update; it appears in the timeline.
- [ ] Admin can delete a project.
- [ ] Admin can invite a client via \`/admin/users\`; client receives invite email; magic link leads to set-password flow.
- [ ] Client sees only their own projects at \`/portal\`.
- [ ] Client can open \`/portal/projects/[id]\` and see updates feed.
- [ ] Client cannot open a project belonging to another client (404 or blocked by RLS).
- [ ] \`/register\` shows invite-only explainer; "Register" link removed from login.
- [ ] Existing ticket routes still work (no regression).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 2: Report the PR URL**

---

## Self-Review

**Spec coverage (sections 3 and 4 of the design spec):**
- `projects` and `project_updates` tables with indexes and trigger → Task 1.1 ✅
- RLS policies for both tables → Task 1.2 ✅
- Portal dashboard shows projects → Task 4.1 ✅
- Portal project detail with updates feed → Task 4.2 ✅
- Portal sidebar updated → Task 4.3 ✅
- Admin projects list → Task 5.2 ✅
- Admin create project form → Task 5.3 ✅
- Admin edit project + post update → Task 5.4 ✅
- Admin sidebar nav added → Task 5.5 ✅
- Invite flow via admin API → Tasks 6.1, 6.2 ✅
- Public `/register` replaced → Task 6.3 ✅
- "Register" link removed from login → Task 6.3 ✅
- TypeScript types for new tables → Task 2.1 ✅
- Shared status badge, card, feed components → Tasks 3.1, 3.2, 3.3 ✅

**Placeholder scan:** No TBDs or vague steps. Every task has complete code.

**Type consistency:** `Project`, `ProjectStatus`, `ProjectUpdateWithAuthor`, `ProjectWithClient` types defined in Task 2.1 and consumed consistently in Tasks 3.x, 4.x, 5.x. Server actions (`createProject`, `updateProject`, `deleteProject`, `postProjectUpdate`, `inviteClient`) return consistent `{ success: boolean, error?: string }` shape. Status enum values match between migration (SQL enum), types file (TypeScript union), and UI dropdowns.

**One implementation note on RLS:** Policies inline the role check via `exists (select 1 from profiles ...)` rather than assuming a helper function. If the existing schema has a helper like `auth.is_admin()`, substitute it for brevity — but the inline form always works.
