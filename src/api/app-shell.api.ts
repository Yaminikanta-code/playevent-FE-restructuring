import { createApiHooks } from './base.api'
import { appShellService } from '../services/app-shell.service'

const appShellHooks = createApiHooks(appShellService, {
    serviceName: 'app_shells',
    queryKeys: {
        list: ['app_shells'],
        detail: (id: string) => ['app_shells', id],
    },
    alerts: {
        createSuccess: 'App Shell created successfully!',
        updateSuccess: 'App Shell updated successfully!',
        deleteSuccess: 'App Shell deleted successfully!',
    },
})

export const {
    useList: useAppShellList,
    useGetById: useAppShellById,
    useCreate: useCreateAppShell,
    useUpdate: useUpdateAppShell,
    useDelete: useDeleteAppShell,
    useRestore: useRestoreAppShell,
    useHardDelete: useHardDeleteAppShell,
} = appShellHooks

export type {
    AppShellOutDto,
    CreateAppShellDto,
    UpdateAppShellDto,
} from '../types/app-shell.types'
