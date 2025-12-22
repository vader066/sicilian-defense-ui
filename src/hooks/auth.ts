import { useAuth } from '@/contexts/auth'

export function useAuthData() {
  const { user, club, login, logout, isLoading, error, refreshAuth } = useAuth()

  return {
    user,
    club,
    login,
    logout,
    refreshAuth,
    isLoading,
    error,
  }
}
