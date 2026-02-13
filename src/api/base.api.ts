// hooks/useApiBase.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  UseQueryOptions,
  UseMutationOptions,
  QueryKey,
} from '@tanstack/react-query'
import { BaseApiService } from '../services/base-api.service'
import type { GetListParams } from '../services/base-api.service'
import { useAlertStore } from '../stores/useAlertStore'
import { useEffect } from 'react'

// ============ TYPES ============

export interface ApiHookOptions<OutDto> {
  serviceName: string
  queryKeys?: {
    list?: QueryKey
    detail?: (id: string) => QueryKey
    additional?: Record<string, (params?: any) => QueryKey>
  }
  alerts?: Partial<{
    createSuccess: string
    updateSuccess: string
    deleteSuccess: string
    restoreSuccess: string
    hardDeleteSuccess: string
    error: (action: string) => string
  }>
  invalidateQueries?: {
    onSuccess?: (queryClient: any, data?: any, variables?: any) => void
  }
  queryDefaults?: Partial<UseQueryOptions<any, any, any, any>>
  mutationDefaults?: Partial<UseMutationOptions<any, any, any, any>>
}

// ============ HELPER FUNCTIONS ============

const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const singularize = (str: string): string => {
  // Simple singularization
  if (str.endsWith('ies')) {
    return str.slice(0, -3) + 'y'
  } else if (
    str.endsWith('es') &&
    (str.endsWith('ses') ||
      str.endsWith('xes') ||
      str.endsWith('zes') ||
      str.endsWith('ches') ||
      str.endsWith('shes'))
  ) {
    return str.slice(0, -2)
  } else if (str.endsWith('s') && !str.endsWith('ss')) {
    return str.slice(0, -1)
  }
  return str
}

const generateAlerts = (serviceName: string): ApiHookOptions<any>['alerts'] => {
  const singularName = singularize(serviceName)
  const capitalizedSingular = capitalize(singularName)

  return {
    createSuccess: `${capitalizedSingular} created successfully!`,
    updateSuccess: `${capitalizedSingular} updated successfully!`,
    deleteSuccess: `${capitalizedSingular} deleted successfully!`,
    restoreSuccess: `${capitalizedSingular} restored successfully!`,
    hardDeleteSuccess: `${capitalizedSingular} permanently deleted!`,
    error: (action: string) => {
      const actionMap: Record<string, string> = {
        fetch: `fetch ${singularName}`,
        create: `create ${singularName}`,
        update: `update ${singularName}`,
        delete: `delete ${singularName}`,
        restore: `restore ${singularName}`,
        'hard delete': `hard delete ${singularName}`,
      }
      const actionText = actionMap[action] || action
      return `Failed to ${actionText}`
    },
  }
}

// ============ BASE HOOK FACTORY ============

export function createApiHooks<
  CreateDto,
  UpdateDto,
  OutDto extends { id: string },
>(
  service: BaseApiService<CreateDto, UpdateDto, OutDto>,
  options: ApiHookOptions<OutDto>,
) {
  const {
    serviceName,
    queryKeys = {
      list: [serviceName],
      detail: (id: string) => [serviceName, id],
    },
    alerts: customAlerts = {},
    invalidateQueries,
    queryDefaults = {},
    mutationDefaults = {},
  } = options

  // Generate default alerts and merge with custom ones
  const defaultAlerts = generateAlerts(serviceName)
  const alerts = { ...defaultAlerts, ...customAlerts }
  // Ensure error is always a function
  const errorFn = (action: string) => {
    if (typeof alerts.error === 'function') {
      return alerts.error(action)
    }
    // Fallback to default error message
    const defaultError = defaultAlerts?.error
    if (typeof defaultError === 'function') {
      return defaultError(action)
    }
    // Ultimate fallback
    return `Failed to ${action}`
  }

  // ============ LIST HOOK ============

  interface UseListParams extends GetListParams {
    enabled?: boolean
    [key: string]: any
  }

  const useList = (params: UseListParams = {}) => {
    const showAlert = useAlertStore((state) => state.showAlert)
    const { enabled, ...apiParams } = params

    const queryKey = queryKeys.list || [serviceName]
    const enhancedQueryKey = [
      ...queryKey,
      ...Object.values(apiParams).filter((v) => v !== undefined),
    ]

    const query = useQuery({
      queryKey: enhancedQueryKey,
      queryFn: () => service.getList(apiParams),
      staleTime: Infinity,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error: any) => {
        if (error?.status === 401 || error?.status === 403) {
          return false
        }
        return failureCount < 2
      },
      ...queryDefaults,
      ...(enabled !== undefined && { enabled }),
    })

    useEffect(() => {
      if (query.error) {
        showAlert({
          message: query.error?.message || errorFn('fetch'),
          type: 'error',
        })
      }
    }, [query.error, showAlert])

    return query
  }

  // ============ GET BY ID HOOK ============

  const useGetById = (id: string, includeDeleted: boolean = false) => {
    const showAlert = useAlertStore((state) => state.showAlert)

    const queryKey = queryKeys.detail ? queryKeys.detail(id) : [serviceName, id]

    const query = useQuery({
      queryKey,
      queryFn: () => service.getById(id, includeDeleted),
      enabled: !!id,
      staleTime: Infinity,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error: any) => {
        if (error?.status === 401 || error?.status === 403) {
          return false
        }
        return failureCount < 2
      },
      ...queryDefaults,
    })

    useEffect(() => {
      if (query.error) {
        showAlert({
          message: query.error?.message || errorFn('fetch'),
          type: 'error',
        })
      }
    }, [query.error, showAlert])

    return query
  }

  // ============ CREATE HOOK ============

  const useCreate = () => {
    const queryClient = useQueryClient()
    const showAlert = useAlertStore((state) => state.showAlert)

    return useMutation({
      mutationFn: (data: CreateDto) => service.create(data),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.list })

        if (invalidateQueries?.onSuccess) {
          invalidateQueries.onSuccess(queryClient, data)
        }

        showAlert({
          message: alerts.createSuccess!,
          type: 'success',
        })
      },
      onError: (error: any) => {
        showAlert({
          message: error?.message || errorFn('create'),
          type: 'error',
        })
      },
      ...mutationDefaults,
    })
  }

  // ============ UPDATE HOOK ============

  const useUpdate = () => {
    const queryClient = useQueryClient()
    const showAlert = useAlertStore((state) => state.showAlert)

    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateDto }) =>
        service.update(id, data),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.list })
        if (queryKeys.detail) {
          queryClient.invalidateQueries({
            queryKey: queryKeys.detail(variables.id),
          })
        }

        if (invalidateQueries?.onSuccess) {
          invalidateQueries.onSuccess(queryClient, data, variables)
        }

        showAlert({
          message: alerts.updateSuccess!,
          type: 'success',
        })
      },
      onError: (error: any) => {
        showAlert({
          message: error?.message || errorFn('update'),
          type: 'error',
        })
      },
      ...mutationDefaults,
    })
  }

  // ============ DELETE HOOK ============

  const useDelete = () => {
    const queryClient = useQueryClient()
    const showAlert = useAlertStore((state) => state.showAlert)

    return useMutation({
      mutationFn: (id: string) => service.delete(id),
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.list })
        if (queryKeys.detail) {
          queryClient.removeQueries({ queryKey: queryKeys.detail(id) })
        }

        if (invalidateQueries?.onSuccess) {
          invalidateQueries.onSuccess(queryClient, undefined, { id })
        }

        showAlert({
          message: alerts.deleteSuccess!,
          type: 'success',
        })
      },
      onError: (error: any) => {
        showAlert({
          message: error?.message || errorFn('delete'),
          type: 'error',
        })
      },
      ...mutationDefaults,
    })
  }

  // ============ RESTORE HOOK ============

  const useRestore = () => {
    const queryClient = useQueryClient()
    const showAlert = useAlertStore((state) => state.showAlert)

    return useMutation({
      mutationFn: (id: string) => service.restore(id),
      onSuccess: (data, id) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.list })
        if (queryKeys.detail) {
          queryClient.invalidateQueries({ queryKey: queryKeys.detail(id) })
        }

        if (invalidateQueries?.onSuccess) {
          invalidateQueries.onSuccess(queryClient, data, { id })
        }

        showAlert({
          message: alerts.restoreSuccess!,
          type: 'success',
        })
      },
      onError: (error: any) => {
        showAlert({
          message: error?.message || errorFn('restore'),
          type: 'error',
        })
      },
      ...mutationDefaults,
    })
  }

  // ============ HARD DELETE HOOK ============

  const useHardDelete = () => {
    const queryClient = useQueryClient()
    const showAlert = useAlertStore((state) => state.showAlert)

    return useMutation({
      mutationFn: (id: string) => service.hardDelete(id),
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.list })
        if (queryKeys.detail) {
          queryClient.removeQueries({ queryKey: queryKeys.detail(id) })
        }

        if (invalidateQueries?.onSuccess) {
          invalidateQueries.onSuccess(queryClient, undefined, { id })
        }

        showAlert({
          message: alerts.hardDeleteSuccess!,
          type: 'success',
        })
      },
      onError: (error: any) => {
        showAlert({
          message: error?.message || errorFn('hard delete'),
          type: 'error',
        })
      },
      ...mutationDefaults,
    })
  }

  // ============ EXPORT ALL HOOKS ============

  return {
    useList,
    useGetById,
    useCreate,
    useUpdate,
    useDelete,
    useRestore,
    useHardDelete,
  }
}
