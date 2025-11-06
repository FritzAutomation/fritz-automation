import { MetadataRoute } from 'next';
import { getProjects } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.fritzautomation.dev';

  // Fetch all projects for dynamic routes
  let projects = [];
  try {
    projects = await getProjects();
  } catch (error) {
    // Silently handle error - sitemap will exclude projects
  }

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ];

  // Dynamic project routes
  const projectRoutes = projects.map((project: any) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.updated_at || project.created_at || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
