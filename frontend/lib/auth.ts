// Authentication utilities for client portal

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ClientProfile {
  id: number;
  user: User;
  company_name: string;
  phone: string;
  address: string;
  avatar: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Store token in localStorage
export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
};

// Get token from localStorage
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

// Remove token from localStorage
export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

// Store user in localStorage
export const setUser = (user: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

// Get user from localStorage
export const getUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

// Remove user from localStorage
export const removeUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Login
export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/portal/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  const data: AuthResponse = await response.json();
  setAuthToken(data.token);
  setUser(data.user);
  return data;
};

// Register
export const register = async (data: {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  phone?: string;
}): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/portal/auth/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  }

  const result: AuthResponse = await response.json();
  setAuthToken(result.token);
  setUser(result.user);
  return result;
};

// Logout
export const logout = async (): Promise<void> => {
  const token = getAuthToken();

  if (token) {
    try {
      await fetch(`${API_URL}/portal/auth/logout/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
    } catch (e) {
      // Continue even if API call fails
    }
  }

  removeAuthToken();
  removeUser();
};

// API fetch wrapper with auth token
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();

  if (!token) {
    // No token available, redirect to login
    removeAuthToken();
    removeUser();
    if (typeof window !== 'undefined') {
      window.location.href = '/portal/login';
    }
    throw new Error('Not authenticated');
  }

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
    'Authorization': `Token ${token}`,
  };

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    // Token expired or invalid, logout
    removeAuthToken();
    removeUser();
    if (typeof window !== 'undefined') {
      window.location.href = '/portal/login';
    }
    throw new Error('Unauthorized');
  }

  return response;
};
