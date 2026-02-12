import { BaseApiService } from './base-api.service'
import { authenticatedAxios } from './api.service'
import { ADMIN_GROUP_URLS } from '../constants/adminGroupUrl.constant'
import type {
    CreateAdminGroupDto,
    UpdateAdminGroupDto,
    AdminGroupOutDto
} from '../types/admin-group.types'

export class AdminGroupService extends BaseApiService<
    CreateAdminGroupDto,
    UpdateAdminGroupDto,
    AdminGroupOutDto
> {
    constructor() {
        super({
            urls: ADMIN_GROUP_URLS,
            axiosInstance: authenticatedAxios,
        })
    }
}

export const adminGroupService = new AdminGroupService()
