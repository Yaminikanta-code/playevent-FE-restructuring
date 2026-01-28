import axios, { AxiosError } from 'axios'
import { useAuthStore } from '../stores/useAuthStore'
import { config } from '../config'

declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean
  }
}

const { API_BASE_URL } = config

export const nonAuthenticatedAxios = axios.create({
  baseURL: API_BASE_URL,
})

export const authenticatedAxios = axios.create({
  baseURL: API_BASE_URL,
})

authenticatedAxios.interceptors.request.use(
  (config) => {
    const { access_token } = useAuthStore.getState()

    // console.log('🔍 Access token from store:', access_token)
    // console.log('🔍 Token type:', typeof access_token)
    // console.log('🔍 Token length:', access_token?.length)

    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`
      console.log('✅ Authorization header set:', config.headers.Authorization)
    } else {
      console.error('❌ No access token found in store!')
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

interface ErrorResponseData {
  message?: string
  detail?: string
}

authenticatedAxios.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config
    const errorData = error.response?.data as ErrorResponseData
    console.log('⚠️ Axios response error:', {
      status: error.response?.status,
      data: errorData,
    })

    // Check for 401 status - this covers all authentication errors
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      // No refresh token available, just logout
      const { logout } = useAuthStore.getState()
      logout()
      return Promise.reject(error)
    }

    return Promise.reject(error)
  },
)
