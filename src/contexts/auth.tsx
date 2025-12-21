import { AuthService } from '@/services/auth'
import { AuthError, type Club, type User } from '@/types/auth'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

interface AuthContextProps {
  authToken: string | null
  user: User | null
  club: Club | null
  isLoading: boolean
  error: AuthError | null
  logout: () => void
  refreshAuth: () => Promise<string | null>
  login: (username: string, password: string) => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children?: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [club, setClub] = useState<Club | null>(null)
  const [authToken, setAuthToken] = useState<string | null>(
    AuthService.getToken(),
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)

  // Setup token refresh at regular intervals
  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // start timer to refresh token every 15 minutes
  useEffect(() => {
    if (!authToken) return
    if (refreshTimerRef.current) return
    refreshTimerRef.current = setInterval(
      refreshAuth,
      15 * 60 * 1000, // Refresh every 15 minutes
    )

    return () => {
      clearInterval(refreshTimerRef.current!)
      refreshTimerRef.current = null
    }
  }, [authToken])

  useEffect(() => {
    const token = AuthService.getToken()
    if (!token) return
    getCurrentUser()
  }, [])

  const getCurrentUser = () => {
    try {
      const userData = AuthService.getUserData()
      setUser(userData.user)
      setClub(userData.club)
      setAuthToken(AuthService.getToken())
    } catch (error) {
      if (error instanceof AuthError) {
        setError(error)
      } else {
        setError(new AuthError('Failed to get user data', 500, error))
      }
      return null
    }
  }

  const refreshAuth = async (): Promise<string | null> => {
    try {
      const newToken = await AuthService.refreshToken()
      return newToken
    } catch (error) {
      console.error('Failed to refresh token', error)
      return null
    }
  }

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await AuthService.login({ username, password })
      setUser(response.user)
      setAuthToken(AuthService.getToken())
    } catch (error) {
      if (error instanceof AuthError) {
        setError(error)
        throw error
      } else {
        const authError = new AuthError(
          error instanceof Error ? error.message : 'Login failed',
          500,
          error,
        )
        setError(authError)
        throw authError
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setError(null)
      setIsLoading(true)
      await AuthService.logout()
      setUser(null)
      setAuthToken(null)

      // Clear the refresh timer
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current)
        refreshTimerRef.current = null
      }
    } catch (error) {
      setError(
        error instanceof AuthError
          ? error
          : new AuthError(
              error instanceof Error ? error.message : 'Logout failed',
              500,
              error,
            ),
      )
    } finally {
      setIsLoading(false)
    }
  }
  const value = {
    authToken,
    isLoading,
    error,
    user,
    login,
    logout,
    refreshAuth,
    club,
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
