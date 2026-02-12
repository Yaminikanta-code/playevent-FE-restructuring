import { createApiHooks } from './base.api'
import { fontService } from '../services/font.service'

const fontHooks = createApiHooks(fontService, {
    serviceName: 'fonts',
    queryKeys: {
        list: ['fonts'],
        detail: (id: string) => ['fonts', id],
    },
    alerts: {
        createSuccess: 'Font created successfully!',
        updateSuccess: 'Font updated successfully!',
        deleteSuccess: 'Font deleted successfully!',
    },
})

export const {
    useList: useFontList,
    useGetById: useFontById,
    useCreate: useCreateFont,
    useUpdate: useUpdateFont,
    useDelete: useDeleteFont,
    useRestore: useRestoreFont,
    useHardDelete: useHardDeleteFont,
} = fontHooks

export type {
    FontOutDto,
    CreateFontDto,
    UpdateFontDto,
} from '../types/font.types'
