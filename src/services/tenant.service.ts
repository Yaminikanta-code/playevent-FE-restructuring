import type { AxiosRequestConfig } from 'axios'
import {
  BaseApiService,
  type GetListParams,
  type PaginatedResponse,
} from './base-api.service'
import { authenticatedAxios } from './api.service'
import { TENANT_URLS, TENANT_CUSTOM_URLS } from '../constants/tenantUrl.constant'
import type {
  CreateTenantDto,
  UpdateTenantDto,
  TenantOutDto,
  TenantOnboardingStatus,
} from '../types/tenant.types'

export class TenantService extends BaseApiService<
  CreateTenantDto,
  UpdateTenantDto,
  TenantOutDto
> {
  constructor() {
    super({
      urls: TENANT_URLS,
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
  ): Promise<PaginatedResponse<TenantOutDto>> {
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
      this.handleError(error, 'Failed to fetch tenants')
    }
  }

  /**
   * Get client onboarding status
   */
  async getOnboardingStatus(
    clientId: string,
    config?: AxiosRequestConfig,
  ): Promise<TenantOnboardingStatus> {
    try {
      const response = await this.axiosInstance.get(
        TENANT_CUSTOM_URLS.ONBOARDING_STATUS(clientId),
        config,
      )
      return response.data
    } catch (error) {
      this.handleError(error, 'Failed to fetch onboarding status')
    }
  }
}

export const tenantService = new TenantService()
