'use client';

import { useEffect, useState } from 'react';
import { getFeaturedProjects } from '@/lib/api';

export default function DebugData() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getFeaturedProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="min-h-screen p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Debug: API Data</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Projects Data</h2>
        <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto max-h-96 text-xs">
          {JSON.stringify(projects, null, 2)}
        </pre>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Image URLs</h2>
        {projects.map((project: any, index: number) => (
          <div key={project.id} className="mb-4 pb-4 border-b">
            <p className="font-bold">{index + 1}. {project.title}</p>
            <p className="text-sm text-gray-600">Image: {project.image || 'NO IMAGE'}</p>
            {project.image && (
              <div className="mt-2">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-32 h-32 object-cover border-2 border-gray-300"
                  onError={(e) => {
                    console.error('Failed to load:', project.image);
                    (e.target as HTMLImageElement).style.border = '3px solid red';
                  }}
                  onLoad={() => console.log('Loaded:', project.image)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
