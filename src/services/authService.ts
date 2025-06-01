import { supabase } from '../lib/supabase'
import bcrypt from 'bcryptjs'

export interface LoginCredentials {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'client'
  business_name?: string
  phone?: string
}

export interface AuthResponse {
  user: User
  token: string
}

// Database types for proper typing
interface AdminRow {
  id: string
  email: string
  password_hash: string
  full_name: string
  business_name: string | null
  phone: string | null
  is_active: boolean
}

interface ClientRow {
  id: string
  admin_id: string
  email: string
  password_hash: string
  username: string
  full_name: string
  business_name: string
  business_type: string | null
  phone: string | null
  is_active: boolean
}

// Mock data for when Supabase is not configured
const mockUsers = {
  'admin@marketingagency.com': {
    id: '1',
    email: 'admin@marketingagency.com',
    full_name: 'Admin User',
    role: 'admin' as const,
    business_name: 'Marketing Agency Pro',
    phone: '+1234567890',
    password: 'admin123'
  },
  'client1@restaurant.com': {
    id: '2',
    email: 'client1@restaurant.com',
    full_name: 'Maria Garcia',
    role: 'client' as const,
    business_name: 'Bella Vista Restaurant',
    phone: '+1234567891',
    password: 'client123'
  },
  'admin@example.com': {
    id: '3',
    email: 'admin@example.com',
    full_name: 'Demo Admin',
    role: 'admin' as const,
    business_name: 'Demo Agency',
    password: 'password'
  },
  'client@example.com': {
    id: '4',
    email: 'client@example.com',
    full_name: 'Demo Client',
    role: 'client' as const,
    business_name: 'Demo Business',
    password: 'password'
  }
}

class AuthService {
  private isSupabaseConfigured(): boolean {
    try {
      const url = import.meta.env.VITE_SUPABASE_URL
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY
      return !!(url && key && url !== 'your_supabase_project_url_here' && key !== 'your_supabase_anon_key_here')
    } catch {
      return false
    }
  }

  async loginWithMock(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const mockUser = mockUsers[email as keyof typeof mockUsers]
    
    if (!mockUser || mockUser.password !== password) {
      throw new Error('Invalid credentials')
    }
    
    const { password: _, ...user } = mockUser
    
    return {
      user,
      token: `mock-token-${user.id}`
    }
  }

  async loginAdmin(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials

    // Query admin table
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single()

    if (error || !admin) {
      throw new Error('Invalid credentials')
    }

    const adminData = admin as unknown as AdminRow

    // Verify password
    const isValidPassword = await bcrypt.compare(password, adminData.password_hash)
    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }

    const user: User = {
      id: adminData.id,
      email: adminData.email,
      full_name: adminData.full_name,
      role: 'admin',
      business_name: adminData.business_name || undefined,
      phone: adminData.phone || undefined
    }

    return {
      user,
      token: `supabase-token-${adminData.id}`
    }
  }

  async loginClient(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials

    // Query client table
    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single()

    if (error || !client) {
      throw new Error('Invalid credentials')
    }

    const clientData = client as unknown as ClientRow

    // Verify password
    const isValidPassword = await bcrypt.compare(password, clientData.password_hash)
    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }

    const user: User = {
      id: clientData.id,
      email: clientData.email,
      full_name: clientData.full_name,
      role: 'client',
      business_name: clientData.business_name,
      phone: clientData.phone || undefined
    }

    return {
      user,
      token: `supabase-token-${clientData.id}`
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Check if Supabase is configured
    if (!this.isSupabaseConfigured()) {
      console.warn('Supabase not configured, using mock authentication. Please set up your .env file.')
      return this.loginWithMock(credentials)
    }

    try {
      // Try admin login first
      return await this.loginAdmin(credentials)
    } catch (adminError) {
      try {
        // If admin login fails, try client login
        return await this.loginClient(credentials)
      } catch (clientError) {
        throw new Error('Invalid credentials')
      }
    }
  }

  async logout(): Promise<void> {
    if (this.isSupabaseConfigured()) {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Logout error:', error)
      }
    }
  }

  async forgotPassword(email: string): Promise<void> {
    if (!this.isSupabaseConfigured()) {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 800))
      console.log(`Mock: Password reset email would be sent to: ${email}`)
      return
    }

    // Check if email exists in admin or client tables
    const { data: admin } = await supabase
      .from('admins')
      .select('id')
      .eq('email', email)
      .single()

    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .eq('email', email)
      .single()

    if (!admin && !client) {
      throw new Error('Email not found')
    }

    // In a real implementation, you would send a password reset email
    console.log(`Password reset email would be sent to: ${email}`)
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // In a real implementation, you would verify the token and update the password
    throw new Error('Password reset functionality not implemented yet')
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.isSupabaseConfigured()) {
      return null
    }

    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return null
    }

    // Extract user info from session or query database
    return null
  }
}

export const authService = new AuthService() 