import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTenantList } from '@/api/tenant.api'
import { useGroupList } from '@/api/group.api'
import UserForm from '@/components/admin/users/UserForm'
import { authRedirect } from '@/lib/authRedirect'

export const Route = createFileRoute('/admin/users/new')({
  beforeLoad: authRedirect,
  component: UserNewPage,
})

function UserNewPage() {
  const navigate = useNavigate()

  const { data: tenantData, isLoading: tenantsLoading } = useTenantList({
    page: 1,
    page_size: 100,
  })
  const { data: groupData, isLoading: groupsLoading } = useGroupList({
    page: 1,
    page_size: 100,
  })

  const tenants = tenantData?.data ?? []
  const groups = groupData?.data ?? []

  if (tenantsLoading || groupsLoading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    )
  }

  return (
    <div className="relative">
      <UserForm
        user={null}
        tenants={tenants}
        allGroups={groups}
        mode="new"
        onClose={() => navigate({ to: '/admin/users' })}
      />
    </div>
  )
}
