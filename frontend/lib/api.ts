import axios from 'axios';
import type {
  Skill,
  WorkExperience,
  Project,
  ContactMessage,
  SiteSettings,
  ApiResponse,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to convert relative image URLs to absolute URLs
const fixImageUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url; // Already absolute
  }
  return `${BASE_URL}${url}`; // Convert relative to absolute
};

// Helper to fix all image URLs in an object
const fixImageUrls = <T extends Record<string, any>>(obj: T): T => {
  const fixed = { ...obj } as any;
  if (fixed.image) fixed.image = fixImageUrl(fixed.image);
  if (fixed.icon) fixed.icon = fixImageUrl(fixed.icon);
  if (fixed.hero_image) fixed.hero_image = fixImageUrl(fixed.hero_image);
  if (fixed.resume_file) fixed.resume_file = fixImageUrl(fixed.resume_file);
  return fixed as T;
};

// API functions

/**
 * Get all active skills
 */
export const getSkills = async (): Promise<Skill[]> => {
  const response = await apiClient.get<Skill[]>('/skills/');
  return response.data.map(fixImageUrls);
};

/**
 * Get skills grouped by category
 */
export const getSkillsByCategory = async (): Promise<Record<string, Skill[]>> => {
  const response = await apiClient.get<Record<string, Skill[]>>('/skills/by_category/');
  const data = response.data;
  // Fix image URLs for each category
  const fixed: Record<string, Skill[]> = {};
  for (const [category, skills] of Object.entries(data)) {
    fixed[category] = skills.map(fixImageUrls);
  }
  return fixed;
};

/**
 * Get all work experience
 */
export const getWorkExperience = async (): Promise<WorkExperience[]> => {
  const response = await apiClient.get<WorkExperience[]>('/work-experience/');
  return response.data.map(fixImageUrls);
};

/**
 * Get all projects
 */
export const getProjects = async (): Promise<Project[]> => {
  const response = await apiClient.get<Project[]>('/projects/');
  return response.data.map(project => ({
    ...fixImageUrls(project),
    technologies: project.technologies?.map(fixImageUrls) || []
  }));
};

/**
 * Get featured projects only
 */
export const getFeaturedProjects = async (): Promise<Project[]> => {
  const response = await apiClient.get<Project[]>('/projects/featured/');
  return response.data.map(project => ({
    ...fixImageUrls(project),
    technologies: project.technologies?.map(fixImageUrls) || []
  }));
};

/**
 * Get single project by slug
 */
export const getProject = async (slug: string): Promise<Project> => {
  const response = await apiClient.get<Project>(`/projects/${slug}/`);
  const project = response.data;
  return {
    ...fixImageUrls(project),
    technologies: project.technologies?.map(fixImageUrls) || []
  };
};

/**
 * Submit contact form
 */
export const submitContactMessage = async (
  data: ContactMessage
): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>('/contact/', data);
  return response.data;
};

/**
 * Get site settings
 */
export const getSiteSettings = async (): Promise<SiteSettings> => {
  const response = await apiClient.get<SiteSettings>('/settings/');
  return fixImageUrls(response.data);
};

export default apiClient;
