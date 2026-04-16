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
