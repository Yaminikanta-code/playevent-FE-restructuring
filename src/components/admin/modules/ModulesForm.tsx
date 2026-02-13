import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import { MoreVertical, Save, X } from 'lucide-react'
import {
  Collapsible,
  ConfirmationModal,
  ContextMenu,
  IconButton,
  Input,
  ScrollArea,
  StatusSelector,
} from '../../common'
import {
  MOCK_MODULES,
  MODULE_DEFAULT_STATUS_OPTIONS,
  MODULE_STATUS_OPTIONS,
} from '../../../constants/modules.constant'
import {
  useCreateModule,
  useModuleList,
  useUpdateModule,
} from '../../../api/module.api'
import { ModuleStatus } from '../../../types/module.types'
import type { ModuleOutDto } from '../../../types/module.types'

interface ModuleFormData {
  [key: string]: {
    status: string
    default_version: number
    default_status: string
  }
}

const ModulesForm = () => {
  const navigate = useNavigate()
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const { data: modulesData, isLoading } = useModuleList({
    page: 1,
    page_size: 100,
  })

  const existingModules = modulesData?.data ?? []
  const updateMutation = useUpdateModule()
  const createMutation = useCreateModule()

  const form = useForm<ModuleFormData>({
    defaultValues: {},
  })

  useEffect(() => {
    const defaultValues: ModuleFormData = {}
    MOCK_MODULES.forEach((module) => {
      const existingModule = existingModules.find(
        (m: ModuleOutDto) => m.type_name === module.name,
      )
      defaultValues[module.name] = {
        status: existingModule?.status || ModuleStatus.INACTIVE,
        default_version: existingModule?.default_version || 1,
        default_status: existingModule?.default_status || 'inactive',
      }
    })
    form.reset(defaultValues)
    setHasChanges(false)
  }, [existingModules, form])

  useEffect(() => {
    const subscription = form.watch(() => {
      setHasChanges(true)
    })
    return () => subscription.unsubscribe()
  }, [form])

  const onSubmit = async (data: ModuleFormData) => {
    try {
      const promises = Object.entries(data).map(
        async ([moduleName, moduleData]) => {
          const existingModule = existingModules.find(
            (m: ModuleOutDto) => m.type_name === moduleName,
          )

          if (existingModule?.id) {
            await updateMutation.mutateAsync({
              id: existingModule.id,
              data: {
                status: moduleData.status as ModuleStatus,
                default_version: moduleData.default_version,
                default_status: moduleData.default_status,
              },
            })
          } else {
            await createMutation.mutateAsync({
              type_name: moduleName,
              status: moduleData.status as ModuleStatus,
              default_version: moduleData.default_version,
              default_status: moduleData.default_status,
            })
          }
        },
      )

      await Promise.all(promises)
      setHasChanges(false)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelModal(true)
    } else {
      navigate({ to: '/admin/settings' })
    }
  }

  const isSubmitting = updateMutation.isPending || createMutation.isPending

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    )
  }

  return (
    <div className="relative h-[90vh]">
      <ScrollArea
        title="Modules"
        headerActions={
          <div className="flex items-center gap-2">
            <IconButton
              icon={Save}
              variant="primary"
              size="md"
              tooltip="Save Modules"
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {MOCK_MODULES.map((module) => (
            <Collapsible
              key={module.name}
              title={module.name}
              defaultExpanded={true}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatusSelector
                  label="Status"
                  control={form.control}
                  name={`${module.name}.status`}
                  options={MODULE_DEFAULT_STATUS_OPTIONS}
                />

                <Input
                  label="Default Version"
                  placeholder="Enter version"
                  type="number"
                  control={form.control}
                  name={`${module.name}.default_version`}
                  rules={{ required: 'Default version is required' }}
                />

                <StatusSelector
                  label="Default Status"
                  control={form.control}
                  name={`${module.name}.default_status`}
                  options={MODULE_STATUS_OPTIONS}
                  rules={{ required: 'Default status is required' }}
                />
              </div>
            </Collapsible>
          ))}
        </form>
      </ScrollArea>

      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Discard Changes"
        message="You have unsaved changes. Are you sure you want to cancel and discard these changes?"
        confirmText="Discard"
        cancelText="Keep Editing"
        onConfirm={() => navigate({ to: '/admin/settings' })}
        variant="warning"
      />
    </div>
  )
}

export default ModulesForm
