import { BaseApiService } from './base-api.service'
import { authenticatedAxios } from './api.service'
import { ADMIN_URLS, ADMIN_CUSTOM_URLS } from '../constants/adminUrl.constant'
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

    async create(data: CreateAdminDto): Promise<AdminOutDto> {
        const response = await this.axiosInstance.post(
            ADMIN_CUSTOM_URLS.REGISTER,
            {
                email: data.email,
                password: data.password,
                first_name: data.first_name,
                last_name: data.last_name,
                client_id: data.client_id,
                group_ids: [],
            },
        )
        // The register endpoint returns { access_token, token_type, user }
        // Extract the user object as our AdminOutDto
        const user = response.data.user
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            client_id: user.client_id,
            first_name: user.first_name,
            last_name: user.last_name,
            status: 'active',
        } as AdminOutDto
    }
}

export const adminService = new AdminService()
