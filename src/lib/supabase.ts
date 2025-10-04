import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types for TypeScript support
export type Database = {
  public: {
    Tables: {
      // These will be defined in Phase 1.2 when we create the database schema
      // For now, we'll use the mock data structure
      users: {
        Row: {
          id: string
          email: string
          username: string
          display_name?: string
          avatar_url?: string
          bio?: string
          points: number
          rank: string
          is_premium: boolean
          premium_until?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          username: string
          display_name?: string
          avatar_url?: string
          bio?: string
          points?: number
          rank?: string
          is_premium?: boolean
          premium_until?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          display_name?: string
          avatar_url?: string
          bio?: string
          points?: number
          rank?: string
          is_premium?: boolean
          premium_until?: string
          created_at?: string
          updated_at?: string
        }
      }
      // Add other table types as we implement them in Phase 1.2
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
