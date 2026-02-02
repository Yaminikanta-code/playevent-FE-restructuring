import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTenantList } from '../../../../api/tenant.api'
import TrialForm from '../../../../components/admin/trials/TrialForm'
import { authRedirect } from '@/lib/authRedirect'

export const Route = createFileRoute('/admin/assets/trials/new')({
  beforeLoad: authRedirect,
  component: TrialNewPage,
})

function TrialNewPage() {
  const navigate = useNavigate()

  const { data: tenantData, isLoading: tenantsLoading } = useTenantList({
    page: 1,
    page_size: 1000,
  })

  const tenants = tenantData?.data ?? []

  if (tenantsLoading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    )
  }

  return (
    <div className="relative">
      <TrialForm
        trial={null}
        tenants={tenants}
        mode="new"
        onClose={() => navigate({ to: '/admin/assets/trials' })}
      />
    </div>
  )
}
