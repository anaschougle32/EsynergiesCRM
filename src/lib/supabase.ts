import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a default client that won't crash if env vars are missing
let supabase: ReturnType<typeof createClient>

if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl === 'your_supabase_project_url_here' || 
    supabaseAnonKey === 'your_supabase_anon_key_here') {
  
  console.warn('⚠️  Supabase environment variables not configured properly.')
  console.warn('📝 Please create a .env file with your Supabase credentials.')
  console.warn('📖 See SUPABASE_SETUP.md for detailed setup instructions.')
  
  // Create a mock client that will throw helpful errors
  supabase = {
    from: () => ({
      select: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      update: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      delete: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      eq: function() { return this },
      single: function() { return this }
    }),
    auth: {
      signInWithPassword: () => Promise.resolve({ data: { session: null }, error: new Error('Supabase not configured') }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null })
    }
  } as any
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  })
}

export { supabase }

// Database types (you can generate these with Supabase CLI)
export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string
          email: string
          password_hash: string
          full_name: string
          business_name: string | null
          business_logo: string | null
          phone: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          full_name: string
          business_name?: string | null
          business_logo?: string | null
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          full_name?: string
          business_name?: string | null
          business_logo?: string | null
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          admin_id: string
          email: string
          password_hash: string
          username: string
          full_name: string
          business_name: string
          business_type: string | null
          phone: string | null
          address: string | null
          is_active: boolean
          first_login: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          admin_id: string
          email: string
          password_hash: string
          username: string
          full_name: string
          business_name: string
          business_type?: string | null
          phone?: string | null
          address?: string | null
          is_active?: boolean
          first_login?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          admin_id?: string
          email?: string
          password_hash?: string
          username?: string
          full_name?: string
          business_name?: string
          business_type?: string | null
          phone?: string | null
          address?: string | null
          is_active?: boolean
          first_login?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          admin_id: string
          client_id: string
          source_id: string
          external_id: string | null
          full_name: string
          email: string | null
          phone: string | null
          status: string
          lead_data: any | null
          notes: string | null
          assigned_to: string | null
          lead_score: number
          source_url: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          admin_id: string
          client_id: string
          source_id: string
          external_id?: string | null
          full_name: string
          email?: string | null
          phone?: string | null
          status?: string
          lead_data?: any | null
          notes?: string | null
          assigned_to?: string | null
          lead_score?: number
          source_url?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          admin_id?: string
          client_id?: string
          source_id?: string
          external_id?: string | null
          full_name?: string
          email?: string | null
          phone?: string | null
          status?: string
          lead_data?: any | null
          notes?: string | null
          assigned_to?: string | null
          lead_score?: number
          source_url?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 