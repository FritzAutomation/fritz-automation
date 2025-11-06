// API Response Types

export interface Skill {
  id: number;
  name: string;
  category: 'frontend' | 'backend' | 'tools' | 'other';
  icon?: string;
  proficiency: number;
  order: number;
  is_active: boolean;
}

export interface WorkExperience {
  id: number;
  company: string;
  position: string;
  location?: string;
  start_date: string;
  end_date?: string;
  description: string;
  image?: string;
  is_current: boolean;
  duration: string;
  order: number;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description?: string; // Only in detail view
  image: string;
  github_url?: string;
  live_url?: string;
  status: 'completed' | 'in_progress' | 'planned' | 'archived';
  technologies: Skill[];
  featured: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface SiteSettings {
  site_title: string;
  tagline: string;
  about_text: string;
  hero_image?: string;
  resume_file?: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  email: string;
  meta_description?: string;
  meta_keywords?: string;
}

export interface ApiResponse<T> {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
}
