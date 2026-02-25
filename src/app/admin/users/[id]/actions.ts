'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

export async function deleteUser(userId: string) {
  const supabase = await createClient()

  // Authenticate the caller
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Verify superadmin role
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'superadmin') {
    return { success: false, error: 'Only superadmins can delete users' }
  }

  // Prevent self-deletion
  if (userId === user.id) {
    return { success: false, error: 'You cannot delete your own account' }
  }

  // Create service role client for admin operations
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return { success: false, error: 'Server configuration error' }
  }

  const adminClient = createSupabaseClient<Database>(supabaseUrl, serviceRoleKey)

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = adminClient as any

    // Delete related ticket messages (for tickets owned by this user)
    const { data: userTickets } = await sb
      .from('tickets')
      .select('id')
      .eq('client_id', userId)

    if (userTickets && userTickets.length > 0) {
      const ticketIds = userTickets.map((t: { id: string }) => t.id)

      // Delete messages on those tickets
      await sb.from('ticket_messages').delete().in('ticket_id', ticketIds)

      // Delete files on those tickets
      await sb.from('files').delete().in('ticket_id', ticketIds)

      // Delete the tickets themselves
      await sb.from('tickets').delete().eq('client_id', userId)
    }

    // Also delete any messages this user sent on other people's tickets
    await sb.from('ticket_messages').delete().eq('sender_id', userId)

    // Delete user's profile
    const { error: profileError } = await sb
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) {
      return { success: false, error: `Failed to delete profile: ${profileError.message}` }
    }

    // Delete from auth.users
    const { error: authError } = await adminClient.auth.admin.deleteUser(userId)

    if (authError) {
      return { success: false, error: `Failed to delete auth user: ${authError.message}` }
    }

    return { success: true }
  } catch (err) {
    console.error('[deleteUser] Error:', err)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
