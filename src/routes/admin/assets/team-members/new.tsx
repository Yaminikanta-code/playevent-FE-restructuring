import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTenantList } from '../../../../api/tenant.api'
import TeamForm from '../../../../components/admin/teams/TeamForm'
import { authRedirect } from '@/lib/authRedirect'

export const Route = createFileRoute('/admin/assets/team-members/new')({
  beforeLoad: authRedirect,
  component: TeamNewPage,
})

function TeamNewPage() {
  const navigate = useNavigate()

  const { data: tenantData, isLoading: tenantsLoading } = useTenantList({
    page: 1,
    page_size: 200,
  })

  const tenants = tenantData?.data ?? []

  if (tenantsLoading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    )
  }

  return (
    <div className="relative">
      <TeamForm
        team={null}
        tenants={tenants}
        mode="new"
        onClose={() => navigate({ to: '/admin/assets/team-members' })}
      />
    </div>
  )
}
