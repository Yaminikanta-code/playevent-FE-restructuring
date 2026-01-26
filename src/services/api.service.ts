import axios, { AxiosError } from 'axios'
import { useAuthStore } from '../stores/useAuthStore'
import type { UserPayload } from '../stores/useAuthStore'
import { AUTH_URL } from '@/constants/authUrl.constant'
import { config } from '@/config'

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

let isRefreshing = false
let failedQueue: {
  resolve: (value?: unknown) => void
  reject: (reason?: any) => void
  request: any
}[] = []

const processQueue = (
  error: AxiosError | null,
  token: string | null = null,
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else if (token) {
      prom.resolve(authenticatedAxios(prom.request))
    }
  })
  failedQueue = []
}

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
      // If already refreshing, queue the request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, request: originalRequest })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const { refresh_token, logout, login } = useAuthStore.getState()

      if (!refresh_token) {
        isRefreshing = false
        logout()
        return Promise.reject(error)
      }

      try {
        const response = await nonAuthenticatedAxios.post<UserPayload>(
          AUTH_URL.REFRESH,
          { refresh_token },
        )
        const newToken = response.data
        login(newToken) // Update store with new tokens

        // Update the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken.access_token}`
        }

        isRefreshing = false
        processQueue(null, newToken.access_token)

        return authenticatedAxios(originalRequest)
      } catch (refreshError: unknown) {
        isRefreshing = false
        processQueue(refreshError as AxiosError, null)
        logout()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)
