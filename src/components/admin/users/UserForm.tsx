import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import { Copy, MoreVertical, Save, Trash2, X } from 'lucide-react'
import {
  Button,
  Checkbox,
  CheckboxTree,
  Collapsible,
  ConfirmationModal,
  ContextMenu,
  IconButton,
  Input,
  ScrollArea,
  Select,
  StatusSelector,
  type StatusOption,
} from '../../common'
import type { CheckboxTreeItem } from '../../common/CheckboxTree'
import {
  useCreateAdmin,
  useDeleteAdmin,
  useUpdateAdmin,
} from '../../../api/admin.api'
import { AdminRole, AdminStatus } from '../../../types/admin.types'
import type {
  AdminDetailDto,
  AdminOutDto,
  CreateAdminDto,
  UpdateAdminDto,
} from '../../../types/admin.types'
import type { TenantOutDto } from '../../../types/tenant.types'
import type { GroupOutDto } from '../../../types/group.types'

type FormMode = 'new' | 'edit' | 'duplicate'

interface UserFormProps {
  user?: AdminDetailDto | AdminOutDto | null
  tenants: TenantOutDto[]
  allGroups: GroupOutDto[]
  mode: FormMode
  onClose?: () => void
}

interface FormData {
  first_name: string
  last_name: string
  email: string
  password: string
  client_id: string
  status: AdminStatus
  rights_users_creation: boolean
  rights_html_edition: boolean
  rights_other: boolean
  rights_other_2: boolean
  group_ids: string[]
}

const UserForm = ({
  user,
  tenants,
  allGroups,
  mode,
  onClose,
}: UserFormProps) => {
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const isEditMode = mode === 'edit'
  const isDuplicateMode = mode === 'duplicate'
  const canDelete = isEditMode && user?.id

  const clientNameMap = useMemo(() => {
    const map: Record<string, string> = {}
    tenants.forEach((tenant) => {
      if (tenant.id) map[tenant.id] = tenant.name
    })
    return map
  }, [tenants])

  const tenantOptions = useMemo(
    () =>
      tenants.map((tenant) => ({
        value: tenant.id,
        label: tenant.name,
        disabled: false,
      })),
    [tenants],
  )

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

  const groupTreeItems: CheckboxTreeItem[] = useMemo(
    () =>
      allGroups.map((g) => ({
        id: g.id,
        label: g.name,
        parentId: g.parent_id ?? undefined,
      })),
    [allGroups],
  )

  const userRights = useMemo(() => {
    if (!user?.rights) return {}
    return user.rights
  }, [user])

  const userGroupIds = useMemo(() => {
    if ('group_ids' in (user ?? {})) {
      return (user as AdminDetailDto)?.group_ids ?? []
    }
    return []
  }, [user])

  const form = useForm<FormData>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      client_id: '',
      status: AdminStatus.ACTIVE,
      rights_users_creation: false,
      rights_html_edition: false,
      rights_other: false,
      rights_other_2: false,
      group_ids: [],
    },
  })

  useEffect(() => {
    if (user && (isEditMode || isDuplicateMode)) {
      form.reset({
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        email: isDuplicateMode ? '' : user.email ?? '',
        password: '',
        client_id: user.client_id ?? '',
        status: (user.status as AdminStatus) || AdminStatus.ACTIVE,
        rights_users_creation: !!userRights?.users_creation,
        rights_html_edition: !!userRights?.html_edition,
        rights_other: !!userRights?.other,
        rights_other_2: !!userRights?.other_2,
        group_ids: userGroupIds,
      })
    } else {
      form.reset()
    }
    setHasChanges(false)
  }, [user, mode, form, isEditMode, isDuplicateMode, userRights, userGroupIds])

  useEffect(() => {
    const subscription = form.watch(() => {
      setHasChanges(true)
    })
    return () => subscription.unsubscribe()
  }, [form])

  const createMutation = useCreateAdmin()
  const updateMutation = useUpdateAdmin()
  const deleteMutation = useDeleteAdmin()

  const onSubmit = async (data: FormData) => {
    try {
      const rights: Record<string, boolean> = {
        users_creation: data.rights_users_creation,
        html_edition: data.rights_html_edition,
        other: data.rights_other,
        other_2: data.rights_other_2,
      }

      if (isEditMode && user?.id) {
        const updateData: UpdateAdminDto = {
          email: data.email || undefined,
          first_name: data.first_name || undefined,
          last_name: data.last_name || undefined,
          status: data.status,
          rights,
          group_ids: data.group_ids,
        }
        await updateMutation.mutateAsync({
          id: user.id,
          data: updateData,
        })
      } else {
        const createData: CreateAdminDto = {
          email: data.email,
          password: data.password,
          role: AdminRole.CLIENT_ADMIN,
          first_name: data.first_name || undefined,
          last_name: data.last_name || undefined,
          client_id: data.client_id || undefined,
        }
        await createMutation.mutateAsync(createData)
      }

      setHasChanges(false)
      navigate({ to: '/admin/users' })
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleCopy = () => {
    if (user?.id) {
      navigate({
        to: '/admin/users/$userId/duplicate',
        params: { userId: user.id },
      })
    }
  }

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (user?.id) {
      await deleteMutation.mutateAsync(user.id)
      setShowDeleteModal(false)
      navigate({ to: '/admin/users' })
    }
  }

  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelModal(true)
    } else {
      onClose?.() || navigate({ to: '/admin/users' })
    }
  }

  const displayName = useMemo(() => {
    const first = form.watch('first_name')
    const last = form.watch('last_name')
    if (first || last) {
      return `${first ?? ''} ${last ?? ''}`.trim().toUpperCase()
    }
    return 'NEW USER'
  }, [form.watch('first_name'), form.watch('last_name')])

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending

  return (
    <div className="h-[90vh]">
      <ScrollArea
        title="Users"
        headerActions={
          <div className="flex items-center gap-2">
            <IconButton
              icon={Copy}
              variant="secondary"
              size="md"
              tooltip="Copy User"
              onClick={handleCopy}
              disabled={!user?.id || isSubmitting}
            />
            <IconButton
              icon={Save}
              variant="primary"
              size="md"
              tooltip="Save User"
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
          {/* User name banner */}
          <div className="rounded-md bg-midnight-light px-4 py-2">
            <span className="text-sm font-semibold text-white">
              {displayName}
            </span>
          </div>

          {/* Main fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Input
                label="Firstname"
                placeholder="Enter first name"
                control={form.control}
                name="first_name"
                rules={{ required: 'First name is required' }}
              />
              <Input
                label="Lastname"
                placeholder="Enter last name"
                control={form.control}
                name="last_name"
                rules={{ required: 'Last name is required' }}
              />
              <StatusSelector
                label="Status"
                control={form.control}
                name="status"
                rules={{ required: 'Status is required' }}
                options={statusOptions}
              />
              {isEditMode ? (
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-inputs-title mb-2">
                    Client
                  </label>
                  <div className="flex h-10 items-center text-sm text-inputs-text">
                    {user?.client_id
                      ? clientNameMap[user.client_id] ?? '-'
                      : '-'}
                  </div>
                </div>
              ) : (
                <Select
                  label="Client"
                  placeholder="Select a client"
                  control={form.control}
                  name="client_id"
                  options={tenantOptions}
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email"
                placeholder="Enter email"
                type="email"
                control={form.control}
                name="email"
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address',
                  },
                }}
              />
              <Input
                label="Password"
                placeholder={isEditMode ? '••••••••' : 'Enter password'}
                type="password"
                control={form.control}
                name="password"
                rules={
                  isEditMode
                    ? {}
                    : {
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters',
                        },
                      }
                }
              />
            </div>
          </div>

          {/* Rights & Accesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* RIGHTS */}
            <Collapsible title="RIGHTS" defaultExpanded>
              <div className="grid grid-cols-2 gap-4">
                <Checkbox
                  label="Users creation"
                  control={form.control}
                  name="rights_users_creation"
                />
                <Checkbox
                  label="HTML edition"
                  control={form.control}
                  name="rights_html_edition"
                />
                <Checkbox
                  label="Other rights"
                  control={form.control}
                  name="rights_other"
                />
                <Checkbox
                  label="Other rights 2"
                  control={form.control}
                  name="rights_other_2"
                />
              </div>
            </Collapsible>

            {/* ACCESSES */}
            <Collapsible title="ACCESSES" defaultExpanded>
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
        title="Delete User"
        message={`Are you sure you want to delete "${user?.first_name ?? ''} ${user?.last_name ?? ''}"? This action cannot be undone.`}
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
        onConfirm={() => onClose?.() || navigate({ to: '/admin/users' })}
        variant="warning"
      />
    </div>
  )
}

export default UserForm
