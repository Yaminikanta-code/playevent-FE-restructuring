import { authenticatedAxios } from './api.service'
import {
  BaseApiService,
  type GetListParams,
  type PaginatedResponse,
} from './base-api.service'
import { PLACE_URLS } from '../constants/placeUrl.constant'
import type { PlaceCreate, PlaceUpdate, PlaceRead } from '../types/place.types'

export class PlaceService extends BaseApiService<
  PlaceCreate,
  PlaceUpdate,
  PlaceRead
> {
  constructor() {
    super({
      urls: PLACE_URLS,
      axiosInstance: authenticatedAxios,
    })
  }

  async getList(
    params?: GetListParams,
    config?: any,
  ): Promise<PaginatedResponse<PlaceRead>> {
    try {
      const response = await this.axiosInstance.get(this.urls.LIST, {
        ...config,
        params: this.sanitizeParams(params || {}),
      })

      const responseData = response.data

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

      return responseData
    } catch (error) {
      this.handleError(error, 'Failed to fetch places')
    }
  }
}

export const placeService = new PlaceService()
