import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  PlayCircle,
} from 'lucide-react'
import { Table, ConfirmationModal, StatusBadge } from '@/components/common'
import type { Column, Action } from '@/components/common/Table'
import { useTenantList, useDeleteTenant } from '@/api/tenant.api'
import type { TenantOutDto } from '@/types/tenant.types'
import { useState } from 'react'
import { authRedirect } from '@/lib/authRedirect'

export const Route = createFileRoute('/admin/clients/')({
  beforeLoad: authRedirect,
  component: ClientsPage,
})

const PAGE_SIZE = 5

const clientColumns: Column<TenantOutDto>[] = [
  {
    key: 'name',
    title: 'Name',
    sortable: true,
    render: (value: string) => (
      <span className="font-medium">{value}</span>
    ),
  },
  {
    key: 'short_name',
    title: 'Short Name',
    sortable: true,
    render: (value: string | undefined) => value ?? '-',
  },
  {
    key: 'activity_name',
    title: 'Activity',
    sortable: true,
    render: (value: string | undefined) => value ?? '-',
  },
  {
    key: 'status',
    title: 'Status',
    sortable: true,
    render: (value: string) => {
      const badgeStatus =
        value === 'archive' ? 'inactive' : (value as any)
      return <StatusBadge status={badgeStatus} label={value} />
    },
  },
  {
    key: 'creation_step',
    title: 'Setup Progress',
    sortable: false,
    render: (value: string | undefined) => {
      if (!value || value === 'completed') {
        return (
          <span className="text-xs font-medium text-statuszen-base">
            Completed
          </span>
        )
      }
      return (
        <span className="text-xs font-medium text-statuswarning-base">
          In progress ({value})
        </span>
      )
    },
  },
]

function ClientsPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<TenantOutDto | null>(
    null,
  )

  const { data: tenantData, isLoading } = useTenantList({
    page,
    page_size: PAGE_SIZE,
  })
  const deleteMutation = useDeleteTenant()
  const clients = tenantData?.data ?? []
  const totalCount = tenantData?.count ?? 0
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const handleView = (client: TenantOutDto) => {
    if (client.creation_step && client.creation_step !== 'completed') {
      navigate({
        to: '/admin/clients/$clientId',
        params: { clientId: client.id },
      })
    }
  }

  const handleResume = (client: TenantOutDto) => {
    navigate({
      to: '/admin/clients/$clientId',
      params: { clientId: client.id },
    })
  }

  const handleDelete = (client: TenantOutDto) => {
    setClientToDelete(client)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (clientToDelete?.id) {
      await deleteMutation.mutateAsync(clientToDelete.id)
      setShowDeleteModal(false)
      setClientToDelete(null)
    }
  }

  const handleNew = () => {
    navigate({ to: '/admin/clients/new' })
  }

  const clientActions: Action<TenantOutDto>[] = [
    {
      icon: PlayCircle,
      label: 'Resume Setup',
      onClick: handleResume,
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
            Clients {totalCount > 0 && `(${totalCount})`}
          </h2>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-4 py-2 bg-divers-button text-white rounded-lg hover:opacity-90 transition"
          >
            <Plus className="h-5 w-5" />
            <span>New Client</span>
          </button>
        </div>

        <Table<TenantOutDto>
          data={clients}
          columns={clientColumns}
          actions={clientActions}
          onRowClick={handleView}
          loading={isLoading}
          emptyMessage="No clients found"
          searchable
          searchPlaceholder="Search Clients..."
          searchableFields={['name', 'short_name', 'activity_name']}
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

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Are you sure?"
        message={`You are about to remove **${clientToDelete?.name}**.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        variant="danger"
      />
    </div>
  )
}
