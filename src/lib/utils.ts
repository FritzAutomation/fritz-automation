import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Status color utilities for tickets and contacts
export type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed'
export type ContactStatus = 'new' | 'read' | 'responded' | 'archived'
export type Priority = 'urgent' | 'high' | 'normal' | 'low'
export type UserRole = 'client' | 'admin' | 'superadmin'
export type Theme = 'light' | 'dark'

// Dark theme colors (for admin panel)
const darkStatusColors: Record<string, string> = {
  // Ticket statuses
  open: 'bg-blue-500/20 text-blue-400',
  in_progress: 'bg-yellow-500/20 text-yellow-400',
  waiting: 'bg-purple-500/20 text-purple-400',
  resolved: 'bg-green-500/20 text-green-400',
  closed: 'bg-slate-500/20 text-slate-400',
  // Contact statuses
  new: 'bg-blue-500/20 text-blue-400',
  read: 'bg-slate-500/20 text-slate-400',
  responded: 'bg-green-500/20 text-green-400',
  archived: 'bg-slate-600/20 text-slate-500',
}

// Light theme colors (for client portal)
const lightStatusColors: Record<string, string> = {
  // Ticket statuses
  open: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  waiting: 'bg-purple-100 text-purple-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-slate-100 text-slate-700',
  // Contact statuses
  new: 'bg-blue-100 text-blue-700',
  read: 'bg-slate-100 text-slate-700',
  responded: 'bg-green-100 text-green-700',
  archived: 'bg-slate-100 text-slate-600',
}

const darkPriorityColors: Record<string, string> = {
  urgent: 'bg-red-500/20 text-red-400',
  high: 'bg-orange-500/20 text-orange-400',
  normal: 'bg-slate-500/20 text-slate-400',
  low: 'bg-slate-600/20 text-slate-500',
}

const lightPriorityColors: Record<string, string> = {
  urgent: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  normal: 'bg-slate-100 text-slate-700',
  low: 'bg-slate-50 text-slate-500',
}

const roleColors: Record<string, string> = {
  superadmin: 'bg-red-500/20 text-red-400',
  admin: 'bg-orange-500/20 text-orange-400',
  client: 'bg-blue-500/20 text-blue-400',
}

export function getStatusColor(status: string, theme: Theme = 'dark'): string {
  const colors = theme === 'dark' ? darkStatusColors : lightStatusColors
  const defaultColor = theme === 'dark' ? 'bg-slate-500/20 text-slate-400' : 'bg-slate-100 text-slate-700'
  return colors[status] || defaultColor
}

export function getPriorityColor(priority: string, theme: Theme = 'dark'): string {
  const colors = theme === 'dark' ? darkPriorityColors : lightPriorityColors
  const defaultColor = theme === 'dark' ? 'bg-slate-500/20 text-slate-400' : 'bg-slate-100 text-slate-700'
  return colors[priority] || defaultColor
}

export function getRoleColor(role: string): string {
  return roleColors[role] || 'bg-slate-500/20 text-slate-400'
}

export function formatStatus(status: string): string {
  return status.replace(/_/g, ' ')
}
