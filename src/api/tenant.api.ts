import { useQuery } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'
import { createApiHooks } from './base.api'
import { tenantService } from '../services/tenant.service'
import { useAlertStore } from '../stores/useAlertStore'
import { useEffect } from 'react'
import type { TenantOnboardingStatus } from '../types/tenant.types'

// Create base CRUD hooks using the factory
const tenantHooks = createApiHooks(tenantService, {
  serviceName: 'tenants',
  queryKeys: {
    list: ['tenants'],
    detail: (id: string) => ['tenants', id],
    additional: {
      onboardingStatus: (clientId: string) => ['tenants', 'onboarding', clientId],
    },
  },
  alerts: {
    createSuccess: 'Client created successfully!',
    updateSuccess: 'Client updated successfully!',
    deleteSuccess: 'Client deleted successfully!',
    restoreSuccess: 'Client restored successfully!',
    hardDeleteSuccess: 'Client permanently deleted!',
  },
})

// Export base CRUD hooks
export const {
  useList: useTenantList,
  useGetById: useTenantById,
  useCreate: useCreateTenant,
  useUpdate: useUpdateTenant,
  useDelete: useDeleteTenant,
  useRestore: useRestoreTenant,
  useHardDelete: useHardDeleteTenant,
} = tenantHooks

// Custom hook for onboarding status
export const useTenantOnboardingStatus = (
  clientId: string,
  options?: Partial<UseQueryOptions<TenantOnboardingStatus>>,
) => {
  const showAlert = useAlertStore((state) => state.showAlert)

  const query = useQuery({
    queryKey: ['tenants', 'onboarding', clientId],
    queryFn: () => tenantService.getOnboardingStatus(clientId),
    enabled: !!clientId,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.status === 401 || error?.status === 403) {
        return false
      }
      return failureCount < 2
    },
    ...options,
  })

  useEffect(() => {
    if (query.error) {
      showAlert({
        message:
          (query.error as any)?.message || 'Failed to fetch onboarding status',
        type: 'error',
      })
    }
  }, [query.error, showAlert])

  return query
}

// Re-export types for convenience
export type { CreateTenantDto, UpdateTenantDto, TenantOutDto, TenantOnboardingStatus } from '../types/tenant.types'
