import { redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/useAuthStore'

export const authRedirect = () => {
  const { access_token } = useAuthStore.getState()
  if (!access_token) {
    throw redirect({
      to: '/admin/login',
    })
  }
}
