const BASE_PATH = '/v1/event'

export const EVENT_URLS = {
  CREATE: BASE_PATH,
  LIST: BASE_PATH,
  DETAIL: (id: string) => `${BASE_PATH}/${id}`,
  UPDATE: (id: string) => `${BASE_PATH}/${id}`,
  DELETE: (id: string) => `${BASE_PATH}/${id}`,
}
