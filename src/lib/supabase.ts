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

// Database types for TypeScript support - Lanka.Digital Schema (Phase 1.2 + 1.3)
// Includes storage bucket types and file management
export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          type: 'product' | 'forum'
          icon: string | null
          color: string
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          type: 'product' | 'forum'
          icon?: string | null
          color?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          type?: 'product' | 'forum'
          icon?: string | null
          color?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          username: string
          display_name: string | null
          bio: string | null
          avatar_url: string | null
          website: string | null
          location: string | null
          points: number
          rank: 'Newbie' | 'Contributor' | 'Expert' | 'Elite Member' | 'Moderator' | 'Admin'
          level: number
          is_premium: boolean
          premium_until: string | null
          subscription_tier: 'free' | 'basic' | 'pro' | 'enterprise'
          total_uploads: number
          total_downloads: number
          total_posts: number
          total_replies: number
          helpful_votes_received: number
          email_notifications: boolean
          download_notifications: boolean
          forum_notifications: boolean
          is_active: boolean
          is_banned: boolean
          ban_reason: string | null
          ban_until: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          website?: string | null
          location?: string | null
          points?: number
          rank?: 'Newbie' | 'Contributor' | 'Expert' | 'Elite Member' | 'Moderator' | 'Admin'
          level?: number
          is_premium?: boolean
          premium_until?: string | null
          subscription_tier?: 'free' | 'basic' | 'pro' | 'enterprise'
          total_uploads?: number
          total_downloads?: number
          total_posts?: number
          total_replies?: number
          helpful_votes_received?: number
          email_notifications?: boolean
          download_notifications?: boolean
          forum_notifications?: boolean
          is_active?: boolean
          is_banned?: boolean
          ban_reason?: string | null
          ban_until?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          website?: string | null
          location?: string | null
          points?: number
          rank?: 'Newbie' | 'Contributor' | 'Expert' | 'Elite Member' | 'Moderator' | 'Admin'
          level?: number
          is_premium?: boolean
          premium_until?: string | null
          subscription_tier?: 'free' | 'basic' | 'pro' | 'enterprise'
          total_uploads?: number
          total_downloads?: number
          total_posts?: number
          total_replies?: number
          helpful_votes_received?: number
          email_notifications?: boolean
          download_notifications?: boolean
          forum_notifications?: boolean
          is_active?: boolean
          is_banned?: boolean
          ban_reason?: string | null
          ban_until?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          short_description: string | null
          category_id: string | null
          tags: string[]
          price: number
          currency: string
          is_premium: boolean
          is_featured: boolean
          thumbnail_url: string | null
          preview_images: string[]
          file_url: string | null
          file_size_bytes: number | null
          file_type: string | null
          author_id: string
          version: string
          requirements: string | null
          compatible_with: string[]
          views: number
          downloads: number
          rating: number
          total_ratings: number
          status: 'draft' | 'published' | 'archived' | 'deleted'
          is_active: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          short_description?: string | null
          category_id?: string | null
          tags?: string[]
          price?: number
          currency?: string
          is_premium?: boolean
          is_featured?: boolean
          thumbnail_url?: string | null
          preview_images?: string[]
          file_url?: string | null
          file_size_bytes?: number | null
          file_type?: string | null
          author_id: string
          version?: string
          requirements?: string | null
          compatible_with?: string[]
          views?: number
          downloads?: number
          rating?: number
          total_ratings?: number
          status?: 'draft' | 'published' | 'archived' | 'deleted'
          is_active?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          category_id?: string | null
          tags?: string[]
          price?: number
          currency?: string
          is_premium?: boolean
          is_featured?: boolean
          thumbnail_url?: string | null
          preview_images?: string[]
          file_url?: string | null
          file_size_bytes?: number | null
          file_type?: string | null
          author_id?: string
          version?: string
          requirements?: string | null
          compatible_with?: string[]
          views?: number
          downloads?: number
          rating?: number
          total_ratings?: number
          status?: 'draft' | 'published' | 'archived' | 'deleted'
          is_active?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      threads: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          category_id: string | null
          author_id: string
          is_pinned: boolean
          is_locked: boolean
          is_featured: boolean
          views: number
          replies_count: number
          upvotes: number
          downvotes: number
          total_votes: number
          status: 'draft' | 'published' | 'archived' | 'deleted'
          is_active: boolean
          last_reply_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          category_id?: string | null
          author_id: string
          is_pinned?: boolean
          is_locked?: boolean
          is_featured?: boolean
          views?: number
          replies_count?: number
          upvotes?: number
          downvotes?: number
          status?: 'draft' | 'published' | 'archived' | 'deleted'
          is_active?: boolean
          last_reply_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          category_id?: string | null
          author_id?: string
          is_pinned?: boolean
          is_locked?: boolean
          is_featured?: boolean
          views?: number
          replies_count?: number
          upvotes?: number
          downvotes?: number
          status?: 'draft' | 'published' | 'archived' | 'deleted'
          is_active?: boolean
          last_reply_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      replies: {
        Row: {
          id: string
          thread_id: string
          content: string
          author_id: string
          parent_reply_id: string | null
          depth: number
          upvotes: number
          downvotes: number
          total_votes: number
          is_hidden: boolean
          hidden_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          thread_id: string
          content: string
          author_id: string
          parent_reply_id?: string | null
          depth?: number
          upvotes?: number
          downvotes?: number
          is_hidden?: boolean
          hidden_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          thread_id?: string
          content?: string
          author_id?: string
          parent_reply_id?: string | null
          depth?: number
          upvotes?: number
          downvotes?: number
          is_hidden?: boolean
          hidden_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      downloads: {
        Row: {
          id: string
          user_id: string
          product_id: string
          ip_address: string | null
          user_agent: string | null
          download_method: 'web' | 'api' | 'premium'
          is_unlock: boolean
          points_spent: number
          downloaded_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          ip_address?: string | null
          user_agent?: string | null
          download_method?: 'web' | 'api' | 'premium'
          is_unlock?: boolean
          points_spent?: number
          downloaded_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          ip_address?: string | null
          user_agent?: string | null
          download_method?: 'web' | 'api' | 'premium'
          is_unlock?: boolean
          points_spent?: number
          downloaded_at?: string
        }
      }
      purchases: {
        Row: {
          id: string
          user_id: string
          product_id: string
          amount: number
          currency: string
          payment_method: 'card' | 'paypal' | 'bank_transfer' | 'mobile' | null
          transaction_id: string | null
          payment_gateway: string | null
          status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled'
          gateway_response: any | null
          notes: string | null
          purchased_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          amount: number
          currency?: string
          payment_method?: 'card' | 'paypal' | 'bank_transfer' | 'mobile' | null
          transaction_id?: string | null
          payment_gateway?: string | null
          status?: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled'
          gateway_response?: any | null
          notes?: string | null
          purchased_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          amount?: number
          currency?: string
          payment_method?: 'card' | 'paypal' | 'bank_transfer' | 'mobile' | null
          transaction_id?: string | null
          payment_gateway?: string | null
          status?: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled'
          gateway_response?: any | null
          notes?: string | null
          purchased_at?: string
          completed_at?: string | null
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          product_id: string
          rating: number
          title: string | null
          content: string | null
          pros: string[]
          cons: string[]
          is_verified_purchase: boolean
          is_featured: boolean
          is_hidden: boolean
          helpful_votes: number
          total_votes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          rating: number
          title?: string | null
          content?: string | null
          pros?: string[]
          cons?: string[]
          is_verified_purchase?: boolean
          is_featured?: boolean
          is_hidden?: boolean
          helpful_votes?: number
          total_votes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          rating?: number
          title?: string | null
          content?: string | null
          pros?: string[]
          cons?: string[]
          is_verified_purchase?: boolean
          is_featured?: boolean
          is_hidden?: boolean
          helpful_votes?: number
          total_votes?: number
          created_at?: string
          updated_at?: string
        }
      }
      badges: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          color: string
          type: 'upload' | 'download' | 'review' | 'forum' | 'achievement' | 'special'
          criteria: any
          rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
          points_value: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          color?: string
          type: 'upload' | 'download' | 'review' | 'forum' | 'achievement' | 'special'
          criteria?: any
          rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
          points_value?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          color?: string
          type?: 'upload' | 'download' | 'review' | 'forum' | 'achievement' | 'special'
          criteria?: any
          rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
          points_value?: number
          is_active?: boolean
          created_at?: string
        }
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          earned_reason: string | null
          earned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_id: string
          earned_reason?: string | null
          earned_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_id?: string
          earned_reason?: string | null
          earned_at?: string
        }
      }
      file_storage: {
        Row: {
          id: string
          user_id: string | null
          filename: string
          original_name: string
          file_path: string
          bucket_name: string
          file_size_bytes: number
          mime_type: string
          entity_type: 'product' | 'avatar' | 'attachment' | 'temp' | null
          entity_id: string | null
          is_public: boolean
          access_token: string | null
          metadata: any
          uploaded_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          filename: string
          original_name: string
          file_path: string
          bucket_name: string
          file_size_bytes: number
          mime_type: string
          entity_type?: 'product' | 'avatar' | 'attachment' | 'temp' | null
          entity_id?: string | null
          is_public?: boolean
          access_token?: string | null
          metadata?: any
          uploaded_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          filename?: string
          original_name?: string
          file_path?: string
          bucket_name?: string
          file_size_bytes?: number
          mime_type?: string
          entity_type?: 'product' | 'avatar' | 'attachment' | 'temp' | null
          entity_id?: string | null
          is_public?: boolean
          access_token?: string | null
          metadata?: any
          uploaded_at?: string
          expires_at?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'download' | 'purchase' | 'review' | 'forum' | 'system' | 'achievement'
          related_entity_type: 'product' | 'thread' | 'user' | 'system' | null
          related_entity_id: string | null
          is_read: boolean
          is_archived: boolean
          created_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: 'download' | 'purchase' | 'review' | 'forum' | 'system' | 'achievement'
          related_entity_type?: 'product' | 'thread' | 'user' | 'system' | null
          related_entity_id?: string | null
          is_read?: boolean
          is_archived?: boolean
          created_at?: string
          read_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'download' | 'purchase' | 'review' | 'forum' | 'system' | 'achievement'
          related_entity_type?: 'product' | 'thread' | 'user' | 'system' | null
          related_entity_id?: string | null
          is_read?: boolean
          is_archived?: boolean
          created_at?: string
          read_at?: string | null
        }
      }
      analytics: {
        Row: {
          id: string
          event_type: string
          user_id: string | null
          event_data: any
          metadata: any
          ip_address: string | null
          user_agent: string | null
          session_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_type: string
          user_id?: string | null
          event_data?: any
          metadata?: any
          ip_address?: string | null
          user_agent?: string | null
          session_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event_type?: string
          user_id?: string | null
          event_data?: any
          metadata?: any
          ip_address?: string | null
          user_agent?: string | null
          session_id?: string | null
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
