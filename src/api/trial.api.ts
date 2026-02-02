import { createApiHooks } from './base.api'
import { trialService } from '../services/trial.service'

const trialHooks = createApiHooks(trialService, {
  serviceName: 'trials',
  queryKeys: {
    list: ['trials'],
    detail: (id: string) => ['trials', id],
  },
  alerts: {
    createSuccess: 'Trial created successfully!',
    updateSuccess: 'Trial updated successfully!',
    deleteSuccess: 'Trial archived successfully!',
  },
})

export const {
  useList: useTrialList,
  useGetById: useTrialById,
  useCreate: useCreateTrial,
  useUpdate: useUpdateTrial,
  useDelete: useDeleteTrial,
  useRestore: useRestoreTrial,
  useHardDelete: useHardDeleteTrial,
} = trialHooks

export type { TrialCreate, TrialUpdate, TrialRead } from '../types/trial.types'
