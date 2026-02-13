import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTenantList } from '@/api/tenant.api'
import GroupForm from '@/components/admin/groups/GroupForm'
import { authRedirect } from '@/lib/authRedirect'

export const Route = createFileRoute('/admin/groups/new')({
  beforeLoad: authRedirect,
  component: GroupNewPage,
})

function GroupNewPage() {
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
      <GroupForm
        group={null}
        tenants={tenants}
        mode="new"
        onClose={() => navigate({ to: '/admin/groups' })}
      />
    </div>
  )
}
