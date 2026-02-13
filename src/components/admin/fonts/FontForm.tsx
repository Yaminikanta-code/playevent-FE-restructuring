import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import { MoreVertical, Save, Trash2, X } from 'lucide-react'
import {
  Button,
  Collapsible,
  ConfirmationModal,
  ContextMenu,
  IconButton,
  Input,
  ScrollArea,
} from '../../common'
import {
  useCreateFont,
  useDeleteFont,
  useUpdateFont,
} from '../../../api/font.api'
import type { CreateFontDto, FontOutDto } from '../../../types/font.types'

type FormMode = 'new' | 'edit'

interface FontFormProps {
  font?: FontOutDto | null
  mode: FormMode
  onClose?: () => void
}

interface FormData {
  name: string
  regular: string
  bold: string
  italic: string
}

const FontForm = ({ font, mode, onClose }: FontFormProps) => {
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const isEditMode = mode === 'edit'
  const canDelete = isEditMode && font?.id

  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      regular: '',
      bold: '',
      italic: '',
    },
  })

  useEffect(() => {
    if (font && isEditMode) {
      form.reset({
        name: font.name,
        regular: font.regular,
        bold: font.bold,
        italic: font.italic,
      })
    } else {
      form.reset()
    }
    setHasChanges(false)
  }, [font, mode, form])

  useEffect(() => {
    const subscription = form.watch(() => {
      setHasChanges(true)
    })
    return () => subscription.unsubscribe()
  }, [form])

  const createMutation = useCreateFont()
  const updateMutation = useUpdateFont()
  const deleteMutation = useDeleteFont()

  const onSubmit = async (data: FormData) => {
    try {
      const formData: CreateFontDto = {
        name: data.name,
        regular: data.regular,
        bold: data.bold,
        italic: data.italic,
      }

      if (isEditMode && font?.id) {
        await updateMutation.mutateAsync({
          id: font.id,
          data: formData,
        })
      } else {
        await createMutation.mutateAsync(formData)
      }

      setHasChanges(false)
      navigate({ to: '/admin/settings/fonts' })
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (font?.id) {
      await deleteMutation.mutateAsync(font.id)
      setShowDeleteModal(false)
      navigate({ to: '/admin/settings' })
    }
  }

  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelModal(true)
    } else {
      onClose?.()
    }
  }

  const getFormTitle = () => {
    if (isEditMode) return 'Edit Font'
    return 'New Font'
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
              icon={Save}
              variant="primary"
              size="md"
              tooltip="Save Font"
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
          <Collapsible title="FONT DETAILS" defaultExpanded={true}>
            <div className="space-y-4">
              <Input
                label="Name"
                placeholder="Enter font name"
                control={form.control}
                name="name"
                rules={{ required: 'Font name is required' }}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Regular URL"
                  placeholder="https://..."
                  control={form.control}
                  name="regular"
                  rules={{ required: 'Regular URL is required' }}
                />

                <Input
                  label="Bold URL"
                  placeholder="https://..."
                  control={form.control}
                  name="bold"
                  rules={{ required: 'Bold URL is required' }}
                />

                <Input
                  label="Italic URL"
                  placeholder="https://..."
                  control={form.control}
                  name="italic"
                  rules={{ required: 'Italic URL is required' }}
                />
              </div>
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
        title="Delete Font"
        message={`Are you sure you want to delete "${font?.name}"? This action cannot be undone.`}
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
        onConfirm={() => onClose?.()}
        variant="warning"
      />
    </div>
  )
}

export default FontForm
