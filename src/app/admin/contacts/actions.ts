'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false as const, error: 'Not authenticated', supabase: null }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'superadmin'].includes(profile.role)) {
    return { ok: false as const, error: 'Admin only', supabase: null }
  }
  return { ok: true as const, error: null, supabase }
}

export async function deleteContact(id: string) {
  const check = await assertAdmin()
  if (!check.ok || !check.supabase) {
    return { success: false, error: check.error ?? 'Unauthorized' }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (check.supabase as any)
    .from('contact_submissions')
    .delete()
    .eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/contacts')
  return { success: true }
}
