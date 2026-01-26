import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { authenticatedAxios as defaultAxios } from './api.service'

// ============ INTERFACES ============

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page?: number
  page_size?: number
  total_pages?: number
}

export interface GetListParams {
  [key: string]: any
  page?: number
  page_size?: number
  include_deleted?: boolean
}

export interface ApiUrls {
  CREATE: string
  LIST: string
  DETAIL: (id: string) => string
  UPDATE: (id: string) => string
  DELETE: (id: string) => string
  RESTORE?: (id: string) => string
  HARD_DELETE?: (id: string) => string
}

export interface BaseServiceOptions {
  urls: ApiUrls
  axiosInstance?: AxiosInstance
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// ============ BASE API SERVICE ============

export abstract class BaseApiService<CreateDto, UpdateDto, OutDto> {
  protected urls: ApiUrls
  protected axiosInstance: AxiosInstance

  constructor(options: BaseServiceOptions) {
    this.urls = options.urls
    this.axiosInstance = options.axiosInstance || defaultAxios
  }

  // ============ ERROR HANDLING ============

  protected handleError(error: unknown, defaultMessage: string): never {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { data, status } = error.response
        const errorDetail = data?.detail || data?.message || data?.error
        const errorCode = data?.code

        throw new ApiError(
          errorDetail || defaultMessage,
          status,
          errorCode,
          data,
        )
      } else if (error.request) {
        throw new ApiError('No response received from server')
      } else {
        throw new ApiError(error.message || defaultMessage)
      }
    }

    throw new ApiError(defaultMessage)
  }

  // ============ CRUD OPERATIONS ============

  async create(data: CreateDto, config?: AxiosRequestConfig): Promise<OutDto> {
    try {
      const response = await this.axiosInstance.post(
        this.urls.CREATE,
        data,
        config,
      )
      return response.data
    } catch (error) {
      this.handleError(error, 'Failed to create resource')
    }
  }

  async getList(
    params?: GetListParams,
    config?: AxiosRequestConfig,
  ): Promise<PaginatedResponse<OutDto>> {
    try {
      const response = await this.axiosInstance.get(this.urls.LIST, {
        ...config,
        params: this.sanitizeParams(params || {}),
      })
      return response.data
    } catch (error) {
      this.handleError(error, 'Failed to fetch resource list')
    }
  }

  async getById(
    id: string,
    includeDeleted: boolean = false,
    config?: AxiosRequestConfig,
  ): Promise<OutDto> {
    try {
      const response = await this.axiosInstance.get(this.urls.DETAIL(id), {
        ...config,
        params: includeDeleted ? { include_deleted: true } : {},
      })
      return response.data
    } catch (error) {
      this.handleError(error, 'Failed to fetch resource by ID')
    }
  }

  async update(
    id: string,
    data: UpdateDto,
    config?: AxiosRequestConfig,
  ): Promise<OutDto> {
    try {
      const response = await this.axiosInstance.put(
        this.urls.UPDATE(id),
        data,
        config,
      )
      return response.data
    } catch (error) {
      this.handleError(error, 'Failed to update resource')
    }
  }

  async delete(id: string, config?: AxiosRequestConfig): Promise<void> {
    try {
      await this.axiosInstance.delete(this.urls.DELETE(id), config)
    } catch (error) {
      this.handleError(error, 'Failed to delete resource')
    }
  }

  // ============ SOFT DELETE & RESTORE OPERATIONS ============

  async restore(id: string, config?: AxiosRequestConfig): Promise<OutDto> {
    try {
      if (!this.urls.RESTORE) {
        throw new Error('Restore endpoint not defined')
      }
      const response = await this.axiosInstance.patch(
        this.urls.RESTORE(id),
        {},
        config,
      )
      return response.data
    } catch (error) {
      this.handleError(error, 'Failed to restore resource')
    }
  }

  async hardDelete(
    id: string,
    config?: AxiosRequestConfig,
  ): Promise<{ message: string; id: string }> {
    try {
      if (!this.urls.HARD_DELETE) {
        throw new Error('Hard delete endpoint not defined')
      }
      const response = await this.axiosInstance.delete(
        this.urls.HARD_DELETE(id),
        config,
      )
      return response.data
    } catch (error) {
      this.handleError(error, 'Failed to hard delete resource')
    }
  }

  // ============ HELPER METHODS ============

  protected sanitizeParams(params: GetListParams): Record<string, any> {
    const sanitized: Record<string, any> = {}

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        sanitized[key] = value
      }
    }

    return sanitized
  }

  setAxiosInstance(instance: AxiosInstance): void {
    this.axiosInstance = instance
  }
}
