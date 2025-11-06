'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import PortalLayout from '@/components/PortalLayout';
import { getProjects } from '@/lib/portalApi';
import type { Project } from '@/lib/portalApi';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'discovery': 'bg-gray-100 text-gray-700',
      'planning': 'bg-blue-100 text-blue-700',
      'in_progress': 'bg-green-100 text-green-700',
      'testing': 'bg-yellow-100 text-yellow-700',
      'completed': 'bg-purple-100 text-purple-700',
      'on_hold': 'bg-orange-100 text-orange-700',
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="mt-2 text-gray-600">View and track all your projects</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">{error}</div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Projects Yet</h3>
              <p className="text-gray-600">Your projects will appear here once they're created.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/portal/projects/${project.id}`}
                  className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(project.status)}`}>
                          {project.status.replace('_', ' ')}
                        </span>
                        <span className={`text-xs font-semibold ${getPriorityColor(project.priority)}`}>
                          {project.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-gray-900">{project.progress_percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full transition-all"
                        style={{ width: `${project.progress_percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      {project.open_tickets_count !== undefined && (
                        <span className="flex items-center gap-1">
                          🎫 {project.open_tickets_count} open
                        </span>
                      )}
                      {project.files_count !== undefined && (
                        <span className="flex items-center gap-1">
                          📎 {project.files_count} files
                        </span>
                      )}
                    </div>
                    {project.estimated_completion && (
                      <span className="text-xs">Due: {new Date(project.estimated_completion).toLocaleDateString()}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </PortalLayout>
    </ProtectedRoute>
  );
}
