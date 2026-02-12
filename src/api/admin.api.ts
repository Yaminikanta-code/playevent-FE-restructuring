import { createApiHooks } from './base.api'
import { adminService } from '../services/admin.service'

const adminHooks = createApiHooks(adminService, {
    serviceName: 'admins',
    queryKeys: {
        list: ['admins'],
        detail: (id: string) => ['admins', id],
    },
    alerts: {
        createSuccess: 'Admin created successfully!',
        updateSuccess: 'Admin updated successfully!',
        deleteSuccess: 'Admin deleted successfully!',
    },
})

export const {
    useList: useAdminList,
    useGetById: useAdminById,
    useCreate: useCreateAdmin,
    useUpdate: useUpdateAdmin,
    useDelete: useDeleteAdmin,
    useRestore: useRestoreAdmin,
    useHardDelete: useHardDeleteAdmin,
} = adminHooks

export type {
    AdminOutDto,
    CreateAdminDto,
    UpdateAdminDto,
    AdminDetailDto,
} from '../types/admin.types'
