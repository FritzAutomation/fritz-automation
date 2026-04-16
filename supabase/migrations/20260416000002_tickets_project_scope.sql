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
