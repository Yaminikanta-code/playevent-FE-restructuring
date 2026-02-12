import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTeamById } from '../../../../api/team.api'
import { useTenantList } from '../../../../api/tenant.api'
import TeamForm from '../../../../components/admin/teams/TeamForm'
import { authRedirect } from '@/lib/authRedirect'

export const Route = createFileRoute('/admin/assets/team-members/$teamId')({
  beforeLoad: authRedirect,
  component: TeamEditPage,
})

function TeamEditPage() {
  const { teamId } = Route.useParams()
  const navigate = useNavigate()

  const { data: team, isLoading: teamLoading } = useTeamById(teamId)
  const { data: tenantData, isLoading: tenantsLoading } = useTenantList({
    page: 1,
    page_size: 100,
  })

  const tenants = tenantData?.data ?? []

  if (teamLoading || tenantsLoading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    )
  }

  if (!team) {
    return (
      <div className="flex items-center justify-center h-64">
        Team not found
      </div>
    )
  }

  return (
    <div className="relative">
      <TeamForm
        team={team}
        tenants={tenants}
        mode="edit"
        onClose={() => navigate({ to: '/admin/assets/team-members' })}
      />
    </div>
  )
}
