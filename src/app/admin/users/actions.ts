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
