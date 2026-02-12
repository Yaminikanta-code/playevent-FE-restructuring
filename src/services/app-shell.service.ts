import { BaseApiService } from './base-api.service'
import { authenticatedAxios } from './api.service'
import { APP_SHELL_URLS } from '../constants/appShellUrl.constant'
import type {
    CreateAppShellDto,
    UpdateAppShellDto,
    AppShellOutDto
} from '../types/app-shell.types'

export class AppShellService extends BaseApiService<
    CreateAppShellDto,
    UpdateAppShellDto,
    AppShellOutDto
> {
    constructor() {
        super({
            urls: APP_SHELL_URLS,
            axiosInstance: authenticatedAxios,
        })
    }
}

export const appShellService = new AppShellService()
