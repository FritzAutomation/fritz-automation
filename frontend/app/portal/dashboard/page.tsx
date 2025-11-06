'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import PortalLayout from '@/components/PortalLayout';
import { getDashboardStats, getRecentActivity } from '@/lib/portalApi';
import type { DashboardStats, ProjectUpdate, Ticket } from '@/lib/portalApi';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<{ updates: ProjectUpdate[]; tickets: Ticket[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, activityData] = await Promise.all([
          getDashboardStats(),
          getRecentActivity(),
        ]);
        setStats(statsData);
        setActivity(activityData);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = stats ? [
    { title: 'Total Projects', value: stats.total_projects, icon: '📁', color: 'blue' },
    { title: 'Active Projects', value: stats.active_projects, icon: '⚡', color: 'green' },
    { title: 'Open Tickets', value: stats.open_tickets, icon: '🎫', color: 'yellow' },
    { title: 'Recent Updates', value: stats.recent_updates_count, icon: '📝', color: 'purple' },
  ] : [];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'discovery': 'bg-gray-100 text-gray-700',
      'planning': 'bg-blue-100 text-blue-700',
      'in_progress': 'bg-green-100 text-green-700',
      'testing': 'bg-yellow-100 text-yellow-700',
      'completed': 'bg-purple-100 text-purple-700',
      'on_hold': 'bg-orange-100 text-orange-700',
      'open': 'bg-blue-100 text-blue-700',
      'resolved': 'bg-green-100 text-green-700',
      'closed': 'bg-gray-100 text-gray-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <ProtectedRoute>
      <PortalLayout>
        <div className="space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome back! Here's an overview of your projects and activity.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600">Loading dashboard...</p>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                  <div
                    key={stat.title}
                    className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      </div>
                      <div className="text-4xl">{stat.icon}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Project Updates */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">Recent Updates</h2>
                      <Link
                        href="/portal/projects"
                        className="text-sm text-primary hover:text-primary-light font-medium"
                      >
                        View all →
                      </Link>
                    </div>
                  </div>
                  <div className="p-6">
                    {activity && activity.updates.length > 0 ? (
                      <div className="space-y-4">
                        {activity.updates.map((update) => (
                          <div key={update.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-2 h-2 mt-2 bg-primary rounded-full"></div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900">{update.title}</p>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{update.description}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {new Date(update.created_at).toLocaleDateString()} by {update.created_by?.username || 'Admin'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No recent updates</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Tickets */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">Recent Tickets</h2>
                      <Link
                        href="/portal/tickets"
                        className="text-sm text-primary hover:text-primary-light font-medium"
                      >
                        View all →
                      </Link>
                    </div>
                  </div>
                  <div className="p-6">
                    {activity && activity.tickets.length > 0 ? (
                      <div className="space-y-4">
                        {activity.tickets.map((ticket) => (
                          <Link
                            key={ticket.id}
                            href={`/portal/tickets/${ticket.id}`}
                            className="block pb-4 border-b border-gray-100 last:border-0 last:pb-0 hover:bg-gray-50 -mx-2 px-2 py-2 rounded transition-colors"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-mono text-gray-500">#{ticket.id}</span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(ticket.status)}`}>
                                    {ticket.status}
                                  </span>
                                </div>
                                <p className="font-semibold text-gray-900 truncate">{ticket.title}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(ticket.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No recent tickets</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-r from-primary to-primary-light rounded-xl shadow-lg p-6 sm:p-8 text-white">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Quick Actions</h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <Link
                    href="/portal/tickets/new"
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition-colors"
                  >
                    <div className="text-3xl mb-2">🎫</div>
                    <h3 className="font-semibold">Create Ticket</h3>
                    <p className="text-sm text-primary-lighter mt-1">Submit a bug report or feature request</p>
                  </Link>
                  <Link
                    href="/portal/projects"
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition-colors"
                  >
                    <div className="text-3xl mb-2">📁</div>
                    <h3 className="font-semibold">View Projects</h3>
                    <p className="text-sm text-primary-lighter mt-1">Check project status and progress</p>
                  </Link>
                  <Link
                    href="/portal/files"
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition-colors"
                  >
                    <div className="text-3xl mb-2">📎</div>
                    <h3 className="font-semibold">Access Files</h3>
                    <p className="text-sm text-primary-lighter mt-1">Download project files and documents</p>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </PortalLayout>
    </ProtectedRoute>
  );
}
