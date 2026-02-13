import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useGroupById, useGroupList } from '@/api/group.api'
import { useTenantList } from '@/api/tenant.api'
import GroupForm from '@/components/admin/groups/GroupForm'
import { authRedirect } from '@/lib/authRedirect'

export const Route = createFileRoute('/admin/groups/$groupId')({
  beforeLoad: authRedirect,
  component: GroupEditPage,
})

function GroupEditPage() {
  const { groupId } = Route.useParams()
  const navigate = useNavigate()

  const { data: group, isLoading: groupLoading } = useGroupById(groupId)
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

  if (groupLoading || tenantsLoading || groupsLoading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    )
  }

  if (!group) {
    return (
      <div className="flex items-center justify-center h-64">
        Group not found
      </div>
    )
  }

  return (
    <div className="relative">
      <GroupForm
        group={group}
        tenants={tenants}
        allGroups={allGroups}
        mode="edit"
        onClose={() => navigate({ to: '/admin/groups' })}
      />
    </div>
  )
}
