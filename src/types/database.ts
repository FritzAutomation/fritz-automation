export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Helper types for common table rows
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Ticket = Database['public']['Tables']['tickets']['Row']
export type TicketMessage = Database['public']['Tables']['ticket_messages']['Row']
export type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row']
export type FileRecord = Database['public']['Tables']['files']['Row']

// Types for joined queries
export type TicketWithClient = Ticket & {
  client: Pick<Profile, 'id' | 'first_name' | 'last_name' | 'email' | 'company_name' | 'phone'> | null
}

export type TicketMessageWithSender = TicketMessage & {
  sender: Pick<Profile, 'first_name' | 'last_name' | 'role'> | null
}

export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdatePatch = Database['public']['Tables']['projects']['Update']
export type ProjectStatus = Project['status']

export type ProjectUpdateRow = Database['public']['Tables']['project_updates']['Row']
export type ProjectUpdateInsert = Database['public']['Tables']['project_updates']['Insert']

export type ProjectWithClient = Project & {
  client: Pick<Profile, 'id' | 'first_name' | 'last_name' | 'email' | 'company_name'> | null
}

export type ProjectUpdateWithAuthor = ProjectUpdateRow & {
  author: Pick<Profile, 'id' | 'first_name' | 'last_name' | 'role'> | null
}

// Ticket joined with parent project (for portal list views)
export type TicketWithProject = Ticket & {
  project: Pick<Project, 'id' | 'title' | 'status'> | null
}

// Ticket with both client and project (for admin views)
export type TicketWithClientAndProject = Ticket & {
  client: Pick<Profile, 'id' | 'first_name' | 'last_name' | 'email' | 'company_name' | 'phone'> | null
  project: Pick<Project, 'id' | 'title' | 'status'> | null
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          first_name: string | null
          last_name: string | null
          role: 'client' | 'admin' | 'superadmin'
          company_name: string | null
          phone: string | null
          industry: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          role?: 'client' | 'admin' | 'superadmin'
          company_name?: string | null
          phone?: string | null
          industry?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          role?: 'client' | 'admin' | 'superadmin'
          company_name?: string | null
          phone?: string | null
          industry?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          icon: string | null
          features: Json
          technologies: Json
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          icon?: string | null
          features?: Json
          technologies?: Json
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          icon?: string | null
          features?: Json
          technologies?: Json
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      industries: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          icon: string | null
          display_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          icon?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          icon?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
        }
      }
      testimonials: {
        Row: {
          id: string
          client_name: string
          company: string | null
          role: string | null
          content: string
          rating: number | null
          is_featured: boolean
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          client_name: string
          company?: string | null
          role?: string | null
          content: string
          rating?: number | null
          is_featured?: boolean
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          client_name?: string
          company?: string | null
          role?: string | null
          content?: string
          rating?: number | null
          is_featured?: boolean
          is_active?: boolean
          created_at?: string
        }
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          company: string | null
          phone: string | null
          subject: string | null
          message: string
          source: string
          status: 'new' | 'read' | 'responded' | 'archived'
          admin_notes: string | null
          created_at: string
          responded_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          company?: string | null
          phone?: string | null
          subject?: string | null
          message: string
          source?: string
          status?: 'new' | 'read' | 'responded' | 'archived'
          admin_notes?: string | null
          created_at?: string
          responded_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          company?: string | null
          phone?: string | null
          subject?: string | null
          message?: string
          source?: string
          status?: 'new' | 'read' | 'responded' | 'archived'
          admin_notes?: string | null
          created_at?: string
          responded_at?: string | null
        }
      }
      tickets: {
        Row: {
          id: string
          ticket_number: string
          client_id: string
          project_id: string
          subject: string
          description: string | null
          status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed'
          priority: 'low' | 'normal' | 'high' | 'urgent'
          category: string | null
          assigned_to: string | null
          created_at: string
          updated_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          ticket_number?: string
          client_id: string
          project_id: string
          subject: string
          description?: string | null
          status?: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed'
          priority?: 'low' | 'normal' | 'high' | 'urgent'
          category?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          ticket_number?: string
          client_id?: string
          project_id?: string
          subject?: string
          description?: string | null
          status?: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed'
          priority?: 'low' | 'normal' | 'high' | 'urgent'
          category?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
      }
      ticket_messages: {
        Row: {
          id: string
          ticket_id: string
          sender_id: string
          content: string
          is_internal: boolean
          created_at: string
        }
        Insert: {
          id?: string
          ticket_id: string
          sender_id: string
          content: string
          is_internal?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          ticket_id?: string
          sender_id?: string
          content?: string
          is_internal?: boolean
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          client_id: string
          title: string
          description: string | null
          status: 'proposed' | 'approved' | 'in_progress' | 'in_review' | 'on_hold' | 'completed'
          start_date: string | null
          target_date: string | null
          wave_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          title: string
          description?: string | null
          status?: 'proposed' | 'approved' | 'in_progress' | 'in_review' | 'on_hold' | 'completed'
          start_date?: string | null
          target_date?: string | null
          wave_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          title?: string
          description?: string | null
          status?: 'proposed' | 'approved' | 'in_progress' | 'in_review' | 'on_hold' | 'completed'
          start_date?: string | null
          target_date?: string | null
          wave_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      project_updates: {
        Row: {
          id: string
          project_id: string
          author_id: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          author_id: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          author_id?: string
          message?: string
          created_at?: string
        }
      }
      files: {
        Row: {
          id: string
          uploaded_by: string
          ticket_id: string | null
          filename: string
          original_filename: string
          storage_path: string
          file_size: number | null
          mime_type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          uploaded_by: string
          ticket_id?: string | null
          filename: string
          original_filename: string
          storage_path: string
          file_size?: number | null
          mime_type?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          uploaded_by?: string
          ticket_id?: string | null
          filename?: string
          original_filename?: string
          storage_path?: string
          file_size?: number | null
          mime_type?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
