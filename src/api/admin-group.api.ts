import { createApiHooks } from './base.api'
import { adminGroupService } from '../services/admin-group.service'

const adminGroupHooks = createApiHooks(adminGroupService, {
    serviceName: 'admin_groups',
    queryKeys: {
        list: ['admin_groups'],
        detail: (id: string) => ['admin_groups', id],
    },
    alerts: {
        createSuccess: 'Admin Group created successfully!',
        updateSuccess: 'Admin Group updated successfully!',
        deleteSuccess: 'Admin Group deleted successfully!',
    },
})

export const {
    useList: useAdminGroupList,
    useGetById: useAdminGroupById,
    useCreate: useCreateAdminGroup,
    useUpdate: useUpdateAdminGroup,
    useDelete: useDeleteAdminGroup,
    useRestore: useRestoreAdminGroup,
    useHardDelete: useHardDeleteAdminGroup,
} = adminGroupHooks

export type {
    AdminGroupOutDto,
    CreateAdminGroupDto,
    UpdateAdminGroupDto,
} from '../types/admin-group.types'
