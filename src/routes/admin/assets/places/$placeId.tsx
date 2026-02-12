import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { usePlaceById } from '../../../../api/place.api'
import { useTenantList } from '../../../../api/tenant.api'
import PlaceForm from '../../../../components/admin/places/PlaceForm'
import { authRedirect } from '@/lib/authRedirect'

export const Route = createFileRoute('/admin/assets/places/$placeId')({
  beforeLoad: authRedirect,
  component: PlaceEditPage,
})

function PlaceEditPage() {
  const { placeId } = Route.useParams()
  const navigate = useNavigate()

  const { data: place, isLoading: placeLoading } = usePlaceById(placeId)
  const { data: tenantData, isLoading: tenantsLoading } = useTenantList({
    page: 1,
    page_size: 100,
  })

  const tenants = tenantData?.data ?? []

  if (placeLoading || tenantsLoading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    )
  }

  if (!place) {
    return (
      <div className="flex items-center justify-center h-64">
        Place not found
      </div>
    )
  }

  return (
    <div className="relative">
      <PlaceForm
        place={place}
        tenants={tenants}
        mode="edit"
        onClose={() => navigate({ to: '/admin/assets/places' })}
      />
    </div>
  )
}
