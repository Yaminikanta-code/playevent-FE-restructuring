import { authenticatedAxios } from './api.service'
import {
  BaseApiService,
  type GetListParams,
  type PaginatedResponse,
} from './base-api.service'
import { TRIAL_URLS } from '../constants/trialUrl.constant'
import type { TrialCreate, TrialUpdate, TrialRead } from '../types/trial.types'

export class TrialService extends BaseApiService<
  TrialCreate,
  TrialUpdate,
  TrialRead
> {
  constructor() {
    super({
      urls: TRIAL_URLS,
      axiosInstance: authenticatedAxios,
    })
  }

  async getList(
    params?: GetListParams,
    config?: any,
  ): Promise<PaginatedResponse<TrialRead>> {
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
      this.handleError(error, 'Failed to fetch trials')
    }
  }
}

export const trialService = new TrialService()
