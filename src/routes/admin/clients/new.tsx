import { createFileRoute, useNavigate } from '@tanstack/react-router'
import ClientStepForm from '@/components/admin/clients/ClientStepForm'
import { authRedirect } from '@/lib/authRedirect'

export const Route = createFileRoute('/admin/clients/new')({
  beforeLoad: authRedirect,
  component: ClientNewPage,
})

function ClientNewPage() {
  const navigate = useNavigate()

  return (
    <div className="relative">
      <ClientStepForm
        onClose={() => navigate({ to: '/admin/clients' })}
      />
    </div>
  )
}
