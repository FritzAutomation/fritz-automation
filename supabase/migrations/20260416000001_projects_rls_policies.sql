-- ---------- projects policies ----------

-- Clients: can read their own projects
CREATE POLICY projects_select_own
  ON public.projects
  FOR SELECT
  USING (client_id = auth.uid());

-- Admins: can read all projects
CREATE POLICY projects_select_admin
  ON public.projects
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin')
    )
  );

-- Admins: can insert projects
CREATE POLICY projects_insert_admin
  ON public.projects
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin')
    )
  );

-- Admins: can update projects
CREATE POLICY projects_update_admin
  ON public.projects
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin')
    )
  );

-- Admins: can delete projects
CREATE POLICY projects_delete_admin
  ON public.projects
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin')
    )
  );

-- ---------- project_updates policies ----------

-- Clients: can read updates on their own projects
CREATE POLICY project_updates_select_own
  ON public.project_updates
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_updates.project_id AND p.client_id = auth.uid()
    )
  );

-- Admins: can read all updates
CREATE POLICY project_updates_select_admin
  ON public.project_updates
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin')
    )
  );

-- Admins: can insert updates
CREATE POLICY project_updates_insert_admin
  ON public.project_updates
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin')
    )
  );

-- Admins: can delete updates
CREATE POLICY project_updates_delete_admin
  ON public.project_updates
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin')
    )
  );
