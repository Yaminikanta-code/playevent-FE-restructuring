import { createApiHooks } from './base.api'
import { moduleService } from '../services/module.service'

const moduleHooks = createApiHooks(moduleService, {
    serviceName: 'modules',
    queryKeys: {
        list: ['modules'],
        detail: (id: string) => ['modules', id],
    },
    alerts: {
        createSuccess: 'Module created successfully!',
        updateSuccess: 'Module updated successfully!',
        deleteSuccess: 'Module deleted successfully!',
    },
})

export const {
    useList: useModuleList,
    useGetById: useModuleById,
    useCreate: useCreateModule,
    useUpdate: useUpdateModule,
    useDelete: useDeleteModule,
    useRestore: useRestoreModule,
    useHardDelete: useHardDeleteModule,
} = moduleHooks

export type {
    ModuleOutDto,
    CreateModuleDto,
    UpdateModuleDto,
} from '../types/module.types'
