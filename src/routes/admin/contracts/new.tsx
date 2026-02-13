import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTenantList } from '@/api/tenant.api'
import { useGroupList } from '@/api/group.api'
import ContractForm from '@/components/admin/contracts/ContractForm'
import { authRedirect } from '@/lib/authRedirect'

export const Route = createFileRoute('/admin/contracts/new')({
  beforeLoad: authRedirect,
  component: ContractNewPage,
})

function ContractNewPage() {
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
      <ContractForm
        contract={null}
        tenants={tenants}
        allGroups={groups}
        mode="new"
        onClose={() => navigate({ to: '/admin/contracts' })}
      />
    </div>
  )
}
