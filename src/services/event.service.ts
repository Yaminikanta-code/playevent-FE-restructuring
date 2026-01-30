import type { AxiosRequestConfig } from 'axios'
import {
  BaseApiService,
  type GetListParams,
  type PaginatedResponse,
} from './base-api.service'
import { authenticatedAxios } from './api.service'
import { EVENT_URLS } from '../constants/eventUrl.constant'
import type { EventCreate, EventUpdate, EventRead } from '../types/event.types'

export class EventService extends BaseApiService<
  EventCreate,
  EventUpdate,
  EventRead
> {
  constructor() {
    super({
      urls: EVENT_URLS,
      axiosInstance: authenticatedAxios,
    })
  }

  /**
   * Override getList to handle plain array response from API
   * Normalizes to PaginatedResponse format
   */
  async getList(
    params?: GetListParams,
    config?: AxiosRequestConfig,
  ): Promise<PaginatedResponse<EventRead>> {
    try {
      const response = await this.axiosInstance.get(this.urls.LIST, {
        ...config,
        params: this.sanitizeParams(params || {}),
      })

      const responseData = response.data

      // If API returns plain array, wrap it in paginated response format
      if (Array.isArray(responseData)) {
        return {
          data: responseData,
          count: responseData.length,
          page: params?.page || 1,
          page_size: params?.page_size || responseData.length,
          total_pages: params?.page_size
            ? Math.ceil(responseData.length / params.page_size)
            : 1,
        }
      }

      // If API already returns paginated format, return as-is
      return responseData
    } catch (error) {
      this.handleError(error, 'Failed to fetch events')
    }
  }
}

export const eventService = new EventService()
