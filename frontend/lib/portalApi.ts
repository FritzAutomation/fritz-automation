// API functions for client portal

import { authenticatedFetch } from './auth';

// Types
export interface DashboardStats {
  total_projects: number;
  active_projects: number;
  open_tickets: number;
  recent_updates_count: number;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description?: string;
  status: string;
  priority: string;
  client: any;
  progress_percentage: number;
  start_date: string | null;
  estimated_completion: string | null;
  actual_completion: string | null;
  deliverables?: string;
  staging_url?: string;
  production_url?: string;
  repository_url?: string;
  open_tickets_count?: number;
  files_count?: number;
  created_at: string;
  last_activity: string;
  updates?: ProjectUpdate[];
  tickets?: Ticket[];
  files?: ProjectFile[];
  milestones?: ProjectMilestone[];
}

export interface ProjectUpdate {
  id: number;
  project: number;
  title: string;
  description: string;
  created_by: any;
  created_at: string;
}

export interface ProjectMilestone {
  id: number;
  project: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  target_date: string;
  completed_date: string | null;
  order: number;
  is_overdue: boolean;
  created_at: string;
  updated_at: string;
}

export interface Ticket {
  id: number;
  project: number | null;
  project_title?: string;
  title: string;
  description?: string;
  ticket_type: string;
  status: string;
  priority: string;
  created_by: any;
  assigned_to: any;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  comment_count?: number;
  comments?: TicketComment[];
}

export interface TicketComment {
  id: number;
  ticket: number;
  user: any;
  comment: string;
  is_internal: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectFile {
  id: number;
  project: number;
  name: string;
  description: string;
  file: string;
  file_url: string;
  category: string;
  file_size: number;
  file_size_display: string;
  is_confidential: boolean;
  uploaded_by: any;
  created_at: string;
  updated_at: string;
}

// Dashboard
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await authenticatedFetch('/portal/dashboard/stats/');
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }
  return response.json();
};

export const getRecentActivity = async (): Promise<{ updates: ProjectUpdate[]; tickets: Ticket[] }> => {
  const response = await authenticatedFetch('/portal/dashboard/activity/');
  if (!response.ok) {
    throw new Error('Failed to fetch recent activity');
  }
  const data = await response.json();

  // Ensure updates and tickets are arrays
  return {
    updates: Array.isArray(data.updates) ? data.updates : [],
    tickets: Array.isArray(data.tickets) ? data.tickets : [],
  };
};

// Projects
export const getProjects = async (): Promise<Project[]> => {
  const response = await authenticatedFetch('/portal/projects/');
  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.status}`);
  }
  const data = await response.json();

  // Handle paginated response
  if (data && typeof data === 'object' && 'results' in data) {
    return data.results;
  }

  // Handle direct array response
  if (Array.isArray(data)) {
    return data;
  }

  return [];
};

export const getProject = async (id: number): Promise<Project> => {
  const response = await authenticatedFetch(`/portal/projects/${id}/`);
  if (!response.ok) {
    throw new Error('Failed to fetch project');
  }
  return response.json();
};

// Tickets
export const getTickets = async (filters?: { project?: number; status?: string }): Promise<Ticket[]> => {
  let url = '/portal/tickets/';
  const params = new URLSearchParams();

  if (filters?.project) {
    params.append('project', filters.project.toString());
  }
  if (filters?.status) {
    params.append('status', filters.status);
  }

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await authenticatedFetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch tickets');
  }
  const data = await response.json();

  // Handle paginated response
  if (data && typeof data === 'object' && 'results' in data) {
    return data.results;
  }

  // Handle direct array response
  if (Array.isArray(data)) {
    return data;
  }

  return [];
};

export const getTicket = async (id: number): Promise<Ticket> => {
  const response = await authenticatedFetch(`/portal/tickets/${id}/`);
  if (!response.ok) {
    throw new Error('Failed to fetch ticket');
  }
  return response.json();
};

export const createTicket = async (data: {
  project?: number;
  title: string;
  description: string;
  ticket_type: string;
  priority: string;
}): Promise<Ticket> => {
  const response = await authenticatedFetch('/portal/tickets/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create ticket');
  }
  return response.json();
};

export const addTicketComment = async (ticketId: number, comment: string): Promise<TicketComment> => {
  const response = await authenticatedFetch(`/portal/tickets/${ticketId}/add_comment/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ comment }),
  });

  if (!response.ok) {
    throw new Error('Failed to add comment');
  }
  return response.json();
};

// Files
export const getProjectFiles = async (projectId?: number): Promise<ProjectFile[]> => {
  let url = '/portal/files/';
  if (projectId) {
    url += `?project=${projectId}`;
  }

  const response = await authenticatedFetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch files');
  }
  const data = await response.json();

  // Handle paginated response
  if (data && typeof data === 'object' && 'results' in data) {
    return data.results;
  }

  // Handle direct array response
  if (Array.isArray(data)) {
    return data;
  }

  return [];
};

export const uploadFile = async (
  project: number,
  name: string,
  description: string,
  category: string,
  is_confidential: boolean,
  file: File
): Promise<ProjectFile> => {
  const formData = new FormData();
  formData.append('project', project.toString());
  formData.append('name', name);
  formData.append('description', description);
  formData.append('category', category);
  formData.append('is_confidential', is_confidential.toString());
  formData.append('file', file);

  const response = await authenticatedFetch('/portal/files/', {
    method: 'POST',
    body: formData, // Don't set Content-Type, let browser set it with boundary
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw { response: { data: errorData }, message: 'Failed to upload file' };
  }
  return response.json();
};

export const deleteFile = async (id: number): Promise<void> => {
  const response = await authenticatedFetch(`/portal/files/${id}/`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete file');
  }
};

// Email Preferences
export interface EmailPreferences {
  id: number;
  project_updates: boolean;
  ticket_comments: boolean;
  ticket_status_changes: boolean;
  new_files: boolean;
  weekly_summary: boolean;
  updated_at: string;
}

export const getEmailPreferences = async (): Promise<EmailPreferences> => {
  const response = await authenticatedFetch('/portal/email-preferences/');
  if (!response.ok) {
    throw new Error('Failed to fetch email preferences');
  }
  return response.json();
};

export const updateEmailPreferences = async (preferences: Partial<EmailPreferences>): Promise<EmailPreferences> => {
  // Get current preferences first to get the ID
  const current = await getEmailPreferences();

  const response = await authenticatedFetch(`/portal/email-preferences/${current.id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preferences),
  });

  if (!response.ok) {
    throw new Error('Failed to update email preferences');
  }
  return response.json();
};
