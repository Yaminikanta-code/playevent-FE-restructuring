const BASE_PATH = '/v1/places'

export const PLACE_URLS = {
  CREATE: BASE_PATH,
  LIST: BASE_PATH,
  DETAIL: (id: string) => `${BASE_PATH}/${id}`,
  UPDATE: (id: string) => `${BASE_PATH}/${id}`,
  DELETE: (id: string) => `${BASE_PATH}/${id}`,
  RESTORE: (id: string) => `${BASE_PATH}/${id}/restore`,
  HARD_DELETE: (id: string) => `${BASE_PATH}/${id}/hard`,
}
