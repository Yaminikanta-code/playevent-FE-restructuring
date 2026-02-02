import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTrialById } from '../../../../../api/trial.api'
import { useTenantList } from '../../../../../api/tenant.api'
import TrialForm from '../../../../../components/admin/trials/TrialForm'
import { authRedirect } from '@/lib/authRedirect'

export const Route = createFileRoute('/admin/assets/trials/$trialId/duplicate')(
  {
    beforeLoad: authRedirect,
    component: TrialDuplicatePage,
  },
)

function TrialDuplicatePage() {
  const { trialId } = Route.useParams()
  const navigate = useNavigate()

  const { data: trial, isLoading: trialLoading } = useTrialById(trialId)
  const { data: tenantData, isLoading: tenantsLoading } = useTenantList({
    page: 1,
    page_size: 200,
  })

  const tenants = tenantData?.data ?? []

  if (trialLoading || tenantsLoading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    )
  }

  if (!trial) {
    return (
      <div className="flex items-center justify-center h-64">
        Trial not found
      </div>
    )
  }

  return (
    <div className="relative">
      <TrialForm
        trial={trial}
        tenants={tenants}
        mode="duplicate"
        onClose={() => navigate({ to: '/admin/assets/trials' })}
      />
    </div>
  )
}
