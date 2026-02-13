import { useEffect, useMemo, useState } from 'react'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import {
  Copy,
  GripVertical,
  MoreVertical,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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
  type StatusOption,
} from '../../common'
import {
  useCreatePlace,
  useDeletePlace,
  useUpdatePlace,
} from '../../../api/place.api'
import { PlaceStatus } from '../../../types/place.types'
import type {
  PlaceCreate,
  PlaceRead,
  PlaceUpdate,
  Subplace,
} from '../../../types/place.types'
import type { TenantOutDto } from '../../../types/tenant.types'

type FormMode = 'new' | 'edit' | 'duplicate'

interface PlaceFormProps {
  place?: PlaceRead | null
  tenants: TenantOutDto[]
  mode: FormMode
  onClose?: () => void
}

interface SubplaceFormData {
  id: string
  name: string
  number_of_winners: string
  index: number | string
  status: PlaceStatus
}

interface FormData {
  name: string
  client_id: string
  status: PlaceStatus
  subplaces: SubplaceFormData[]
}

interface SortableItemProps {
  id: string
  children: (dragHandle: React.ReactNode) => React.ReactNode
}

const SortableItem = ({ id, children }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : undefined,
  }

  const dragHandle = (
    <button
      type="button"
      className="inline-flex items-center justify-center rounded-sm p-1 text-inputs-title hover:bg-inputs-background cursor-grab active:cursor-grabbing"
      title="Drag to reorder"
      {...attributes}
      {...listeners}
    >
      <GripVertical size={16} />
    </button>
  )

  return (
    <div ref={setNodeRef} style={style}>
      {children(dragHandle)}
    </div>
  )
}

const createSubplaceId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `subplace-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const normalizeSubplaces = (subplaces: SubplaceFormData[]) =>
  subplaces.map((subplace, index) => ({
    ...subplace,
    index,
  }))

const PlaceForm = ({ place, tenants, mode, onClose }: PlaceFormProps) => {
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const isEditMode = mode === 'edit'
  const isDuplicateMode = mode === 'duplicate'
  const canDelete = isEditMode && place?.id

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
      status: PlaceStatus.ACTIVE,
      subplaces: [],
    },
  })

  const { fields, append, replace, move } = useFieldArray<FormData>({
    control: form.control,
    name: 'subplaces',
  })

  const watchedSubplaces = useWatch<FormData, 'subplaces'>({
    control: form.control,
    name: 'subplaces',
  })

  useEffect(() => {
    if (place && (isEditMode || isDuplicateMode)) {
      const mappedSubplaces: SubplaceFormData[] =
        place.subplaces?.map((subplace: Subplace) => ({
          id: subplace.id,
          name: subplace.name,
          number_of_winners: String(subplace.number_of_winners ?? ''),
          index: subplace.index,
          status: subplace.status || PlaceStatus.ACTIVE,
        })) ?? []

      form.reset({
        name: place.name,
        client_id: place.client_id ?? '',
        status: place.status || PlaceStatus.ACTIVE,
        subplaces: normalizeSubplaces(mappedSubplaces),
      })
    } else {
      form.reset()
    }
    setHasChanges(false)
  }, [place, mode, form, isEditMode, isDuplicateMode])

  useEffect(() => {
    const subscription = form.watch(() => {
      setHasChanges(true)
    })
    return () => subscription.unsubscribe()
  }, [form])

  const createMutation = useCreatePlace()
  const updateMutation = useUpdatePlace()
  const deleteMutation = useDeletePlace()

  const onSubmit = async (data: FormData) => {
    try {
      const normalizedSubplaces = normalizeSubplaces(
        data.subplaces.map((subplace) => ({
          ...subplace,
          id: subplace.id || createSubplaceId(),
          number_of_winners: String(subplace.number_of_winners ?? ''),
          index: Number(subplace.index ?? 0),
        })),
      ).map((subplace) => ({
        ...subplace,
        number_of_winners: Number(subplace.number_of_winners || 0),
        index: Number(subplace.index ?? 0),
      }))

      const formData: PlaceCreate | PlaceUpdate = {
        name: data.name,
        client_id: data.client_id || undefined,
        status: data.status,
        subplaces: normalizedSubplaces,
      }

      if (isEditMode && place?.id) {
        await updateMutation.mutateAsync({
          id: place.id,
          data: formData as PlaceUpdate,
        })
      } else {
        await createMutation.mutateAsync(formData as PlaceCreate)
      }

      setHasChanges(false)
      navigate({ to: '/admin/assets/places' })
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleCopy = () => {
    if (place?.id) {
      navigate({
        to: '/admin/assets/places/$placeId/duplicate',
        params: { placeId: place.id },
      })
    }
  }

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (place?.id) {
      await deleteMutation.mutateAsync(place.id)
      setShowDeleteModal(false)
      navigate({ to: '/admin/assets/places' })
    }
  }

  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelModal(true)
    } else {
      onClose?.() || navigate({ to: '/admin/assets/places' })
    }
  }

  const handleAddSubplace = () => {
    append({
      id: createSubplaceId(),
      name: '',
      number_of_winners: '1',
      index: fields.length,
      status: PlaceStatus.ACTIVE,
    })
  }

  const handleRemoveSubplace = (index: number) => {
    const current = form.getValues('subplaces') || []
    const updated = normalizeSubplaces(
      current.filter((_, idx) => idx !== index),
    )
    replace(updated)
  }

  const handleDuplicateSubplace = (index: number) => {
    const subplace = form.getValues(`subplaces.${index}`)
    const current = form.getValues('subplaces') || []
    const duplicate = {
      ...subplace,
      id: createSubplaceId(),
      index: index + 1,
    }
    const updated = normalizeSubplaces([
      ...current.slice(0, index + 1),
      duplicate,
      ...current.slice(index + 1),
    ])
    replace(updated)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = fields.findIndex((field) => field.id === active.id)
    const newIndex = fields.findIndex((field) => field.id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    move(oldIndex, newIndex)
    const updated = normalizeSubplaces(form.getValues('subplaces'))
    replace(updated)
  }

  const getFormTitle = () => {
    if (isEditMode) return 'Edit Place'
    if (isDuplicateMode) return 'Duplicate Place'
    return 'New Place'
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
              tooltip="Copy Place"
              onClick={handleCopy}
              disabled={!place?.id || isSubmitting}
            />
            <IconButton
              icon={Save}
              variant="primary"
              size="md"
              tooltip="Save Place"
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
            <div className="text-sm font-semibold text-inputs-title">Place</div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Place Name"
                placeholder="Enter place name"
                control={form.control}
                name="name"
                rules={{ required: 'Place name is required' }}
              />

              <Select
                label="Client"
                placeholder="Select a client"
                control={form.control}
                name="client_id"
                rules={{ required: 'Client is required' }}
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

          <Collapsible title="SUB PLACE" defaultExpanded={true}>
            <div className="space-y-4">
              {fields.length === 0 && (
                <div className="rounded-lg border border-dashed border-inputs-border bg-inputs-background p-6 text-center text-inputs-text">
                  No sub places added yet
                </div>
              )}

              {fields.length > 0 && (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={fields.map((field) => field.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4">
                      {fields.map((field, index) => {
                        const titleName =
                          watchedSubplaces?.[index]?.name || 'New Sub Place'
                        const titlePrefix = `#${index} - ${titleName}`

                        return (
                          <SortableItem key={field.id} id={field.id}>
                            {(dragHandle) => (
                              <Collapsible
                                title={titlePrefix}
                                defaultExpanded={true}
                                actions={[
                                  dragHandle,
                                  <IconButton
                                    key={`copy-${field.id}`}
                                    icon={Copy}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleDuplicateSubplace(index)
                                    }
                                    tooltip="Duplicate sub place"
                                  />,
                                  <IconButton
                                    key={`delete-${field.id}`}
                                    icon={Trash2}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveSubplace(index)}
                                    tooltip="Delete sub place"
                                  />,
                                ]}
                              >
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <Input
                                      label="Sub place name"
                                      placeholder="Enter sub place name"
                                      control={form.control}
                                      name={`subplaces.${index}.name`}
                                      rules={{
                                        required: 'Sub place name is required',
                                      }}
                                    />

                                    <Input
                                      label="Number of winners"
                                      type="number"
                                      placeholder="0"
                                      control={form.control}
                                      name={`subplaces.${index}.number_of_winners`}
                                      min={0}
                                      rules={{
                                        required:
                                          'Number of winners is required',
                                        min: {
                                          value: 0,
                                          message:
                                            'Number of winners cannot be negative',
                                        },
                                      }}
                                    />

                                    <Input
                                      label="Index"
                                      type="number"
                                      placeholder="0"
                                      control={form.control}
                                      name={`subplaces.${index}.index`}
                                      min={0}
                                      disabled
                                      helperText="Auto-generated index"
                                    />

                                    <StatusSelector
                                      label="Status"
                                      control={form.control}
                                      name={`subplaces.${index}.status`}
                                      rules={{ required: 'Status is required' }}
                                      options={statusOptions}
                                    />
                                  </div>

                                  <Input
                                    label="Sub place id"
                                    placeholder="Auto-generated"
                                    control={form.control}
                                    name={`subplaces.${index}.id`}
                                    disabled
                                  />
                                </div>
                              </Collapsible>
                            )}
                          </SortableItem>
                        )
                      })}
                    </div>
                  </SortableContext>
                </DndContext>
              )}

              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  icon={Plus}
                  onClick={handleAddSubplace}
                >
                  Add a sub place
                </Button>
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
        title="Delete Place"
        message={`Are you sure you want to delete "${place?.name}"? This action cannot be undone.`}
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
          onClose?.() || navigate({ to: '/admin/assets/places' })
        }
        variant="warning"
      />
    </div>
  )
}

export default PlaceForm
