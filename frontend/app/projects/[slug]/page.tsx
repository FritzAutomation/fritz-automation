import { getProject, getProjects } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import OptimizedImage from '@/components/OptimizedImage';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all projects
export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    return projects.map((project) => ({
      slug: project.slug,
    }));
  } catch (error) {
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const project = await getProject(slug);

    return {
      title: `${project.title} - Fritz Automation | Joshua Fritzjunker`,
      description: project.short_description || project.description?.substring(0, 160),
      keywords: `${project.title}, ${project.technologies?.map((t: any) => t.name).join(', ')}, Joshua Fritzjunker, Fritz Automation, Showcase Project`,
      authors: [{ name: 'Joshua Fritzjunker' }],
      openGraph: {
        title: `${project.title} - Fritz Automation`,
        description: project.short_description || project.description?.substring(0, 160),
        url: `https://www.fritzautomation.dev/projects/${project.slug}`,
        siteName: 'Fritz Automation',
        images: project.image ? [
          {
            url: project.image,
            width: 1200,
            height: 630,
            alt: project.title,
          }
        ] : [],
        locale: 'en_US',
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${project.title} - Fritz Automation`,
        description: project.short_description || project.description?.substring(0, 160),
        images: project.image ? [project.image] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Project Not Found - Fritz Automation',
      description: 'The requested project could not be found.',
    };
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let project;

  try {
    project = await getProject(slug);
  } catch (error) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                FA
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                Fritz Automation
              </span>
            </Link>
            <Link
              href="/#projects"
              className="px-6 py-2 text-gray-700 hover:text-primary transition-colors font-medium"
            >
              ← Back to Projects
            </Link>
          </nav>
        </div>
      </header>

      {/* Project Content */}
      <article className="py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 fade-in">
            <div className="flex items-center gap-4 mb-4">
              <span className="px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold">
                🚀 Project Details
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                project.status === 'completed'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {project.status === 'completed' ? 'Completed' : 'In Progress'}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="gradient-text">{project.title}</span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              {project.short_description}
            </p>
          </div>

          {/* Project Image */}
          {project.image && (
            <div className="mb-12 fade-in">
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
                <OptimizedImage
                  src={project.image}
                  alt={project.title}
                  fill
                  priority
                  objectFit="cover"
                />
              </div>
            </div>
          )}

          {/* Quick Info */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 fade-in">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-6 bg-white rounded-2xl border-2 border-gray-100 hover:border-primary hover:shadow-lg transition-all group"
              >
                <div className="p-3 bg-gray-100 group-hover:bg-primary/10 rounded-xl transition-colors">
                  <svg className="w-6 h-6 group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold group-hover:text-primary transition-colors">View Code</div>
                  <div className="text-sm text-gray-500">GitHub Repository</div>
                </div>
              </a>
            )}

            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-6 bg-white rounded-2xl border-2 border-gray-100 hover:border-primary hover:shadow-lg transition-all group"
              >
                <div className="p-3 bg-gray-100 group-hover:bg-primary/10 rounded-xl transition-colors">
                  <svg className="w-6 h-6 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold group-hover:text-primary transition-colors">Live Demo</div>
                  <div className="text-sm text-gray-500">View Project</div>
                </div>
              </a>
            )}

            <div className="flex items-center gap-3 p-6 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl border-2 border-primary/10">
              <div className="p-3 bg-primary/10 rounded-xl">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold">Completed</div>
                <div className="text-sm text-gray-500">
                  {project.created_at ? new Date(project.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Date not available'}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-12 fade-in">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100">
              <h2 className="text-3xl font-bold mb-6">About This Project</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>
            </div>
          </div>

          {/* Technologies Used */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-12 fade-in">
              <div className="bg-gradient-to-br from-primary/5 to-transparent rounded-3xl p-8 md:p-12 border border-primary/10">
                <h2 className="text-3xl font-bold mb-8">Technologies Used</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {project.technologies.map((tech) => (
                    <div
                      key={tech.id}
                      className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    >
                      {tech.icon && (
                        <OptimizedImage src={tech.icon} alt={tech.name} width={32} height={32} objectFit="contain" />
                      )}
                      <div>
                        <div className="font-semibold text-gray-800">{tech.name}</div>
                        {tech.proficiency && (
                          <div className="text-xs text-gray-500">{tech.proficiency}%</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="text-center fade-in">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to All Projects
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
