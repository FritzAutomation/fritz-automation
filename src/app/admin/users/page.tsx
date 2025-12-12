import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

interface Profile {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  role: string
  company_name: string | null
  phone: string | null
  industry: string | null
  created_at: string
}

export default async function AdminUsersPage() {
  const supabase = await createClient()

  let users: Profile[] = []

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    users = data || []
  } catch {
    // Database might not exist yet
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin': return 'bg-red-500/20 text-red-400'
      case 'admin': return 'bg-orange-500/20 text-orange-400'
      case 'client': return 'bg-blue-500/20 text-blue-400'
      default: return 'bg-slate-500/20 text-slate-400'
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Users</h1>
          <p className="text-slate-400 mt-1">Manage all registered users</p>
        </div>
      </div>

      {users.length > 0 ? (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700/50 border-b border-slate-700">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wider">User</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wider">Company</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wider">Industry</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wider">Joined</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.first_name?.[0] || user.email?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {user.first_name && user.last_name
                            ? `${user.first_name} ${user.last_name}`
                            : 'No name'}
                        </p>
                        <p className="text-sm text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {user.company_name || <span className="text-slate-500">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300 capitalize">
                    {user.industry?.replace('-', ' ') || <span className="text-slate-500">—</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-red-400 hover:text-red-300 text-sm font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
          <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No users yet</h3>
          <p className="text-slate-400">Registered users will appear here.</p>
        </div>
      )}
    </div>
  )
}
