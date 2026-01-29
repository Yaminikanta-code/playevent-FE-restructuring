import type { ApiUrls } from '../services/base-api.service'

const BASE_PATH = '/v1/tenant'

export const TENANT_URLS: ApiUrls = {
  CREATE: BASE_PATH,
  LIST: BASE_PATH,
  DETAIL: (id: string) => `${BASE_PATH}/${id}`,
  UPDATE: (id: string) => `${BASE_PATH}/${id}`,
  DELETE: (id: string) => `${BASE_PATH}/${id}`,
  HARD_DELETE: (id: string) => `${BASE_PATH}/${id}/hard`,
}

export const TENANT_CUSTOM_URLS = {
  ONBOARDING_STATUS: (id: string) => `${BASE_PATH}/onboarding/${id}`,
}
