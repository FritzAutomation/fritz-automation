import { Metadata } from 'next'
import { NewTicketForm } from './NewTicketForm'

export const metadata: Metadata = {
  title: 'New Ticket',
  description: 'Create a new support ticket',
}

export default function NewTicketPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Create New Ticket</h1>
        <p className="text-slate-600 mt-1">Submit a support request and we&apos;ll get back to you shortly</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <NewTicketForm />
      </div>
    </div>
  )
}
