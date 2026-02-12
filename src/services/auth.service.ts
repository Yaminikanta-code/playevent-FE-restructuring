import { nonAuthenticatedAxios } from './api.service'
import type {
  LoginCredentials,
  AuthResponse,
  AdminRegisterDto,
  SuperAdminRegisterDto
} from '../types/auth.types'
import { AUTH_URL } from '../constants/authUrl.constant'

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await nonAuthenticatedAxios.post<AuthResponse>(
      AUTH_URL.LOGIN,
      credentials,
    )
    return response.data
  }

  async registerAdmin(data: AdminRegisterDto): Promise<AuthResponse> {
    const response = await nonAuthenticatedAxios.post<AuthResponse>(
      AUTH_URL.REGISTER_ADMIN,
      data,
    )
    return response.data
  }

  async registerSuperAdmin(data: SuperAdminRegisterDto): Promise<AuthResponse> {
    const response = await nonAuthenticatedAxios.post<AuthResponse>(
      AUTH_URL.REGISTER_SUPER_ADMIN,
      data,
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
