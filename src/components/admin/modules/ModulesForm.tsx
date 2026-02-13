import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Save } from 'lucide-react'
import Input from '../../common/Input'
import Select from '../../common/Select'
import ScrollArea from '../../common/ScrollArea'
import IconButton from '../../common/IconButton'
import Collapsible from '../../common/Collapsible'
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
  }, [existingModules, form])

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
    } catch (error) {
      console.error('Form submission error:', error)
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
          <IconButton
            icon={Save}
            variant="secondary"
            size="md"
            tooltip="Save Modules"
            onClick={() => form.handleSubmit(onSubmit)()}
            isLoading={isSubmitting}
          />
        }
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Collapsible title="MODULES" defaultExpanded={true}>
            <div className="space-y-4">
              {MOCK_MODULES.map((module) => (
                <div
                  key={module.name}
                  className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start"
                >
                  <div className="font-medium text-inputs-title flex items-center">
                    {module.name}
                  </div>

                  <Select
                    label="Status"
                    placeholder="Select status"
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

                  <Select
                    label="Default Status"
                    placeholder="Select default status"
                    control={form.control}
                    name={`${module.name}.default_status`}
                    options={MODULE_STATUS_OPTIONS}
                    rules={{ required: 'Default status is required' }}
                  />
                </div>
              ))}
            </div>
          </Collapsible>
        </form>
      </ScrollArea>
    </div>
  )
}

export default ModulesForm
