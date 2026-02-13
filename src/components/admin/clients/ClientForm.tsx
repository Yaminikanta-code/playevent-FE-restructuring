import { useForm } from 'react-hook-form'
import {
  Button,
  Input,
  StatusSelector,
  type StatusOption,
} from '../../common'
import {
  useCreateTenant,
} from '../../../api/tenant.api'
import { useCreateGroup } from '../../../api/group.api'
import { TenantStatus } from '../../../types/tenant.types'
import type { TenantOutDto } from '../../../types/tenant.types'

interface ClientFormData {
  name: string
  short_name: string
  status: TenantStatus
  activity_name: string
}

interface ClientFormProps {
  existingClient?: TenantOutDto | null
  /** Pre-computed root group name (when client already created) */
  rootGroupName?: string
  /** Called after successful creation with clientId, clientName */
  onSubmitSuccess: (clientId: string, clientName: string) => void
  /** Custom label for submit button */
  submitLabel?: string
}

const statusOptions: StatusOption[] = [
  { value: 'active', label: 'Active', colorClass: 'bg-statuszen-base' },
  { value: 'inactive', label: 'Inactive', colorClass: 'bg-statusneutral-base' },
]

const ClientForm = ({
  existingClient,
  rootGroupName: existingRootGroupName,
  onSubmitSuccess,
  submitLabel = 'Add a user >>',
}: ClientFormProps) => {
  const createTenantMutation = useCreateTenant()
  const createGroupMutation = useCreateGroup()

  const form = useForm<ClientFormData>({
    defaultValues: {
      name: existingClient?.name ?? '',
      short_name: existingClient?.short_name ?? '',
      status: (existingClient?.status as TenantStatus) ?? TenantStatus.ACTIVE,
      activity_name: existingClient?.activity_name ?? '',
    },
  })

  const watchedShortName = form.watch('short_name')
  const watchedName = form.watch('name')
  const rootGroupPreview = existingRootGroupName
    || (watchedShortName
      ? `${watchedShortName}_root`
      : watchedName
        ? `${watchedName.substring(0, 5)}_root`
        : '')

  const handleSubmit = async (data: ClientFormData) => {
    try {
      const result = await createTenantMutation.mutateAsync({
        name: data.name,
        short_name: data.short_name || undefined,
        status: data.status,
        activity_name: data.activity_name || undefined,
        creation_step: 'users',
      })

      const newClientId = result.id
      const shortName = data.short_name || data.name.substring(0, 5)

      // Auto-create root group
      const groupName = `${shortName}_root`
      try {
        await createGroupMutation.mutateAsync({
          name: groupName,
          client_id: newClientId,
        })
      } catch {
        // Non-critical — group creation may fail but we continue
      }

      onSubmitSuccess(newClientId, data.name)
    } catch (error) {
      console.error('Client creation error:', error)
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Client name"
            placeholder="Enter client name"
            control={form.control}
            name="name"
            rules={{ required: 'Client name is required' }}
          />
          <Input
            label="Client shortname"
            placeholder="Enter short name"
            control={form.control}
            name="short_name"
            rules={{
              maxLength: { value: 5, message: 'Max 5 characters' },
            }}
          />
          <StatusSelector
            label="Status"
            control={form.control}
            name="status"
            rules={{ required: 'Status is required' }}
            options={statusOptions}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Activity"
            placeholder="Enter activity name"
            control={form.control}
            name="activity_name"
          />
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-inputs-title mb-2">
              Root group
            </label>
            <div className="flex h-10 items-center text-sm text-inputs-text">
              {rootGroupPreview || '-'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={
            createTenantMutation.isPending || createGroupMutation.isPending
          }
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default ClientForm
