import { BaseApiService } from './base-api.service'
import { authenticatedAxios } from './api.service'
import { ADMIN_URLS } from '../constants/adminUrl.constant'
import type {
    CreateAdminDto,
    UpdateAdminDto,
    AdminOutDto
} from '../types/admin.types'

export class AdminService extends BaseApiService<
    CreateAdminDto,
    UpdateAdminDto,
    AdminOutDto
> {
    constructor() {
        super({
            urls: ADMIN_URLS,
            axiosInstance: authenticatedAxios,
        })
    }
}

export const adminService = new AdminService()
