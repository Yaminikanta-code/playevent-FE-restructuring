import { BaseApiService } from './base-api.service'
import { authenticatedAxios } from './api.service'
import { FONT_URLS } from '../constants/fontUrl.constant'
import type {
    CreateFontDto,
    UpdateFontDto,
    FontOutDto
} from '../types/font.types'

export class FontService extends BaseApiService<
    CreateFontDto,
    UpdateFontDto,
    FontOutDto
> {
    constructor() {
        super({
            urls: FONT_URLS,
            axiosInstance: authenticatedAxios,
        })
    }
}

export const fontService = new FontService()
