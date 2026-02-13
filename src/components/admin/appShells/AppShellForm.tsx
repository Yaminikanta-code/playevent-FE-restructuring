import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import { Copy, MoreVertical, Save, Trash2, X } from 'lucide-react'
import {
  Button,
  Collapsible,
  ConfirmationModal,
  ContextMenu,
  IconButton,
  Input,
  ScrollArea,
  Select,
  StatusSelector,
  Textarea,
  type StatusOption,
} from '../../common'
import {
  useCreateAppShell,
  useDeleteAppShell,
  useUpdateAppShell,
} from '../../../api/app-shell.api'
import { AppShellStatus } from '../../../types/app-shell.types'
import type {
  AppShellOutDto,
  CreateAppShellDto,
  UpdateAppShellDto,
} from '../../../types/app-shell.types'
import type { TenantOutDto } from '../../../types/tenant.types'

type FormMode = 'new' | 'edit' | 'duplicate'

interface AppShellFormProps {
  appShell?: AppShellOutDto | null
  tenants: TenantOutDto[]
  mode: FormMode
  onClose?: () => void
}

interface FormData {
  name: string
  client_id: string
  status: AppShellStatus
  shell_css: string
  navigation_type: string
  header_html: string
  footer_html: string
}

const AppShellForm = ({
  appShell,
  tenants,
  mode,
  onClose,
}: AppShellFormProps) => {
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const isEditMode = mode === 'edit'
  const isDuplicateMode = mode === 'duplicate'
  const canDelete = isEditMode && appShell?.id

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

  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      client_id: '',
      status: AppShellStatus.ACTIVE,
      shell_css: '',
      navigation_type: '',
      header_html: '',
      footer_html: '',
    },
  })

  useEffect(() => {
    if (appShell && (isEditMode || isDuplicateMode)) {
      form.reset({
        name: appShell.name,
        client_id: appShell.client_id ?? '',
        status: appShell.status || AppShellStatus.ACTIVE,
        shell_css: appShell.shell_css ?? '',
        navigation_type: appShell.navigation_type ?? '',
        header_html: appShell.header_html ?? '',
        footer_html: appShell.footer_html ?? '',
      })
    } else {
      form.reset()
    }
    setHasChanges(false)
  }, [appShell, mode, form, isEditMode, isDuplicateMode])

  useEffect(() => {
    const subscription = form.watch(() => {
      setHasChanges(true)
    })
    return () => subscription.unsubscribe()
  }, [form])

  const createMutation = useCreateAppShell()
  const updateMutation = useUpdateAppShell()
  const deleteMutation = useDeleteAppShell()

  const onSubmit = async (data: FormData) => {
    try {
      const formData: CreateAppShellDto | UpdateAppShellDto = {
        name: data.name,
        client_id: data.client_id || undefined,
        status: data.status,
        shell_css: data.shell_css || undefined,
        navigation_type: data.navigation_type || undefined,
        header_html: data.header_html || undefined,
        footer_html: data.footer_html || undefined,
      }

      if (isEditMode && appShell?.id) {
        await updateMutation.mutateAsync({
          id: appShell.id,
          data: formData as UpdateAppShellDto,
        })
      } else {
        await createMutation.mutateAsync(formData as CreateAppShellDto)
      }

      setHasChanges(false)
      navigate({ to: '/admin/settings/app-shells' })
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleCopy = () => {
    if (appShell?.id) {
      navigate({
        to: '/admin/settings/app-shells/$appShellId/duplicate',
        params: { appShellId: appShell.id },
      })
    }
  }

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (appShell?.id) {
      await deleteMutation.mutateAsync(appShell.id)
      setShowDeleteModal(false)
      navigate({ to: '/admin/settings/app-shells' })
    }
  }

  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelModal(true)
    } else {
      onClose?.() || navigate({ to: '/admin/settings/app-shells' })
    }
  }

  const getFormTitle = () => {
    if (isEditMode) return 'Edit App Shell'
    if (isDuplicateMode) return 'Duplicate App Shell'
    return 'New App Shell'
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
              tooltip="Copy App Shell"
              onClick={handleCopy}
              disabled={!appShell?.id || isSubmitting}
            />
            <IconButton
              icon={Save}
              variant="primary"
              size="md"
              tooltip="Save App Shell"
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
              App Shell
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Name"
                placeholder="Enter app shell name"
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

              <StatusSelector
                label="Status"
                control={form.control}
                name="status"
                rules={{ required: 'Status is required' }}
                options={statusOptions}
              />
            </div>
          </div>

          <Collapsible title="CONTENT" defaultExpanded={true}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Navigation Type"
                  placeholder="e.g. tabs, drawer, sidebar"
                  control={form.control}
                  name="navigation_type"
                />

                <Input
                  label="Shell CSS"
                  placeholder="e.g. flex flex-col gap-3"
                  control={form.control}
                  name="shell_css"
                />
              </div>

              <Textarea
                label="Header HTML"
                placeholder="Enter header HTML content"
                control={form.control}
                name="header_html"
                rows={4}
              />

              <Textarea
                label="Footer HTML"
                placeholder="Enter footer HTML content"
                control={form.control}
                name="footer_html"
                rows={4}
              />
            </div>
          </Collapsible>

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
        title="Delete App Shell"
        message={`Are you sure you want to delete "${appShell?.name}"? This action cannot be undone.`}
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
        onConfirm={() =>
          onClose?.() || navigate({ to: '/admin/settings/app-shells' })
        }
        variant="warning"
      />
    </div>
  )
}

export default AppShellForm
