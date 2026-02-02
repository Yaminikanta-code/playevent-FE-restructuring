import { createApiHooks } from './base.api'
import { teamService } from '../services/team.service'

const teamHooks = createApiHooks(teamService, {
  serviceName: 'teams',
  queryKeys: {
    list: ['teams'],
    detail: (id: string) => ['teams', id],
  },
  alerts: {
    createSuccess: 'Team created successfully!',
    updateSuccess: 'Team updated successfully!',
    deleteSuccess: 'Team archived successfully!',
  },
})

export const {
  useList: useTeamList,
  useGetById: useTeamById,
  useCreate: useCreateTeam,
  useUpdate: useUpdateTeam,
  useDelete: useDeleteTeam,
  useRestore: useRestoreTeam,
  useHardDelete: useHardDeleteTeam,
} = teamHooks

export type { TeamCreate, TeamUpdate, TeamRead } from '../types/team.types'
