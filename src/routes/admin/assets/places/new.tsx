import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTenantList } from '@/api/tenant.api'
import PlaceForm from '@/components/admin/places/PlaceForm'
import { authRedirect } from '@/lib/authRedirect'

export const Route = createFileRoute('/admin/assets/places/new')({
  beforeLoad: authRedirect,
  component: PlaceNewPage,
})

function PlaceNewPage() {
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
      <PlaceForm
        place={null}
        tenants={tenants}
        mode="new"
        onClose={() => navigate({ to: '/admin/assets/places' })}
      />
    </div>
  )
}
