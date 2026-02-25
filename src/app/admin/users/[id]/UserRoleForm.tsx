'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { deleteUser } from './actions'

interface UserRoleFormProps {
  userId: string
  currentRole: string
  userEmail: string
  isSelf: boolean
}

export function UserRoleForm({ userId, currentRole, userEmail, isSelf }: UserRoleFormProps) {
  const router = useRouter()
  const [role, setRole] = useState(currentRole)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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

  async function handleDelete() {
    setIsDeleting(true)

    const result = await deleteUser(userId)

    if (!result.success) {
      toast.error(result.error || 'Failed to delete user')
      setIsDeleting(false)
      return
    }

    toast.success('User deleted successfully!')
    router.push('/admin/users')
    router.refresh()
  }

  return (
    <div className="space-y-6">
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

      {/* Danger Zone */}
      <div className="bg-slate-800 rounded-xl border border-red-500/30 p-6">
        <h2 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h2>

        {isSelf ? (
          <p className="text-sm text-slate-400">You cannot delete your own account.</p>
        ) : !showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full px-4 py-2.5 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
          >
            Delete User
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-300">
              Are you sure you want to delete <span className="font-semibold text-white">{userEmail}</span>? This will permanently delete their profile, all tickets, messages, and files. This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleDelete}
                isLoading={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Yes, Delete
              </Button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
