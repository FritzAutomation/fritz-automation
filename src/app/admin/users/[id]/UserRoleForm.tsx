'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface UserRoleFormProps {
  userId: string
  currentRole: string
}

export function UserRoleForm({ userId, currentRole }: UserRoleFormProps) {
  const router = useRouter()
  const [role, setRole] = useState(currentRole)
  const [isLoading, setIsLoading] = useState(false)

  async function handleUpdate() {
    setIsLoading(true)

    const supabase = createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('profiles')
      .update({
        role,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    if (error) {
      toast.error(error.message)
      setIsLoading(false)
      return
    }

    toast.success('User role updated successfully!')
    setIsLoading(false)
    router.refresh()
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">User Role</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-1">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-600 bg-slate-700 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
          >
            <option value="client">Client</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
          <p className="text-xs text-slate-400 mt-2">
            Admins can access the admin panel and manage tickets. Super Admins have full access.
          </p>
        </div>

        <Button
          onClick={handleUpdate}
          isLoading={isLoading}
          disabled={role === currentRole}
          className="w-full bg-red-500 hover:bg-red-600"
        >
          Update Role
        </Button>
      </div>
    </div>
  )
}
