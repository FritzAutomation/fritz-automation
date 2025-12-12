import { createClient } from '@/lib/supabase/server'
import { getStatusColor } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ContactStatusForm } from './ContactStatusForm'

interface ContactSubmission {
  id: string
  name: string
  email: string
  company: string | null
  phone: string | null
  subject: string | null
  message: string
  status: string
  admin_notes: string | null
  created_at: string
  responded_at: string | null
}

export default async function AdminContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  let contact: ContactSubmission | null = null

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from('contact_submissions')
      .select('*')
      .eq('id', id)
      .single()

    contact = data
  } catch {
    // Database might not exist yet
  }

  if (!contact) {
    notFound()
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/contacts" className="text-sm text-slate-400 hover:text-white flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Contacts
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main content */}
        <div className="col-span-2">
          <div className="bg-slate-800 rounded-xl border border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-white">{contact.name}</h1>
                  <a href={`mailto:${contact.email}`} className="text-red-400 hover:text-red-300">
                    {contact.email}
                  </a>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(contact.status)}`}>
                  {contact.status}
                </span>
              </div>
            </div>

            <div className="p-6 border-b border-slate-700">
              <h2 className="text-sm font-semibold text-slate-400 mb-2">Subject</h2>
              <p className="text-white text-lg">{contact.subject || 'No subject'}</p>
            </div>

            <div className="p-6 border-b border-slate-700">
              <h2 className="text-sm font-semibold text-slate-400 mb-2">Message</h2>
              <p className="text-slate-200 whitespace-pre-wrap">{contact.message}</p>
            </div>

            <div className="p-6 bg-slate-700/30 grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Company</p>
                <p className="font-medium text-white">{contact.company || '—'}</p>
              </div>
              <div>
                <p className="text-slate-400">Phone</p>
                {contact.phone ? (
                  <a href={`tel:${contact.phone}`} className="font-medium text-red-400 hover:text-red-300">
                    {contact.phone}
                  </a>
                ) : (
                  <p className="font-medium text-white">—</p>
                )}
              </div>
              <div>
                <p className="text-slate-400">Received</p>
                <p className="font-medium text-white">{new Date(contact.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ContactStatusForm
            contactId={contact.id}
            currentStatus={contact.status}
            currentNotes={contact.admin_notes}
          />

          {/* Quick Actions */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <a
                href={`mailto:${contact.email}?subject=Re: ${contact.subject || 'Your inquiry'}`}
                className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors text-sm font-medium justify-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Email Reply
              </a>
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors text-sm font-medium justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call {contact.name.split(' ')[0]}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
