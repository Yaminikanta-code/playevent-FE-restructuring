import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import { MoreVertical, Save, Copy, Trash2, X } from 'lucide-react'
import ScrollArea from '../../../components/common/ScrollArea'
import IconButton from '../../../components/common/IconButton'
import ContextMenu from '../../../components/common/ContextMenu'
import Input from '../../../components/common/Input'
import Select from '../../../components/common/Select'
import DatePicker from '../../../components/common/DatePicker'
import Textarea from '../../../components/common/Textarea'
import type {
  TrialRead,
  TrialCreate,
  TrialUpdate,
} from '../../../types/trial.types'
import type { TenantOutDto } from '../../../types/tenant.types'
import {
  useCreateTrial,
  useUpdateTrial,
  useDeleteTrial,
} from '../../../api/trial.api'
import ConfirmationModal from '../../../components/common/ConfirmationModal'

type FormMode = 'new' | 'edit' | 'duplicate'

interface TrialFormProps {
  trial?: TrialRead | null
  tenants: TenantOutDto[]
  mode: FormMode
  onClose?: () => void
}

interface FormData {
  name: string
  client_id: string
  status: string
  started_at: string
  ends_at: string
  data: string
}

const TrialForm = ({ trial, tenants, mode, onClose }: TrialFormProps) => {
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const isEditMode = mode === 'edit'
  const isDuplicateMode = mode === 'duplicate'
  const canDelete = isEditMode && trial?.id

  const tenantOptions = tenants.map((tenant) => ({
    value: tenant.id,
    label: tenant.name,
    disabled: false,
  }))

  const statusOptions = [
    { value: 'active', label: 'Active', disabled: false },
    { value: 'inactive', label: 'Inactive', disabled: false },
    { value: 'pending', label: 'Pending', disabled: false },
    { value: 'completed', label: 'Completed', disabled: false },
  ]

  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      client_id: '',
      status: 'pending',
      started_at: '',
      ends_at: '',
      data: '',
    },
  })

  useEffect(() => {
    if (trial && (isEditMode || isDuplicateMode)) {
      form.reset({
        name: trial.name,
        client_id: trial.client_id,
        status: trial.status || 'pending',
        started_at: trial.started_at ? trial.started_at.split('T')[0] : '',
        ends_at: trial.ends_at ? trial.ends_at.split('T')[0] : '',
        data: trial.data ? JSON.stringify(trial.data, null, 2) : '',
      })
    } else {
      form.reset()
    }
    setHasChanges(false)
  }, [trial, mode, form])

  useEffect(() => {
    const subscription = form.watch(() => {
      setHasChanges(true)
    })
    return () => subscription.unsubscribe()
  }, [form])

  const createMutation = useCreateTrial()
  const updateMutation = useUpdateTrial()
  const deleteMutation = useDeleteTrial()

  const onSubmit = async (data: FormData) => {
    try {
      let parsedData: Record<string, any> | undefined
      try {
        parsedData = data.data ? JSON.parse(data.data) : undefined
      } catch {
        parsedData = undefined
      }

      const formData: TrialCreate | TrialUpdate = {
        name: data.name,
        client_id: data.client_id,
        status: data.status,
        started_at: data.started_at
          ? new Date(data.started_at).toISOString()
          : undefined,
        ends_at: data.ends_at
          ? new Date(data.ends_at).toISOString()
          : undefined,
        data: parsedData,
      }

      if (isEditMode && trial?.id) {
        await updateMutation.mutateAsync({
          id: trial.id,
          data: formData as TrialUpdate,
        })
      } else {
        await createMutation.mutateAsync(formData as TrialCreate)
      }

      setHasChanges(false)
      navigate({ to: '/admin/assets/trials' })
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleCopy = () => {
    if (trial?.id) {
      navigate({
        to: '/admin/assets/trials/$trialId/duplicate',
        params: { trialId: trial.id },
      })
    }
  }

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (trial?.id) {
      await deleteMutation.mutateAsync(trial.id)
      setShowDeleteModal(false)
      navigate({ to: '/admin/assets/trials' })
    }
  }

  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelModal(true)
    } else {
      onClose?.() || navigate({ to: '/admin/assets/trials' })
    }
  }

  const getFormTitle = () => {
    if (isEditMode) return 'Edit Trial'
    if (isDuplicateMode) return 'Duplicate Trial'
    return 'New Trial'
  }

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending

  return (
    <div className="relative">
      <ScrollArea
        title={getFormTitle()}
        headerActions={
          <div className="flex items-center gap-2">
            <IconButton
              icon={Copy}
              variant="secondary"
              size="md"
              tooltip="Copy Trial"
              onClick={handleCopy}
              disabled={isSubmitting}
            />
            <IconButton
              icon={Save}
              variant="primary"
              size="md"
              tooltip="Save Trial"
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
          <Input
            label="Trial Name"
            placeholder="Enter trial name"
            control={form.control}
            name="name"
            rules={{ required: 'Trial name is required' }}
          />

          <Select
            label="Client"
            placeholder="Select a client"
            control={form.control}
            name="client_id"
            rules={{ required: 'Client is required' }}
            options={tenantOptions}
          />

          <Select
            label="Status"
            placeholder="Select status"
            control={form.control}
            name="status"
            rules={{ required: 'Status is required' }}
            options={statusOptions}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DatePicker
              label="Start Date"
              placeholder="Select start date"
              control={form.control}
              name="started_at"
            />

            <DatePicker
              label="End Date"
              placeholder="Select end date"
              control={form.control}
              name="ends_at"
              min={form.watch('started_at') || undefined}
            />
          </div>

          <Textarea
            label="Data (JSON)"
            placeholder="Enter additional data as JSON"
            control={form.control}
            name="data"
            rows={6}
            helperText="Enter valid JSON object for additional trial data"
          />
        </form>
      </ScrollArea>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Trial"
        message={`Are you sure you want to delete "${trial?.name}"? This action cannot be undone.`}
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
          onClose?.() || navigate({ to: '/admin/assets/trials' })
        }
        variant="warning"
      />
    </div>
  )
}

export default TrialForm
