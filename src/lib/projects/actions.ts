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
