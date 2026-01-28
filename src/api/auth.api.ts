import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService, type LoginCredentials } from '../services/auth.service'
import type { UserPayload } from '../stores/useAuthStore'
import { useAuthStore } from '../stores/useAuthStore'
import { useAlertStore } from '../stores/useAlertStore'

export function useLogin() {
  const queryClient = useQueryClient()
  const loginStore = useAuthStore((state) => state.login)
  const showAlert = useAlertStore((state) => state.showAlert)

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data: UserPayload) => {
      // Update auth store with user data
      loginStore(data)

      // Invalidate any relevant queries
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] })

      showAlert({
        message: 'Login successful!',
        type: 'success',
      })
    },
    onError: (error: any) => {
      showAlert({
        message:
          error?.response?.data?.detail || error?.message || 'Login failed',
        type: 'error',
      })
    },
  })
}

export function useLogout() {
  const logoutStore = useAuthStore((state) => state.logout)
  const showAlert = useAlertStore((state) => state.showAlert)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear auth store
      logoutStore()

      // Clear all queries
      queryClient.clear()

      showAlert({
        message: 'Logged out successfully',
        type: 'success',
      })
    },
    onError: (error: any) => {
      showAlert({
        message: error?.message || 'Logout failed',
        type: 'error',
      })
    },
  })
}

// Hook to check if user is authenticated
export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const access_token = useAuthStore((state) => state.access_token)

  return {
    isAuthenticated: !!user && !!access_token,
    user,
    access_token,
  }
}
