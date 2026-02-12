import { authenticatedAxios } from './api.service'
import { BaseApiService } from './base-api.service'
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
}

export const placeService = new PlaceService()
