export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

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
