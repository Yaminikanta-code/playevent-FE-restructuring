import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import { Copy, MoreVertical, Save, Trash2, X } from 'lucide-react'
import {
  Button,
  ConfirmationModal,
  ContextMenu,
  IconButton,
  Input,
  ScrollArea,
  Select,
  StatusSelector,
  type StatusOption,
} from '../../common'
import {
  useCreateGroup,
  useDeleteGroup,
  useUpdateGroup,
} from '../../../api/group.api'
import { GroupStatus } from '../../../types/group.types'
import type {
  CreateGroupDto,
  GroupOutDto,
  UpdateGroupDto,
} from '../../../types/group.types'
import type { TenantOutDto } from '../../../types/tenant.types'

type FormMode = 'new' | 'edit' | 'duplicate'

interface GroupFormProps {
  group?: GroupOutDto | null
  tenants: TenantOutDto[]
  allGroups: GroupOutDto[]
  mode: FormMode
  onClose?: () => void
}

interface FormData {
  name: string
  client_id: string
  parent_id: string
  status: GroupStatus
}

const GroupForm = ({
  group,
  tenants,
  allGroups,
  mode,
  onClose,
}: GroupFormProps) => {
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const isEditMode = mode === 'edit'
  const isDuplicateMode = mode === 'duplicate'
  const canDelete = isEditMode && group?.id

  const tenantOptions = useMemo(
    () =>
      tenants.map((tenant) => ({
        value: tenant.id,
        label: tenant.name,
        disabled: false,
      })),
    [tenants],
  )

  const parentGroupOptions = useMemo(() => {
    const options = allGroups
      .filter((g) => g.id !== group?.id)
      .map((g) => ({
        value: g.id,
        label: g.name,
        disabled: false,
      }))
    return [{ value: '', label: 'None (root)', disabled: false }, ...options]
  }, [allGroups, group?.id])

  const statusOptions: Array<StatusOption> = [
    { value: 'active', label: 'Active', colorClass: 'bg-statuszen-base' },
    {
      value: 'inactive',
      label: 'Inactive',
      colorClass: 'bg-statusneutral-base',
    },
    {
      value: 'archived',
      label: 'Archived',
      colorClass: 'bg-statusneutral-darkest',
    },
  ]

  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      client_id: '',
      parent_id: '',
      status: GroupStatus.ACTIVE,
    },
  })

  useEffect(() => {
    if (group && (isEditMode || isDuplicateMode)) {
      form.reset({
        name: group.name,
        client_id: group.client_id ?? '',
        parent_id: group.parent_id ?? '',
        status: (group.status as GroupStatus) || GroupStatus.ACTIVE,
      })
    } else {
      form.reset()
    }
    setHasChanges(false)
  }, [group, mode, form, isEditMode, isDuplicateMode])

  useEffect(() => {
    const subscription = form.watch(() => {
      setHasChanges(true)
    })
    return () => subscription.unsubscribe()
  }, [form])

  const createMutation = useCreateGroup()
  const updateMutation = useUpdateGroup()
  const deleteMutation = useDeleteGroup()

  const onSubmit = async (data: FormData) => {
    try {
      const formData: CreateGroupDto | UpdateGroupDto = {
        name: data.name,
        client_id: data.client_id || undefined,
        parent_id: data.parent_id || undefined,
        status: data.status,
      }

      if (isEditMode && group?.id) {
        await updateMutation.mutateAsync({
          id: group.id,
          data: formData as UpdateGroupDto,
        })
      } else {
        await createMutation.mutateAsync(formData as CreateGroupDto)
      }

      setHasChanges(false)
      navigate({ to: '/admin/groups' })
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleCopy = () => {
    if (group?.id) {
      navigate({
        to: '/admin/groups/$groupId/duplicate',
        params: { groupId: group.id },
      })
    }
  }

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (group?.id) {
      await deleteMutation.mutateAsync(group.id)
      setShowDeleteModal(false)
      navigate({ to: '/admin/groups' })
    }
  }

  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelModal(true)
    } else {
      onClose?.() || navigate({ to: '/admin/groups' })
    }
  }

  const getFormTitle = () => {
    if (isEditMode) return 'Edit Group'
    if (isDuplicateMode) return 'Duplicate Group'
    return 'New Group'
  }

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending

  return (
    <div className="h-[90vh]">
      <ScrollArea
        title={getFormTitle()}
        headerActions={
          <div className="flex items-center gap-2">
            <IconButton
              icon={Copy}
              variant="secondary"
              size="md"
              tooltip="Copy Group"
              onClick={handleCopy}
              disabled={!group?.id || isSubmitting}
            />
            <IconButton
              icon={Save}
              variant="primary"
              size="md"
              tooltip="Save Group"
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
          <div className="space-y-4 rounded-lg border border-inputs-border bg-inputs-background p-5">
            <div className="text-sm font-semibold text-inputs-title">
              Group
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Group Name"
                placeholder="Enter group name"
                control={form.control}
                name="name"
                rules={{ required: 'Group name is required' }}
              />

              <Select
                label="Client"
                placeholder="Select a client"
                control={form.control}
                name="client_id"
                rules={{ required: 'Client is required' }}
                options={tenantOptions}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Parent Group"
                placeholder="Select a parent group"
                control={form.control}
                name="parent_id"
                options={parentGroupOptions}
              />

              <StatusSelector
                label="Status"
                control={form.control}
                name="status"
                rules={{ required: 'Status is required' }}
                options={statusOptions}
              />
            </div>
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
        title="Delete Group"
        message={`Are you sure you want to delete "${group?.name}"? This action cannot be undone.`}
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
        onConfirm={() => onClose?.() || navigate({ to: '/admin/groups' })}
        variant="warning"
      />
    </div>
  )
}

export default GroupForm
