import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTenantList } from '../../../../api/tenant.api'
import AppShellForm from '../../../../components/admin/appShells/AppShellForm'
import { authRedirect } from '@/lib/authRedirect'

export const Route = createFileRoute('/admin/settings/app-shells/new')({
  beforeLoad: authRedirect,
  component: AppShellNewPage,
})

function AppShellNewPage() {
  const navigate = useNavigate()

  const { data: tenantData, isLoading: tenantsLoading } = useTenantList({
    page: 1,
    page_size: 100,
  })

  const tenants = tenantData?.data ?? []

  if (tenantsLoading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    )
  }

  return (
    <div className="relative">
      <AppShellForm
        appShell={null}
        tenants={tenants}
        mode="new"
        onClose={() => navigate({ to: '/admin/settings/app-shells' })}
      />
    </div>
  )
}
