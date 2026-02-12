import { BaseApiService } from './base-api.service'
import { authenticatedAxios } from './api.service'
import { GROUP_URLS } from '../constants/groupUrl.constant'
import type {
    CreateGroupDto,
    UpdateGroupDto,
    GroupOutDto
} from '../types/group.types'

export class GroupService extends BaseApiService<
    CreateGroupDto,
    UpdateGroupDto,
    GroupOutDto
> {
    constructor() {
        super({
            urls: GROUP_URLS,
            axiosInstance: authenticatedAxios,
        })
    }
}

export const groupService = new GroupService()
