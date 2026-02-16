import { createApiHooks } from './base.api'
import { contractService } from '../services/contract.service'

const contractHooks = createApiHooks(contractService, {
  serviceName: 'contracts',
  queryKeys: {
    list: ['contracts'],
    detail: (id: string) => ['contracts', id],
  },
  alerts: {
    createSuccess: 'Contract created successfully!',
    updateSuccess: 'Contract updated successfully!',
    deleteSuccess: 'Contract deleted successfully!',
  },
})

export const {
  useList: useContractList,
  useGetById: useContractById,
  useCreate: useCreateContract,
  useUpdate: useUpdateContract,
  useDelete: useDeleteContract,
  useRestore: useRestoreContract,
  useHardDelete: useHardDeleteContract,
} = contractHooks

export const useClientContracts = (clientId: string) => {
  return useContractList({
    page: 1,
    page_size: 100,
    filter: JSON.stringify({ client_id: clientId }),
    enabled: !!clientId,
  })
}

export type {
  ContractOutDto,
  CreateContractDto,
  UpdateContractDto,
  ContractDetailDto,
} from '../types/contract.types'
