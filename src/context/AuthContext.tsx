import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { authService, type AuthUser } from '../features/auth/auth.service'
import { supabase } from '../lib/supabase'

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUser(null)
        setIsLoading(false)
        return
      }

      // Set user immediately from session — no DB roundtrip, renders instantly
      const baseUser: AuthUser = {
        id: session.user.id,
        email: session.user.email ?? '',
        role: 'user',
        full_name: '',
      }
      setUser(baseUser)
      setIsLoading(false)

      // Fetch role in background, update when ready
      authService.getProfileRole(session.user.id).then(({ role, full_name }) => {
        setUser(u => u ? { ...u, role, full_name } : null)
      })
    })

    return () => subscription?.unsubscribe()
  }, [])

  const signOut = async () => {
    await authService.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}