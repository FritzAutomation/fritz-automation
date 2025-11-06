'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import PortalLayout from '@/components/PortalLayout';
import { getTicket, addTicketComment } from '@/lib/portalApi';
import type { Ticket } from '@/lib/portalApi';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [params.id]);

  const fetchTicket = async () => {
    try {
      const data = await getTicket(Number(params.id));
      setTicket(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      await addTicketComment(Number(params.id), comment);
      setComment('');
      fetchTicket(); // Reload to get new comment
    } catch (err) {
      alert('Failed to add comment');
    } finally {
      setSubmitting(false);
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

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'low': 'text-gray-600',
      'medium': 'text-blue-600',
      'high': 'text-orange-600',
      'urgent': 'text-red-600',
    };
    return colors[priority] || 'text-gray-600';
  };

  return (
    <ProtectedRoute>
      <PortalLayout>
        <div className="space-y-6">
          {/* Back Button */}
          <Link
            href="/portal/tickets"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tickets
          </Link>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">{error}</div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : ticket ? (
            <>
              {/* Ticket Header */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-mono text-gray-500">#{ticket.id}</span>
                    <span className={`text-sm px-3 py-1 rounded-full font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>
                  <span className={`text-sm font-semibold ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority.toUpperCase()} PRIORITY
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">{ticket.title}</h1>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Type:</span>
                    <span className="capitalize">{ticket.ticket_type}</span>
                  </div>
                  {ticket.project_title && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Project:</span>
                      <span>{ticket.project_title}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Created:</span>
                    <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                  </div>
                  {ticket.resolved_at && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Resolved:</span>
                      <span>{new Date(ticket.resolved_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {ticket.description && (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
                  </div>
                )}
              </div>

              {/* Comments Section */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Comments</h2>

                {ticket.comments && ticket.comments.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {ticket.comments.map((comment) => (
                      <div key={comment.id} className="border-l-4 border-gray-200 pl-4 py-2">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">
                            {comment.user?.first_name || comment.user?.username || 'User'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.created_at).toLocaleString()}
                          </span>
                          {comment.is_internal && (
                            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                              Internal
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 mb-6">No comments yet. Be the first to comment!</p>
                )}

                {/* Add Comment Form */}
                {ticket.status !== 'closed' && (
                  <form onSubmit={handleSubmitComment} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Add a Comment</label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Share additional information or ask a question..."
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting || !comment.trim()}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Posting...' : 'Post Comment'}
                    </button>
                  </form>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
              <div className="text-6xl mb-4">❌</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ticket Not Found</h3>
              <p className="text-gray-600">The ticket you're looking for doesn't exist.</p>
            </div>
          )}
        </div>
      </PortalLayout>
    </ProtectedRoute>
  );
}
