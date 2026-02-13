import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAppShellById } from '../../../../../api/app-shell.api'
import { useTenantList } from '../../../../../api/tenant.api'
import AppShellForm from '../../../../../components/admin/appShells/AppShellForm'
import { authRedirect } from '@/lib/authRedirect'

export const Route = createFileRoute(
  '/admin/settings/app-shells/$appShellId/duplicate',
)({
  beforeLoad: authRedirect,
  component: AppShellDuplicatePage,
})

function AppShellDuplicatePage() {
  const { appShellId } = Route.useParams()
  const navigate = useNavigate()

  const { data: appShell, isLoading: appShellLoading } =
    useAppShellById(appShellId)
  const { data: tenantData, isLoading: tenantsLoading } = useTenantList({
    page: 1,
    page_size: 100,
  })

  const tenants = tenantData?.data ?? []

  if (appShellLoading || tenantsLoading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    )
  }

  if (!appShell) {
    return (
      <div className="flex items-center justify-center h-64">
        App Shell not found
      </div>
    )
  }

  return (
    <div className="relative">
      <AppShellForm
        appShell={appShell}
        tenants={tenants}
        mode="duplicate"
        onClose={() => navigate({ to: '/admin/settings/app-shells' })}
      />
    </div>
  )
}
