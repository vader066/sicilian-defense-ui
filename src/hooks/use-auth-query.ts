import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthData } from './auth'
import { toast } from '@/components/toast'

/**
 * Hook for authentication using TanStack Query
 * Provides login and logout functionality with proper invalidation
 */

export function useAuthQuery() {
  const { login: authLogin, logout: authLogout, refreshAuth } = useAuthData()
  const queryClient = useQueryClient()

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authLogin(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      // queryClient.invalidateQueries({ queryKey: ['user-roles'] })
      // queryClient.invalidateQueries({ queryKey: ['user-permissions'] })
      toast({
        title: 'Login successful',
        description: 'You have been successfully logged in.',
        variant: 'success',
      })
    },
    onError: (error) => {
      toast({
        title: 'Login failed',
        description:
          error instanceof Error
            ? error.message
            : 'Invalid credentials. Please try again.',
        variant: 'error',
      })
    },
  })

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: (message: string) => {
      authLogout()
      console.log(message)
      return Promise.resolve()
    },
    onSuccess: () => {
      // Clear all queries from the cache
      queryClient.clear()
      toast({
        title: 'Logout successful',
        description: 'You have been successfully logged out.',
        variant: 'success',
      })
    },
  })

  // Token refresh mutation
  const refreshMutation = useMutation({
    mutationFn: refreshAuth,
    onSuccess: (newToken) => {
      if (newToken) {
        // Refresh succeeded, no need to invalidate queries
        return
      }
      // If no new token, logout
      authLogout()
      queryClient.clear()
    },
    onError: () => {
      // If refresh fails, logout
      authLogout()
      queryClient.clear()
      // toast({
      //   title: 'Authentication error',
      //   description:
      //     'There was a problem with your authentication. Please log in again.',
      //   variant: 'error',
      // })
    },
  })

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    refresh: refreshMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isRefreshing: refreshMutation.isPending,
    loginError: loginMutation.error,
  }
}
