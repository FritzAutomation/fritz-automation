import { createClient } from '@/lib/supabase/server'
import { getStatusColor, getPriorityColor, formatStatus } from '@/lib/utils'
import type { TicketWithClient } from '@/types/database'
import Link from 'next/link'
import { Pagination } from '@/components/ui/Pagination'
import { SearchInput } from '@/components/ui/SearchInput'
import { FilterSelect } from '@/components/ui/FilterSelect'
import { SortableHeader } from '@/components/ui/SortableHeader'

const ITEMS_PER_PAGE = 10

const statusOptions = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'waiting', label: 'Waiting' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
]

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
]

interface PageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    status?: string
    priority?: string
    sort?: string
    order?: string
  }>
}

export default async function AdminTicketsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const currentPage = Number(params.page) || 1
  const searchQuery = params.search || ''
  const statusFilter = params.status || ''
  const priorityFilter = params.priority || ''
  const sortColumn = params.sort || 'created_at'
  const sortOrder = params.order || 'desc'
  const supabase = await createClient()

  let tickets: TicketWithClient[] = []
  let totalCount = 0

  try {
    // Build query with filters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let countQuery = (supabase as any)
      .from('tickets')
      .select('*', { count: 'exact', head: true })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let dataQuery = (supabase as any)
      .from('tickets')
      .select(`
        *,
        client:profiles!tickets_client_id_fkey(id, first_name, last_name, email, company_name, phone)
      `)

    // Apply filters
    if (statusFilter) {
      countQuery = countQuery.eq('status', statusFilter)
      dataQuery = dataQuery.eq('status', statusFilter)
    }

    if (priorityFilter) {
      countQuery = countQuery.eq('priority', priorityFilter)
      dataQuery = dataQuery.eq('priority', priorityFilter)
    }

    if (searchQuery) {
      const searchPattern = `%${searchQuery}%`
      countQuery = countQuery.or(`subject.ilike.${searchPattern},ticket_number.ilike.${searchPattern}`)
      dataQuery = dataQuery.or(`subject.ilike.${searchPattern},ticket_number.ilike.${searchPattern}`)
    }

    // Get total count
    const { count } = await countQuery
    totalCount = count || 0

    // Get paginated data with sorting
    const from = (currentPage - 1) * ITEMS_PER_PAGE
    const to = from + ITEMS_PER_PAGE - 1

    const { data } = await dataQuery
      .order(sortColumn, { ascending: sortOrder === 'asc' })
      .range(from, to)

    tickets = (data || []) as unknown as TicketWithClient[]
  } catch {
    // Database might not exist yet
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">All Tickets</h1>
          <p className="text-slate-400 mt-1">Manage support tickets from all users</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchInput
          placeholder="Search tickets..."
          className="sm:w-64"
          theme="dark"
        />
        <FilterSelect
          paramName="status"
          options={statusOptions}
          placeholder="All Status"
          theme="dark"
        />
        <FilterSelect
          paramName="priority"
          options={priorityOptions}
          placeholder="All Priority"
          theme="dark"
        />
      </div>

      {tickets.length > 0 ? (
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-slate-700/50 border-b border-slate-700">
                <tr>
                  <SortableHeader column="ticket_number" label="Ticket" theme="dark" />
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wider">Client</th>
                  <SortableHeader column="subject" label="Subject" theme="dark" />
                  <SortableHeader column="status" label="Status" theme="dark" />
                  <SortableHeader column="priority" label="Priority" theme="dark" />
                  <SortableHeader column="created_at" label="Created" theme="dark" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/admin/tickets/${ticket.id}`} className="text-red-400 font-medium hover:text-red-300">
                        {ticket.ticket_number}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">
                          {ticket.client?.first_name} {ticket.client?.last_name}
                        </p>
                        <p className="text-sm text-slate-400">{ticket.client?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/tickets/${ticket.id}`} className="text-slate-200 hover:text-white">
                        {ticket.subject}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {formatStatus(ticket.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(ticket.created_at).toLocaleDateString()}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {searchQuery || statusFilter || priorityFilter ? 'No tickets match your filters' : 'No tickets yet'}
          </h3>
          <p className="text-slate-400">
            {searchQuery || statusFilter || priorityFilter
              ? 'Try adjusting your search or filters.'
              : 'Tickets from users will appear here.'}
          </p>
        </div>
      )}
    </div>
  )
}
