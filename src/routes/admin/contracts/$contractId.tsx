import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useContractById } from '@/api/contract.api'
import { useTenantList } from '@/api/tenant.api'
import { useGroupList } from '@/api/group.api'
import ContractForm from '@/components/admin/contracts/ContractForm'
import { authRedirect } from '@/lib/authRedirect'

export const Route = createFileRoute('/admin/contracts/$contractId')({
  beforeLoad: authRedirect,
  component: ContractEditPage,
})

function ContractEditPage() {
  const { contractId } = Route.useParams()
  const navigate = useNavigate()

  const { data: contract, isLoading: contractLoading } =
    useContractById(contractId)
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

  if (contractLoading || tenantsLoading || groupsLoading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    )
  }

  if (!contract) {
    return (
      <div className="flex items-center justify-center h-64">
        Contract not found
      </div>
    )
  }

  return (
    <div className="relative">
      <ContractForm
        contract={contract}
        tenants={tenants}
        allGroups={allGroups}
        mode="edit"
        onClose={() => navigate({ to: '/admin/contracts' })}
      />
    </div>
  )
}
