import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

interface ContactSubmission {
  id: string
  name: string
  email: string
  company: string | null
  phone: string | null
  subject: string | null
  message: string
  status: string
  created_at: string
}

export default async function AdminContactsPage() {
  const supabase = await createClient()

  let contacts: ContactSubmission[] = []

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    contacts = data || []
  } catch {
    // Database might not exist yet
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/20 text-blue-400'
      case 'read': return 'bg-slate-500/20 text-slate-400'
      case 'responded': return 'bg-green-500/20 text-green-400'
      case 'archived': return 'bg-slate-600/20 text-slate-500'
      default: return 'bg-slate-500/20 text-slate-400'
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Contact Submissions</h1>
          <p className="text-slate-400 mt-1">Manage inquiries from the contact form</p>
        </div>
      </div>

      {contacts.length > 0 ? (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700/50 border-b border-slate-700">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wider">Contact</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wider">Subject</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wider">Company</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wider">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/admin/contacts/${contact.id}`}>
                      <div>
                        <p className="text-white font-medium hover:text-red-400">{contact.name}</p>
                        <p className="text-sm text-slate-400">{contact.email}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/contacts/${contact.id}`} className="text-slate-200 hover:text-white">
                      {contact.subject || 'No subject'}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {contact.company || <span className="text-slate-500">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {new Date(contact.created_at).toLocaleDateString()}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No contact submissions yet</h3>
          <p className="text-slate-400">Contact form submissions will appear here.</p>
        </div>
      )}
    </div>
  )
}
