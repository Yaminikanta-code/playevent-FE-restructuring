import { createApiHooks } from './base.api'
import { groupService } from '../services/group.service'

const groupHooks = createApiHooks(groupService, {
  serviceName: 'groups',
  queryKeys: {
    list: ['groups'],
    detail: (id: string) => ['groups', id],
  },
  alerts: {
    createSuccess: 'Group created successfully!',
    updateSuccess: 'Group updated successfully!',
    deleteSuccess: 'Group deleted successfully!',
  },
})

export const {
  useList: useGroupList,
  useGetById: useGroupById,
  useCreate: useCreateGroup,
  useUpdate: useUpdateGroup,
  useDelete: useDeleteGroup,
  useRestore: useRestoreGroup,
  useHardDelete: useHardDeleteGroup,
} = groupHooks

export const useClientGroups = (clientId: string) => {
  return useGroupList({
    page: 1,
    page_size: 100,
    filter: JSON.stringify({ client_id: clientId }),
    enabled: !!clientId,
  })
}

export type {
  GroupOutDto,
  CreateGroupDto,
  UpdateGroupDto,
} from '../types/group.types'
