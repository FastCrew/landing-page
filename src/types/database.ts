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
          email: string
          role: 'worker' | 'business' | 'admin'
          name: string | null
          phone: string | null
          city: string | null
          skills: Json | null
          company_name: string | null
          company_vat: string | null
          business_requested: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role: 'worker' | 'business' | 'admin'
          name?: string | null
          phone?: string | null
          city?: string | null
          skills?: Json | null
          company_name?: string | null
          company_vat?: string | null
          business_requested?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'worker' | 'business' | 'admin'
          name?: string | null
          phone?: string | null
          city?: string | null
          skills?: Json | null
          company_name?: string | null
          company_vat?: string | null
          business_requested?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          created_by: string
          title: string
          description: string
          location: string
          hourly_rate: string
          shift_start: string
          shift_end: string
          status: 'open' | 'closed' | 'filled'
          created_at: string
        }
        Insert: {
          id: string
          created_by: string
          title: string
          description: string
          location: string
          hourly_rate: string
          shift_start: string
          shift_end: string
          status?: 'open' | 'closed' | 'filled'
          created_at?: string
        }
        Update: {
          id?: string
          created_by?: string
          title?: string
          description?: string
          location?: string
          hourly_rate?: string
          shift_start?: string
          shift_end?: string
          status?: 'open' | 'closed' | 'filled'
          created_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          job_id: string
          worker_id: string
          cover_note: string | null
          status: 'applied' | 'reviewed' | 'accepted' | 'rejected'
          created_at: string
        }
        Insert: {
          id: string
          job_id: string
          worker_id: string
          cover_note?: string | null
          status?: 'applied' | 'reviewed' | 'accepted' | 'rejected'
          created_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          worker_id?: string
          cover_note?: string | null
          status?: 'applied' | 'reviewed' | 'accepted' | 'rejected'
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          application_id: string
          confirmed_by: string
          start: string
          end: string
          status: 'confirmed' | 'completed' | 'canceled'
          created_at: string
        }
        Insert: {
          id: string
          application_id: string
          confirmed_by: string
          start: string
          end: string
          status?: 'confirmed' | 'completed' | 'canceled'
          created_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          confirmed_by?: string
          start?: string
          end?: string
          status?: 'confirmed' | 'completed' | 'canceled'
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          job_id: string
          rater_id: string
          ratee_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id: string
          job_id: string
          rater_id: string
          ratee_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          rater_id?: string
          ratee_id?: string
          rating?: number
          comment?: string | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}