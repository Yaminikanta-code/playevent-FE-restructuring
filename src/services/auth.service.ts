import { nonAuthenticatedAxios } from './api.service'
import type { UserPayload } from '../stores/useAuthStore'
import { AUTH_URL } from '../constants/authUrl.constant'

export interface LoginCredentials {
  email: string
  password: string
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<UserPayload> {
    const response = await nonAuthenticatedAxios.post<UserPayload>(
      AUTH_URL.LOGIN,
      credentials,
    )
    return response.data
  }

  async logout(): Promise<void> {
    // If backend has logout endpoint, call it here
    // await nonAuthenticatedAxios.post(AUTH_URL.LOGOUT)
  }

  async logoutAll(): Promise<void> {
    // If backend has logout all endpoint, call it here
    // await nonAuthenticatedAxios.post(AUTH_URL.LOGOUT_ALL)
  }
}

export const authService = new AuthService()
