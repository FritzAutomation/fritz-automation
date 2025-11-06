'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import PortalLayout from '@/components/PortalLayout';
import { getProject } from '@/lib/portalApi';
import type { Project } from '@/lib/portalApi';

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProject(Number(params.id));
        setProject(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  if (loading) {
    return (
      <ProtectedRoute>
        <PortalLayout>
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </PortalLayout>
      </ProtectedRoute>
    );
  }

  if (error || !project) {
    return (
      <ProtectedRoute>
        <PortalLayout>
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">{error || 'Project not found'}</div>
        </PortalLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <PortalLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/portal/projects" className="text-sm text-primary hover:text-primary-light mb-2 inline-block">
                ← Back to Projects
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
              {/* Project Info */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Project Details</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{project.description}</p>

                {project.deliverables && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold mb-2 text-gray-900">Deliverables:</h3>
                    <p className="text-gray-700 whitespace-pre-line">{project.deliverables}</p>
                  </div>
                )}
              </div>

              {/* Milestones Timeline */}
              {project.milestones && project.milestones.length > 0 && (
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">Project Timeline</h2>
                  <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                    <div className="space-y-6">
                      {project.milestones.map((milestone, index) => {
                        const getStatusColor = () => {
                          if (milestone.status === 'completed') return 'bg-green-500';
                          if (milestone.status === 'in_progress') return 'bg-blue-500';
                          if (milestone.status === 'delayed' || milestone.is_overdue) return 'bg-red-500';
                          return 'bg-gray-400';
                        };

                        const getBorderColor = () => {
                          if (milestone.status === 'completed') return '#22c55e';
                          if (milestone.status === 'in_progress') return '#3b82f6';
                          if (milestone.status === 'delayed' || milestone.is_overdue) return '#ef4444';
                          return '#9ca3af';
                        };

                        return (
                          <div key={milestone.id} className="relative pl-12">
                            {/* Status dot */}
                            <div className={`absolute left-2 w-5 h-5 rounded-full ${getStatusColor()} border-4 border-white flex items-center justify-center text-white text-xs font-bold`}>
                              {milestone.status === 'completed' && <span>✓</span>}
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 border-l-4" style={{ borderLeftColor: getBorderColor() }}>
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-gray-900">{milestone.title}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  milestone.status === 'completed' ? 'bg-green-100 text-green-700' :
                                  milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                  milestone.status === 'delayed' || milestone.is_overdue ? 'bg-red-100 text-red-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {milestone.status.replace('_', ' ').toUpperCase()}
                                </span>
                              </div>

                              {milestone.description && (
                                <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>
                              )}

                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <span>Target:</span>
                                  <span className="font-medium">{new Date(milestone.target_date).toLocaleDateString()}</span>
                                </div>
                                {milestone.completed_date && (
                                  <div className="flex items-center gap-1">
                                    <span>Completed:</span>
                                    <span className="font-medium">{new Date(milestone.completed_date).toLocaleDateString()}</span>
                                  </div>
                                )}
                                {milestone.is_overdue && milestone.status !== 'completed' && (
                                  <span className="text-red-600 font-semibold">⚠ Overdue</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Updates */}
              {project.updates && project.updates.length > 0 && (
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">Project Updates</h2>
                  <div className="space-y-4">
                    {project.updates.map((update) => (
                      <div key={update.id} className="pb-4 border-b border-gray-100 last:border-0">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-2 h-2 mt-2 bg-primary rounded-full"></div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{update.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{update.description}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(update.created_at).toLocaleDateString()} by {update.created_by?.username || 'Admin'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tickets */}
              {project.tickets && project.tickets.length > 0 && (
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">Related Tickets</h2>
                  <div className="space-y-3">
                    {project.tickets.map((ticket) => (
                      <Link
                        key={ticket.id}
                        href={`/portal/tickets/${ticket.id}`}
                        className="block p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono text-gray-500">#{ticket.id}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                ticket.status === 'open' ? 'bg-blue-100 text-blue-700' :
                                ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                                ticket.status === 'resolved' ? 'bg-green-100 text-green-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {ticket.status.replace('_', ' ')}
                              </span>
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm truncate">{ticket.title}</h3>
                            <p className="text-xs text-gray-500 mt-1 capitalize">{ticket.ticket_type}</p>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Files */}
              {project.files && project.files.length > 0 && (
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">Project Files</h2>
                  <div className="space-y-3">
                    {project.files.map((file) => (
                      <a
                        key={file.id}
                        href={file.file_url}
                        download
                        className="block p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 text-2xl">
                            {file.category === 'document' ? '📄' :
                             file.category === 'image' ? '🖼️' :
                             file.category === 'code' ? '💻' :
                             file.category === 'design' ? '🎨' :
                             file.category === 'report' ? '📊' :
                             file.category === 'credential' ? '🔐' :
                             '📎'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900 text-sm truncate">{file.name}</h3>
                              {file.is_confidential && (
                                <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">
                                  Confidential
                                </span>
                              )}
                            </div>
                            {file.description && (
                              <p className="text-xs text-gray-600 mt-1">{file.description}</p>
                            )}
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-gray-500">{file.file_size_display}</span>
                              <span className="text-xs text-gray-500 capitalize">{file.category}</span>
                            </div>
                          </div>
                          <div className="flex-shrink-0 text-primary">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6 order-1 lg:order-2">
              {/* Status Card */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h3 className="font-semibold mb-4 text-gray-900">Status</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Status:</span>
                    <p className="font-semibold text-gray-900 capitalize">{project.status.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Priority:</span>
                    <p className="font-semibold text-gray-900 capitalize">{project.priority}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Progress:</span>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold text-gray-900">{project.progress_percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full"
                          style={{ width: `${project.progress_percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h3 className="font-semibold mb-4 text-gray-900">Quick Links</h3>
                <div className="space-y-2">
                  {project.staging_url && (
                    <a
                      href={project.staging_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-primary hover:text-primary-light"
                    >
                      🔗 Staging URL →
                    </a>
                  )}
                  {project.production_url && (
                    <a
                      href={project.production_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-primary hover:text-primary-light"
                    >
                      🚀 Production URL →
                    </a>
                  )}
                  {project.repository_url && (
                    <a
                      href={project.repository_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-primary hover:text-primary-light"
                    >
                      📦 Repository →
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PortalLayout>
    </ProtectedRoute>
  );
}
