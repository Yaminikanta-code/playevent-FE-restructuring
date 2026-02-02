import { createApiHooks } from './base.api'
import { placeService } from '../services/place.service'

const placeHooks = createApiHooks(placeService, {
  serviceName: 'places',
  queryKeys: {
    list: ['places'],
    detail: (id: string) => ['places', id],
  },
  alerts: {
    createSuccess: 'Place created successfully!',
    updateSuccess: 'Place updated successfully!',
    deleteSuccess: 'Place archived successfully!',
  },
})

export const {
  useList: usePlaceList,
  useGetById: usePlaceById,
  useCreate: useCreatePlace,
  useUpdate: useUpdatePlace,
  useDelete: useDeletePlace,
  useRestore: useRestorePlace,
  useHardDelete: useHardDeletePlace,
} = placeHooks

export type {
  PlaceCreate,
  PlaceUpdate,
  PlaceRead,
  Subplace,
} from '../types/place.types'
