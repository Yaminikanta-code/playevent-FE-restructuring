import { useEffect, useMemo, useState } from 'react'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import type React from 'react'
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
  useCreateTeam,
  useDeleteTeam,
  useUpdateTeam,
} from '../../../api/team.api'
import { TeamStatus } from '../../../types/team.types'
import type {
  TeamCreate,
  TeamMember,
  TeamRead,
  TeamUpdate,
} from '../../../types/team.types'
import type { TenantOutDto } from '../../../types/tenant.types'

type FormMode = 'new' | 'edit' | 'duplicate'

interface TeamFormProps {
  team?: TeamRead | null
  tenants: TenantOutDto[]
  mode: FormMode
  onClose?: () => void
}

interface MemberFormData {
  full_name: string
  photo: string
  index: number | string
  position: string
  kit_number: string
  status: TeamStatus
}

interface FormData {
  name: string
  client_id: string
  status: TeamStatus
  members: MemberFormData[]
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

const normalizeMembers = (members: MemberFormData[]) =>
  members.map((member, index) => ({
    ...member,
    index,
  }))

const TeamForm = ({ team, tenants, mode, onClose }: TeamFormProps) => {
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const isEditMode = mode === 'edit'
  const isDuplicateMode = mode === 'duplicate'
  const canDelete = isEditMode && team?.id

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

  const memberStatusOptions: Array<StatusOption> = [
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

  const positionOptions = [
    { value: 'undefined', label: 'Undefined', disabled: false },
    { value: 'forward', label: 'Forward', disabled: false },
    { value: 'defender', label: 'Defender', disabled: false },
    { value: 'midfielder', label: 'Midfielder', disabled: false },
    { value: 'goalkeeper', label: 'Goalkeeper', disabled: false },
  ]

  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      client_id: '',
      status: TeamStatus.ACTIVE,
      members: [],
    },
  })

  const { fields, append, replace, move } = useFieldArray<FormData>({
    control: form.control,
    name: 'members',
  })

  const watchedMembers = useWatch<FormData, 'members'>({
    control: form.control,
    name: 'members',
  })

  useEffect(() => {
    if (team && (isEditMode || isDuplicateMode)) {
      const mappedMembers: MemberFormData[] =
        team.members?.map((member: TeamMember) => ({
          full_name: member.full_name,
          photo: member.photo,
          index: member.index,
          position: member.position,
          kit_number: String(member.kit_number ?? ''),
          status: member.status || 'active',
        })) ?? []

      form.reset({
        name: team.name,
        client_id: team.client_id ?? '',
        status: team.status || 'active',
        members: normalizeMembers(mappedMembers),
      })
    } else {
      form.reset()
    }
    setHasChanges(false)
  }, [team, mode, form, isEditMode, isDuplicateMode])

  useEffect(() => {
    const subscription = form.watch(() => {
      setHasChanges(true)
    })
    return () => subscription.unsubscribe()
  }, [form])

  const createMutation = useCreateTeam()
  const updateMutation = useUpdateTeam()
  const deleteMutation = useDeleteTeam()

  const onSubmit = async (data: FormData) => {
    try {
      const normalizedMembers = normalizeMembers(
        data.members.map((member) => ({
          ...member,
          index: Number(member.index ?? 0),
          kit_number: String(member.kit_number ?? ''),
          photo: member.photo || '',
        })),
      ).map((member) => ({
        ...member,
        index: Number(member.index ?? 0),
        kit_number: Number(member.kit_number || 0),
      }))

      const formData: TeamCreate | TeamUpdate = {
        name: data.name,
        client_id: data.client_id || undefined,
        status: data.status,
        members: normalizedMembers,
      }

      if (isEditMode && team?.id) {
        await updateMutation.mutateAsync({
          id: team.id,
          data: formData as TeamUpdate,
        })
      } else {
        await createMutation.mutateAsync(formData as TeamCreate)
      }

      setHasChanges(false)
      navigate({ to: '/admin/assets/team-members' })
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleCopy = () => {
    if (team?.id) {
      navigate({
        to: '/admin/assets/team-members/$teamId/duplicate',
        params: { teamId: team.id },
      })
    }
  }

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (team?.id) {
      await deleteMutation.mutateAsync(team.id)
      setShowDeleteModal(false)
      navigate({ to: '/admin/assets/team-members' })
    }
  }

  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelModal(true)
    } else {
      onClose?.() || navigate({ to: '/admin/assets/team-members' })
    }
  }

  const handleAddMember = () => {
    append({
      full_name: '',
      photo: '',
      index: fields.length,
      position: '',
      kit_number: '0',
      status: TeamStatus.ACTIVE,
    })
  }

  const handleRemoveMember = (index: number) => {
    const current = form.getValues('members') || []
    const updated = normalizeMembers(current.filter((_, idx) => idx !== index))
    replace(updated)
  }

  const handleDuplicateMember = (index: number) => {
    const member = form.getValues(`members.${index}`)
    const current = form.getValues('members') || []
    const duplicate = {
      ...member,
      index: index + 1,
    }
    const updated = normalizeMembers([
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
    const updated = normalizeMembers(form.getValues('members'))
    replace(updated)
  }

  const getFormTitle = () => {
    if (isEditMode) return 'Edit Team'
    if (isDuplicateMode) return 'Duplicate Team'
    return 'New Team'
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
              tooltip="Copy Team"
              onClick={handleCopy}
              disabled={!team?.id || isSubmitting}
            />
            <IconButton
              icon={Save}
              variant="primary"
              size="md"
              tooltip="Save Team"
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
            <div className="text-sm font-semibold text-inputs-title">Team</div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Team Name"
                placeholder="Enter team name"
                control={form.control}
                name="name"
                rules={{ required: 'Team name is required' }}
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

          <Collapsible title="MEMBERS" defaultExpanded={true}>
            <div className="space-y-4">
              {fields.length === 0 && (
                <div className="rounded-lg border border-dashed border-inputs-border bg-inputs-background p-6 text-center text-inputs-text">
                  No members added yet
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
                          watchedMembers?.[index]?.full_name || 'New Member'
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
                                    onClick={() => handleDuplicateMember(index)}
                                    tooltip="Duplicate member"
                                  />,
                                  <IconButton
                                    key={`delete-${field.id}`}
                                    icon={Trash2}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveMember(index)}
                                    tooltip="Delete member"
                                  />,
                                ]}
                              >
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                      label="Fullname"
                                      placeholder="Enter full name"
                                      control={form.control}
                                      name={`members.${index}.full_name`}
                                      rules={{
                                        required: 'Full name is required',
                                      }}
                                    />

                                    <Input
                                      label="Photo"
                                      placeholder="https://..."
                                      control={form.control}
                                      name={`members.${index}.photo`}
                                    />
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Input
                                      label="N°"
                                      type="number"
                                      placeholder="0"
                                      control={form.control}
                                      name={`members.${index}.kit_number`}
                                      min={0}
                                      rules={{
                                        required: 'Number is required',
                                        min: {
                                          value: 0,
                                          message: 'Number cannot be negative',
                                        },
                                      }}
                                    />

                                    <Select
                                      label="Position"
                                      placeholder="Select position"
                                      control={form.control}
                                      name={`members.${index}.position`}
                                      rules={{
                                        required: 'Position is required',
                                      }}
                                      options={positionOptions}
                                    />

                                    <StatusSelector
                                      label="Status"
                                      control={form.control}
                                      name={`members.${index}.status`}
                                      rules={{ required: 'Status is required' }}
                                      options={memberStatusOptions}
                                    />
                                  </div>
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
                  onClick={handleAddMember}
                >
                  Add a member
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
        title="Delete Team"
        message={`Are you sure you want to delete "${team?.name}"? This action cannot be undone.`}
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
          onClose?.() || navigate({ to: '/admin/assets/team-members' })
        }
        variant="warning"
      />
    </div>
  )
}

export default TeamForm
