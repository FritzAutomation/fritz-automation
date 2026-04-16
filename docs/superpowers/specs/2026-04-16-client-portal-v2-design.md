# Client Portal v2 Design

**Date:** 2026-04-16
**Status:** Approved
**Branch strategy:** Three sequential branches (one per slice), each with its own PR and Vercel preview. Production updated after each slice merges.
**Depends on:** Existing Supabase + auth infrastructure (profiles table, RLS, middleware auth guards).

## 1. Goals

Rebuild the Fritz Automation client portal around a **projects-first** model. Today's portal is a minimal ticket tracker with no concept of projects. Clients hiring Fritz Automation need a portal where they:

- See their active projects at a glance.
- Read progress updates Josh posts without having to message him.
- Submit tickets scoped to a specific project (so Josh can organize support).
- Download per-project files (signed contracts, deliverables, shared assets).
- Go to Wave for invoices and quotes (linked from each project).

The portal is invite-only — accounts are created when Josh onboards a client. Public registration is disabled.

## 2. Strategic decisions

| Decision | Choice | Rationale |
|---|---|---|
| Scope | Three sequential slices | Incremental delivery; each slice is shippable and valuable alone |
| Client ↔ Project relation | One client per project, many projects per client | YAGNI for teammates; matches solo-studio reality |
| Project lifecycle states | Proposed, Approved, In Progress, In Review, On Hold, Completed | Enough granularity to show "waiting on client" without being excessive |
| Project detail content | Metadata + Updates feed + Tickets + Files + Wave link | Updates feed is the unique value (reduces "how's it going?" messages) |
| Onboarding | Invite-only via Supabase `inviteUserByEmail` | Professional UX, standard B2B pattern |
| Public registration | Disabled; `/register` redirects to `/login` with explainer | Portal is private, not a public product |
| Existing tickets/files | Truncate on migration | No real clients yet — clean slate is cheapest |
| Financial documents | Out of scope (Wave handles) | Don't duplicate what Wave does; link out instead |

## 3. Database changes

### New table: `projects`

```sql
create type project_status as enum (
  'proposed', 'approved', 'in_progress', 'in_review', 'on_hold', 'completed'
);

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
```

### New table: `project_updates`

```sql
create table public.project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  message text not null,
  created_at timestamptz not null default now()
);

create index project_updates_project_id_idx on public.project_updates(project_id, created_at desc);
```

### Modified: `tickets`

Add `project_id` column (NOT NULL after migration). Slice 2 introduces this.

```sql
-- Slice 2 migration:
truncate table public.ticket_messages;
truncate table public.tickets;
alter table public.tickets add column project_id uuid not null references public.projects(id) on delete cascade;
create index tickets_project_id_idx on public.tickets(project_id);
```

### Modified: `files`

Add nullable `project_id` column. Slice 3 introduces this.

```sql
-- Slice 3 migration:
alter table public.files add column project_id uuid references public.projects(id) on delete set null;
create index files_project_id_idx on public.files(project_id);
```

### RLS policies

For each new table, add policies:

**projects**
- Client can SELECT rows where `client_id = auth.uid()`.
- Admin/superadmin can SELECT/INSERT/UPDATE/DELETE all rows.
- Clients cannot write.

**project_updates**
- Client can SELECT rows where the parent project's `client_id = auth.uid()`.
- Admin/superadmin can SELECT/INSERT/UPDATE/DELETE all rows.
- Clients cannot write.

**tickets** (Slice 2 update)
- Existing client policies still apply, but we must update the INSERT policy so clients can only create tickets for their own projects: `project_id IN (SELECT id FROM projects WHERE client_id = auth.uid())`.

**files** (Slice 3 update)
- Client can SELECT files where `project_id` belongs to their project OR `uploaded_by = auth.uid()`.
- Admin can INSERT files with any `project_id`.
- Clients cannot INSERT files with `project_id` set directly (they only upload through tickets).

## 4. Slice 1 — Projects layer

**Goal:** Portal shows client's projects + project detail with updates feed. Admin can CRUD projects and post updates. Invite-only signup starts working.

### New files

- `supabase/migrations/<timestamp>_projects_and_updates.sql` — tables, RLS, indexes
- `src/app/portal/projects/[id]/page.tsx` — project detail page
- `src/app/portal/projects/[id]/ProjectHeader.tsx` — title/status/dates
- `src/app/portal/projects/[id]/UpdatesFeed.tsx` — chronological updates list
- `src/app/admin/projects/page.tsx` — admin projects list
- `src/app/admin/projects/new/page.tsx` — admin create project form
- `src/app/admin/projects/[id]/page.tsx` — admin project detail / edit
- `src/app/admin/projects/[id]/ProjectEditForm.tsx` — inline edit metadata
- `src/app/admin/projects/[id]/PostUpdateForm.tsx` — post a new update
- `src/app/admin/users/InviteClientDialog.tsx` — invite form
- `src/app/admin/users/actions.ts` or add to existing actions — `inviteClient(email, firstName?, lastName?)` server action
- `src/app/register/page.tsx` — replace with redirect + explainer
- `src/components/portal/ProjectCard.tsx` — list-view card for a project
- `src/components/portal/ProjectStatusBadge.tsx` — colored badge per status
- `src/lib/projects/queries.ts` — helper functions (`getClientProjects`, `getProject`, `getProjectUpdates`)
- `src/lib/projects/actions.ts` — admin server actions (`createProject`, `updateProject`, `postUpdate`, `deleteProject`)

### Modified files

- `src/app/portal/page.tsx` — rewrite to show projects list, keep stats but pivot from tickets to projects
- `src/app/portal/PortalSidebar.tsx` — rename "Dashboard" nav to "Projects"; remove "Support Tickets" nav for now (comes back in Slice 2)
- `src/app/admin/AdminSidebar.tsx` — add "Projects" nav
- `src/lib/supabase/middleware.ts` — no changes needed (existing auth still works)
- `src/app/login/page.tsx` — remove "Register" link

### Invite flow

Josh's admin action `inviteClient(email, firstName, lastName)`:

1. Calls `supabase.auth.admin.inviteUserByEmail(email, { data: { first_name, last_name } })` using service-role client.
2. Supabase sends invite email with magic link → client clicks → Supabase directs to the set-password page configured in Supabase dashboard auth settings.
3. The existing `/reset-password` route handles the set-password flow; if needed, a new `/accept-invite` page mirrors it with onboarding copy ("Welcome! Set your password to access your project.").
4. After setup, client lands on `/portal` and sees their empty projects list (project gets assigned in next admin step).

Admin project creation:

1. Admin picks a client from dropdown (lists all users with role=client).
2. Fills title, description, status, dates, optional `wave_url`.
3. Project appears in client's portal on their next page load.

### Voice/copy

Portal dashboard headline: *"Your projects"* (or if empty, *"No active projects yet. I'll post here when we kick off."*).
Update feed empty state: *"I'll post progress here as we build. You'll see updates the moment I hit save."*
Project status badges: colored pills matching the emerald/slate palette.

## 5. Slice 2 — Project-scoped tickets

**Goal:** Tickets belong to a project. Client creates tickets against one of their projects. Project detail page shows that project's tickets.

### Migration

```sql
truncate table public.ticket_messages;
truncate table public.tickets;
alter table public.tickets add column project_id uuid not null references public.projects(id) on delete cascade;
create index tickets_project_id_idx on public.tickets(project_id);
```

### Modified files

- `src/app/portal/tickets/new/page.tsx` — add Project selector (dropdown of client's projects, default to `?project=<id>` if passed in URL)
- `src/app/portal/tickets/page.tsx` — add "Project" column, optional filter by project via query param
- `src/app/portal/tickets/[id]/page.tsx` — show project badge + link back to project
- `src/app/portal/projects/[id]/page.tsx` — add "Tickets" section with list and "New ticket" button that links to `/portal/tickets/new?project=<id>`
- `src/app/admin/tickets/page.tsx` — add Project column + filter
- `src/app/admin/tickets/[id]/page.tsx` — show project info
- `src/app/portal/PortalSidebar.tsx` — bring back "Tickets" as secondary nav (shows all tickets across projects)
- `src/lib/tickets/queries.ts` or equivalent — update queries to include/filter by project
- `src/lib/tickets/actions.ts` — `createTicket` now requires `project_id` and validates the client owns the project

### RLS update

Client INSERT policy on `tickets` adds check: `project_id IN (SELECT id FROM projects WHERE client_id = auth.uid())`.

## 6. Slice 3 — Per-project file sharing

**Goal:** Admin attaches contracts/deliverables/assets directly to a project. Client downloads from project detail page.

### Migration

```sql
alter table public.files add column project_id uuid references public.projects(id) on delete set null;
create index files_project_id_idx on public.files(project_id);
```

### Modified files

- `src/app/portal/projects/[id]/page.tsx` — add "Files" section listing files with `project_id = <this>`; download-only for clients
- `src/app/admin/projects/[id]/page.tsx` — add "Upload file" form with file picker + optional label
- `src/lib/files/actions.ts` or new — `uploadProjectFile(projectId, file)` server action that writes to Supabase Storage + inserts row with `project_id`
- `src/app/portal/files/page.tsx` — group by "Project Files" vs "Ticket Files" for clarity

### Storage

Files go to the existing Supabase Storage bucket (assumed `files`). Storage policy: clients can `select` objects whose row has `project_id` matching one of their projects, OR `uploaded_by = auth.uid()`.

### RLS update

Client SELECT policy on `files` becomes:
```sql
(uploaded_by = auth.uid())
OR (ticket_id in (select id from tickets where client_id = auth.uid()))
OR (project_id in (select id from projects where client_id = auth.uid()))
```

Client INSERT policy: must set `uploaded_by = auth.uid()` and `project_id IS NULL` (clients upload via tickets only). Admin: no restrictions.

## 7. Shared UX conventions

**Status badges:** color-coded per status using Tailwind classes:
- `proposed` → slate
- `approved` → blue
- `in_progress` → emerald
- `in_review` → amber
- `on_hold` → purple
- `completed` → green-500 with checkmark icon

**Date display:** `Month D, YYYY` (e.g., `Apr 16, 2026`) with relative time in hover tooltips ("3 days ago").

**Empty states:** Always written in Josh's voice, first-person where appropriate. No "No data found" boilerplate.

**Admin UI theme:** keep existing dark theme — consistent with today's `/admin`.

**Portal UI theme:** current portal is a mix; keep the existing light theme for now (the reframe focused on marketing pages). Revisit in a future iteration.

## 8. Out of scope

- Financial documents (Wave handles quotes, invoices, receipts).
- Email notifications on project updates or ticket replies.
- Real-time updates / websockets.
- Teammate invitations / multiple clients per project.
- Project templates.
- Time tracking.
- Milestone checklists or percent-complete progress bars.
- Client-editable project fields.
- Dark-theme redesign of the client portal (portal stays light-themed for now).
- Slack / external integrations.
- Reporting/exports.

## 9. Rollout plan

Each slice ships independently:

1. **Slice 1 — Projects layer.** Branch `portal-v2-projects`. Migration + new routes + invite flow + register-redirect + login-cleanup. Merge → production has working projects portal, tickets still work as-is (no `project_id` yet).

2. **Slice 2 — Project-scoped tickets.** Branch `portal-v2-tickets`. Truncate tickets, add `project_id`. Update ticket forms/views. Merge → all tickets now belong to a project.

3. **Slice 3 — Per-project files.** Branch `portal-v2-files`. Add `project_id` to files, admin upload UI, project files section. Merge → clients can download contracts/deliverables from project pages.

Each slice is reviewable via its own Vercel preview. Each merge leaves production in a good state.
