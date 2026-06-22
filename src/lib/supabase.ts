import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not found. Using local mode.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// Global JWT error handler
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
    localStorage.clear()
    window.location.href = '/login'
  }
})

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Database types
export interface Database {
  public: {
    Tables: {
      sessions: {
        Row: {
          id: string
          user_id: string | null
          title: string
          model: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          model: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          model?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          session_id: string
          role: 'user' | 'assistant'
          content: string
          result_type: 'text' | 'image' | 'code' | 'search' | 'audio'
          specialist_result: any
          model: string | null
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          role: 'user' | 'assistant'
          content: string
          result_type: 'text' | 'image' | 'code' | 'search' | 'audio'
          specialist_result?: any
          model?: string | null
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          role?: 'user' | 'assistant'
          content?: string
          result_type?: 'text' | 'image' | 'code' | 'search' | 'audio'
          specialist_result?: any
          model?: string | null
          timestamp?: string
          created_at?: string
        }
      }
    }
  }
}
