import { createClient } from '@/lib/supabase/server'
import { getRoleColor } from '@/lib/utils'
import Link from 'next/link'
import { Pagination } from '@/components/ui/Pagination'
import { SearchInput } from '@/components/ui/SearchInput'
import { FilterSelect } from '@/components/ui/FilterSelect'

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

const ITEMS_PER_PAGE = 10

const roleOptions = [
  { value: 'client', label: 'Client' },
  { value: 'admin', label: 'Admin' },
  { value: 'superadmin', label: 'Super Admin' },
]

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; role?: string }>
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const params = await searchParams
  const currentPage = Number(params.page) || 1
  const searchQuery = params.search || ''
  const roleFilter = params.role || ''
  const supabase = await createClient()

  let users: Profile[] = []
  let totalCount = 0

  try {
    // Build query with filters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let countQuery = (supabase as any)
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let dataQuery = (supabase as any)
      .from('profiles')
      .select('*')

    // Apply filters
    if (roleFilter) {
      countQuery = countQuery.eq('role', roleFilter)
      dataQuery = dataQuery.eq('role', roleFilter)
    }

    if (searchQuery) {
      const searchPattern = `%${searchQuery}%`
      countQuery = countQuery.or(`email.ilike.${searchPattern},first_name.ilike.${searchPattern},last_name.ilike.${searchPattern},company_name.ilike.${searchPattern}`)
      dataQuery = dataQuery.or(`email.ilike.${searchPattern},first_name.ilike.${searchPattern},last_name.ilike.${searchPattern},company_name.ilike.${searchPattern}`)
    }

    // Get total count
    const { count } = await countQuery
    totalCount = count || 0

    // Get paginated data
    const from = (currentPage - 1) * ITEMS_PER_PAGE
    const to = from + ITEMS_PER_PAGE - 1

    const { data } = await dataQuery
      .order('created_at', { ascending: false })
      .range(from, to)

    users = data || []
  } catch {
    // Database might not exist yet
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Users</h1>
          <p className="text-slate-400 mt-1">Manage all registered users</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchInput
          placeholder="Search users..."
          className="sm:w-64"
          theme="dark"
        />
        <FilterSelect
          paramName="role"
          options={roleOptions}
          placeholder="All Roles"
          theme="dark"
        />
      </div>

      {users.length > 0 ? (
        <div className="space-y-4">
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
                        className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalCount}
            itemsPerPage={ITEMS_PER_PAGE}
            theme="dark"
          />
        </div>
      ) : (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
          <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {searchQuery || roleFilter ? 'No users match your filters' : 'No users yet'}
          </h3>
          <p className="text-slate-400">
            {searchQuery || roleFilter
              ? 'Try adjusting your search or filters.'
              : 'Registered users will appear here.'}
          </p>
        </div>
      )}
    </div>
  )
}
