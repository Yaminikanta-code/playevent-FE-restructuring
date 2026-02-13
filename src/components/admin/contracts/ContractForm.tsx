import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import { Copy, MoreVertical, Save, Trash2, X } from 'lucide-react'
import {
  Button,
  CheckboxTree,
  Collapsible,
  ConfirmationModal,
  ContextMenu,
  IconButton,
  Input,
  DatePicker,
  ScrollArea,
  Select,
  StatusSelector,
  type StatusOption,
} from '../../common'
import type { CheckboxTreeItem } from '../../common/CheckboxTree'
import {
  useCreateContract,
  useDeleteContract,
  useUpdateContract,
} from '../../../api/contract.api'
import { useModuleList } from '../../../api/module.api'
import { ContractStatus } from '../../../types/contract.types'
import type {
  ContractDetailDto,
  ContractOutDto,
  CreateContractDto,
  UpdateContractDto,
} from '../../../types/contract.types'
import type { TenantOutDto } from '../../../types/tenant.types'
import type { GroupOutDto } from '../../../types/group.types'

type FormMode = 'new' | 'edit' | 'duplicate'

interface ContractFormProps {
  contract?: ContractDetailDto | ContractOutDto | null
  tenants: TenantOutDto[]
  allGroups: GroupOutDto[]
  mode: FormMode
  onClose?: () => void
}

interface FormData {
  name: string
  description?: string
  client_id?: string
  start_date: string
  end_date: string
  total_events: number
  status: ContractStatus
  allocated_modules: Record<string, any>[]
  group_ids: string[]
}

const ContractForm = ({
  contract,
  tenants,
  allGroups,
  mode,
  onClose,
}: ContractFormProps) => {
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const isEditMode = mode === 'edit'
  const isDuplicateMode = mode === 'duplicate'
  const canDelete = isEditMode && contract?.id

  const tenantOptions = useMemo(
    () =>
      tenants.map((tenant) => ({
        value: tenant.id,
        label: tenant.name,
        disabled: false,
      })),
    [tenants],
  )

  const { data: moduleData } = useModuleList({
    page: 1,
    page_size: 100,
  })
  const allModules = moduleData?.data ?? []
  const activeModules = useMemo(
    () => allModules.filter((m: any) => m.status === 'active'),
    [allModules],
  )

  const statusOptions: Array<StatusOption> = [
    { value: 'active', label: 'Active', colorClass: 'bg-statuszen-base' },
    {
      value: 'inactive',
      label: 'Inactive',
      colorClass: 'bg-statusneutral-base',
    },
  ]

  const groupTreeItems: CheckboxTreeItem[] = useMemo(
    () =>
      allGroups.map((g) => ({
        id: g.id,
        label: g.name,
        parentId: g.parent_id ?? undefined,
      })),
    [allGroups],
  )



  const contractGroupIds = useMemo(() => {
    if ('group_ids' in (contract ?? {})) {
      return (contract as ContractDetailDto)?.group_ids ?? []
    }
    return []
  }, [contract])

  const contractModules = useMemo(() => {
    if (!contract?.allocated_modules) return []
    return contract.allocated_modules
  }, [contract?.allocated_modules])

  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      client_id: '',
      start_date: '',
      end_date: '',
      total_events: 0,
      status: ContractStatus.ACTIVE,
      allocated_modules: [],
      group_ids: [],
    },
  })

  useEffect(() => {
    if (contract && (isEditMode || isDuplicateMode)) {
      form.reset({
        name: contract.name,
        description: contract.description,
        client_id: contract.client_id,
        start_date: contract.start_date,
        end_date: contract.end_date,
        total_events: contract.total_events,
        status: (contract.status as ContractStatus) || ContractStatus.ACTIVE,
        allocated_modules: contractModules,
        group_ids: contractGroupIds,
      })
    } else {
      form.reset()
    }
    setHasChanges(false)
  }, [contract, mode, form, isEditMode, isDuplicateMode, contractModules, contractGroupIds])

  useEffect(() => {
    const subscription = form.watch(() => {
      setHasChanges(true)
    })
    return () => subscription.unsubscribe()
  }, [form])

  const createMutation = useCreateContract()
  const updateMutation = useUpdateContract()
  const deleteMutation = useDeleteContract()

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditMode && contract?.id) {
        const updateData: UpdateContractDto = {
          name: data.name,
          description: data.description,
          client_id: data.client_id,
          start_date: data.start_date,
          end_date: data.end_date,
          total_events: data.total_events,
          status: data.status,
          allocated_modules: data.allocated_modules,
          group_ids: data.group_ids,
        }
        await updateMutation.mutateAsync({
          id: contract.id,
          data: updateData,
        })
      } else {
        const createData: CreateContractDto = {
          name: data.name,
          description: data.description,
          client_id: data.client_id,
          source_id: isDuplicateMode ? contract?.id : undefined,
          start_date: data.start_date,
          end_date: data.end_date,
          total_events: data.total_events,
          status: data.status,
          allocated_modules: data.allocated_modules,
          group_ids: data.group_ids,
        }
        await createMutation.mutateAsync(createData)
      }

      setHasChanges(false)
      navigate({ to: '/admin/contracts' })
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleCopy = () => {
    if (contract?.id) {
      navigate({
        to: '/admin/contracts/$contractId/duplicate',
        params: { contractId: contract.id },
      })
    }
  }

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (contract?.id) {
      await deleteMutation.mutateAsync(contract.id)
      setShowDeleteModal(false)
      navigate({ to: '/admin/contracts' })
    }
  }

  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelModal(true)
    } else {
      onClose?.() || navigate({ to: '/admin/contracts' })
    }
  }

  const displayName = useMemo(() => {
    const name = form.watch('name')
    if (name) {
      return name.toUpperCase()
    }
    return 'NEW CONTRACT'
  }, [form.watch('name')])

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending

  return (
    <div className="h-[90vh]">
      <ScrollArea
        title="Contracts"
        headerActions={
          <div className="flex items-center gap-2">
            <IconButton
              icon={Copy}
              variant="secondary"
              size="md"
              tooltip="Copy Contract"
              onClick={handleCopy}
              disabled={!contract?.id || isSubmitting}
            />
            <IconButton
              icon={Save}
              variant="primary"
              size="md"
              tooltip="Save Contract"
              onClick={() => form.handleSubmit(onSubmit)()}
              isLoading={isSubmitting}
            />
            <ContextMenu
              items={[
                {
                  icon: X,
                  label: 'Cancel',
                  onClick: handleCancel,
                },
                ...(canDelete
                  ? [
                      {
                        icon: Trash2,
                        label: 'Delete',
                        onClick: handleDelete,
                        destructive: true,
                      },
                    ]
                  : []),
              ]}
              trigger={
                <IconButton
                  icon={MoreVertical}
                  variant="ghost"
                  size="md"
                  tooltip="More options"
                />
              }
              position="bottom-right"
            />
          </div>
        }
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="rounded-md bg-midnight-light px-4 py-2">
            <span className="text-sm font-semibold text-white">
              {displayName}
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Name"
                placeholder="Enter contract name"
                control={form.control}
                name="name"
                rules={{ required: 'Name is required' }}
              />
              <Select
                label="Client"
                placeholder="Select a client"
                control={form.control}
                name="client_id"
                options={tenantOptions}
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Input
                label="Description"
                placeholder="Enter description"
                control={form.control}
                name="description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DatePicker
                label="Start Date"
                control={form.control}
                name="start_date"
                rules={{ required: 'Start date is required' }}
              />
              <DatePicker
                label="End Date"
                control={form.control}
                name="end_date"
                rules={{ required: 'End date is required' }}
              />
              <Input
                label="Total Events"
                type="number"
                placeholder="0"
                control={form.control}
                name="total_events"
                rules={{
                  required: 'Total events is required',
                  valueAsNumber: true,
                  min: { value: 0, message: 'Must be 0 or greater' },
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatusSelector
                label="Status"
                control={form.control}
                name="status"
                rules={{ required: 'Status is required' }}
                options={statusOptions}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Collapsible title="ALLOCATED MODULES" defaultExpanded>
              <div className="space-y-3">
                {activeModules.map((module: any) => {
                  const currentModules = form.watch('allocated_modules') || []
                  const isChecked = currentModules.some(
                    (item) => item.id === module.id,
                  )

                  const handleToggle = () => {
                    const current = form.getValues('allocated_modules') || []
                    const exists = current.some((item) => item.id === module.id)
                    if (exists) {
                      form.setValue(
                        'allocated_modules',
                        current.filter((item) => item.id !== module.id),
                      )
                    } else {
                      form.setValue('allocated_modules', [
                        ...current,
                        { id: module.id, type_name: module.type_name },
                      ])
                    }
                  }

                  return (
                    <div
                      key={module.id}
                      className="flex items-center space-x-3 cursor-pointer"
                      onClick={handleToggle}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          e.stopPropagation()
                          const current = form.getValues('allocated_modules') || []
                          if (e.target.checked) {
                            form.setValue('allocated_modules', [
                              ...current,
                              { id: module.id, type_name: module.type_name },
                            ])
                          } else {
                            form.setValue(
                              'allocated_modules',
                              current.filter((item) => item.id !== module.id),
                            )
                          }
                        }}
                        className="h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-inputs-border bg-inputs-background checked:bg-divers-button checked:border-divers-button transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-inputs-border"
                      />
                      <span className="text-sm font-medium text-inputs-title">
                        {module.type_name}
                      </span>
                    </div>
                  )
                })}
              </div>
            </Collapsible>

            <Collapsible title="GROUPS" defaultExpanded>
              <CheckboxTree
                control={form.control}
                name="group_ids"
                items={groupTreeItems}
                defaultExpandAll
              />
            </Collapsible>
          </div>

          <div className="flex justify-center pt-2">
            <Button
              type="submit"
              variant="secondary"
              icon={Save}
              isLoading={isSubmitting}
            >
              Save
            </Button>
          </div>
        </form>
      </ScrollArea>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Contract"
        message={`Are you sure you want to delete "${contract?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        variant="danger"
      />

      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Discard Changes"
        message="You have unsaved changes. Are you sure you want to cancel and discard these changes?"
        confirmText="Discard"
        cancelText="Keep Editing"
        onConfirm={() => onClose?.() || navigate({ to: '/admin/contracts' })}
        variant="warning"
      />
    </div>
  )
}

export default ContractForm
