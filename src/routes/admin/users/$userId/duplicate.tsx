import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAdminById } from '@/api/admin.api'
import { useTenantList } from '@/api/tenant.api'
import { useGroupList } from '@/api/group.api'
import UserForm from '@/components/admin/users/UserForm'
import { authRedirect } from '@/lib/authRedirect'

export const Route = createFileRoute('/admin/users/$userId/duplicate')({
  beforeLoad: authRedirect,
  component: UserDuplicatePage,
})

function UserDuplicatePage() {
  const { userId } = Route.useParams()
  const navigate = useNavigate()

  const { data: user, isLoading: userLoading } = useAdminById(userId)
  const { data: tenantData, isLoading: tenantsLoading } = useTenantList({
    page: 1,
    page_size: 100,
  })
  const { data: groupData, isLoading: groupsLoading } = useGroupList({
    page: 1,
    page_size: 100,
  })

  const tenants = tenantData?.data ?? []
  const allGroups = groupData?.data ?? []

  if (userLoading || tenantsLoading || groupsLoading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        User not found
      </div>
    )
  }

  return (
    <div className="relative">
      <UserForm
        user={user}
        tenants={tenants}
        allGroups={allGroups}
        mode="duplicate"
        onClose={() => navigate({ to: '/admin/users' })}
      />
    </div>
  )
}
