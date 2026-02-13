import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTenantById } from '@/api/tenant.api'
import ClientStepForm from '@/components/admin/clients/ClientStepForm'
import { authRedirect } from '@/lib/authRedirect'

export const Route = createFileRoute('/admin/clients/$clientId')({
  beforeLoad: authRedirect,
  component: ClientResumePage,
})

function ClientResumePage() {
  const navigate = useNavigate()
  const { clientId } = Route.useParams()

  const { data: client, isLoading } = useTenantById(clientId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    )
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        Client not found
      </div>
    )
  }

  return (
    <div className="relative">
      <ClientStepForm
        existingClient={client}
        onClose={() => navigate({ to: '/admin/clients' })}
      />
    </div>
  )
}
