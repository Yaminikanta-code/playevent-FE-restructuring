import { BaseApiService } from './base-api.service'
import { authenticatedAxios } from './api.service'
import { MODULE_URLS } from '../constants/moduleUrl.constant'
import type {
    CreateModuleDto,
    UpdateModuleDto,
    ModuleOutDto
} from '../types/module.types.ts'

export class ModuleService extends BaseApiService<
    CreateModuleDto,
    UpdateModuleDto,
    ModuleOutDto
> {
    constructor() {
        super({
            urls: MODULE_URLS,
            axiosInstance: authenticatedAxios,
        })
    }
}

export const moduleService = new ModuleService()
