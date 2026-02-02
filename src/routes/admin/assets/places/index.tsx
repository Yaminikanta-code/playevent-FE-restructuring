import { createFileRoute } from '@tanstack/react-router'
import { Plus, ChevronLeft, ChevronRight, Copy, Trash2 } from 'lucide-react'
import { Table } from '../../../../components/common'
import type { Column, Action } from '../../../../components/common/Table'
import { usePlaceList } from '../../../../api/place.api'
import type { PlaceRead } from '../../../../types/place.types'
import { useTenantList } from '../../../../api/tenant.api'
import type { TenantOutDto } from '../../../../types/tenant.types'
import { useState, useMemo } from 'react'
import { authRedirect } from '@/lib/authRedirect'

export const Route = createFileRoute('/admin/assets/places/')({
  beforeLoad: authRedirect,
  component: PlacesPage,
})

const PAGE_SIZE = 5

type PlaceReadWithClient = PlaceRead & {
  client_name?: string
}

const placeColumns: Column<PlaceReadWithClient>[] = [
  {
    key: 'client_name',
    title: 'Client',
    sortable: true,
    render: (value: string | undefined) => value ?? '-',
  },
  {
    key: 'name',
    title: 'Place Name',
    sortable: true,
    render: (value: string) => <span className="font-medium">{value}</span>,
  },
  {
    key: 'subplaces',
    title: 'Subplace',
    align: 'center',
    render: (value: PlaceReadWithClient['subplaces']) => value?.length ?? 0,
  },
]

function PlacesPage() {
  const [page, setPage] = useState(1)

  const { data: placeData, isLoading: placesLoading } = usePlaceList({
    page,
    page_size: PAGE_SIZE,
  })
  const places = placeData?.data ?? []
  const totalCount = placeData?.count ?? 0
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const { data: tenantData } = useTenantList({
    page: 1,
    page_size: 200,
  })
  const tenants = tenantData?.data ?? []

  const clientNameMap = useMemo(() => {
    const map: Record<string, string> = {}
    tenants.forEach((tenant: TenantOutDto) => {
      if (tenant.id) {
        map[tenant.id] = tenant.name
      }
    })
    return map
  }, [tenants])

  const placesWithClientName: PlaceReadWithClient[] = useMemo(() => {
    return places.map((place: PlaceRead) => ({
      ...place,
      client_name: place.client_id ? clientNameMap[place.client_id] : undefined,
    }))
  }, [places, clientNameMap])

  const handleView = (place: PlaceReadWithClient) => {
    console.log('View place:', place)
  }

  const handleCopy = (place: PlaceReadWithClient) => {
    console.log('Copy place:', place)
  }

  const handleDelete = (place: PlaceReadWithClient) => {
    console.log('Delete place:', place)
  }

  const placeActions: Action<PlaceReadWithClient>[] = [
    {
      icon: Copy,
      label: 'Copy',
      onClick: handleCopy,
      variant: 'ghost',
    },
    {
      icon: Trash2,
      label: 'Delete',
      onClick: handleDelete,
      variant: 'destructive',
    },
  ]

  return (
    <div>
      <div className="bg-inputs-background border border-inputs-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-inputs-title">
            Places {totalCount > 0 && `(${totalCount})`}
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-divers-button text-white rounded-lg hover:opacity-90 transition">
            <Plus className="h-5 w-5" />
            <span>New</span>
          </button>
        </div>

        <Table<PlaceReadWithClient>
          data={placesWithClientName}
          columns={placeColumns}
          actions={placeActions}
          onRowClick={handleView}
          loading={placesLoading}
          emptyMessage="No places found"
          searchable
          searchPlaceholder="Search Place..."
          searchableFields={['name', 'client_name']}
          defaultSortColumn="name"
          defaultSortDirection="asc"
        />

        {totalPages > 1 && (
          <div className="mt-8 flex justify-end items-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`px-4 py-2 rounded-xl font-medium transition ${
                    pageNumber === page
                      ? 'bg-divers-button text-white'
                      : 'border border-white/10 hover:bg-white/5 text-inputs-text'
                  }`}
                >
                  {pageNumber}
                </button>
              ),
            )}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
