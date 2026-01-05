import { supabase } from '../../lib/supabase'

export interface AdminUser {
  id: string
  email: string
}

export const adminAuthService = {
  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string; user?: AdminUser }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Sign in error:', error)
        return { success: false, error: error.message }
      }

      if (!data.user) {
        return { success: false, error: 'No user returned' }
      }

      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email || ''
        }
      }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  },

  /**
   * Sign out
   */
  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('Sign out error:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Sign out error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  },

  /**
   * Get current session
   */
  async getSession(): Promise<{ user: AdminUser | null }> {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user) {
        return { user: null }
      }

      return {
        user: {
          id: session.user.id,
          email: session.user.email || ''
        }
      }
    } catch (error) {
      console.error('Get session error:', error)
      return { user: null }
    }
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: AdminUser | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email || ''
        })
      } else {
        callback(null)
      }
    })
  }
}