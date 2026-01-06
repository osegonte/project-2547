import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { adminAuthService } from '../../features/admin/admin.auth.service'

// DON'T IMPORT AdminUser - define it inline to avoid import issues
interface User {
  id: string
  email: string
}

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check session on mount
    const checkSession = async () => {
      const { user } = await adminAuthService.getSession()
      setUser(user)
      setIsLoading(false)
    }

    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = adminAuthService.onAuthStateChange((user) => {
      setUser(user)
      setIsLoading(false)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  // Render protected content
  return <>{children}</>
}