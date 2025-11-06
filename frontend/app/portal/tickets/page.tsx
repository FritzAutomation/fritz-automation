'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import PortalLayout from '@/components/PortalLayout';
import { getTickets, createTicket, getProjects } from '@/lib/portalApi';
import type { Ticket, Project } from '@/lib/portalApi';

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ticket_type: 'support',
    priority: 'medium',
    project: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ticketsData, projectsData] = await Promise.all([getTickets(), getProjects()]);
      setTickets(ticketsData);
      setProjects(projectsData);
    } catch (err) {
      setError('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTicket({
        ...formData,
        project: formData.project ? Number(formData.project) : undefined,
      });
      setShowCreateForm(false);
      setFormData({ title: '', description: '', ticket_type: 'support', priority: 'medium', project: '' });
      fetchData();
    } catch (err) {
      alert('Failed to create ticket');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'open': 'bg-blue-100 text-blue-700',
      'in_progress': 'bg-yellow-100 text-yellow-700',
      'waiting_client': 'bg-orange-100 text-orange-700',
      'resolved': 'bg-green-100 text-green-700',
      'closed': 'bg-gray-100 text-gray-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <ProtectedRoute>
      <PortalLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
              <p className="mt-2 text-gray-600">Manage your support requests and issues</p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              {showCreateForm ? 'Cancel' : '+ New Ticket'}
            </button>
          </div>

          {/* Create Ticket Form */}
          {showCreateForm && (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Create New Ticket</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-900 mb-2">Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Brief description of the issue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Type</label>
                    <select
                      value={formData.ticket_type}
                      onChange={(e) => setFormData({ ...formData, ticket_type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                    >
                      <option value="bug">Bug Report</option>
                      <option value="feature">Feature Request</option>
                      <option value="support">Support</option>
                      <option value="question">Question</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-900 mb-2">Project (Optional)</label>
                    <select
                      value={formData.project}
                      onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                    >
                      <option value="">No specific project</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-900 mb-2">Description *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Provide detailed information about your request"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-semibold"
                >
                  Submit Ticket
                </button>
              </form>
            </div>
          )}

          {/* Tickets List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
              <div className="text-6xl mb-4">🎫</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tickets Yet</h3>
              <p className="text-gray-600">Create your first support ticket to get started.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <Link
                    key={ticket.id}
                    href={`/portal/tickets/${ticket.id}`}
                    className="block p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-mono text-gray-500">#{ticket.id}</span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(ticket.status)}`}>
                            {ticket.status.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-gray-500">{ticket.ticket_type}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{ticket.title}</h3>
                        {ticket.project_title && (
                          <p className="text-sm text-gray-600">Project: {ticket.project_title}</p>
                        )}
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>{new Date(ticket.created_at).toLocaleDateString()}</p>
                        {ticket.comment_count !== undefined && (
                          <p className="mt-1">💬 {ticket.comment_count} comments</p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </PortalLayout>
    </ProtectedRoute>
  );
}
