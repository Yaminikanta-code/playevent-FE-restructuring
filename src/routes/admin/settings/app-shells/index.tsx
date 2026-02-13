import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Plus, ChevronLeft, ChevronRight, Copy, Trash2 } from 'lucide-react'
import { Table, ConfirmationModal } from '../../../../components/common'
import type { Column, Action } from '../../../../components/common/Table'
import {
  useAppShellList,
  useDeleteAppShell,
} from '../../../../api/app-shell.api'
import type { AppShellOutDto } from '../../../../types/app-shell.types'
import { useTenantList } from '../../../../api/tenant.api'
import type { TenantOutDto } from '../../../../types/tenant.types'
import { useState, useMemo } from 'react'
import { authRedirect } from '@/lib/authRedirect'

export const Route = createFileRoute('/admin/settings/app-shells/')({
  beforeLoad: authRedirect,
  component: AppShellsPage,
})

const PAGE_SIZE = 5

type AppShellWithClient = AppShellOutDto & {
  client_name?: string
}

const appShellColumns: Column<AppShellWithClient>[] = [
  {
    key: 'client_name',
    title: 'Client',
    sortable: true,
    render: (value: string | undefined) => value ?? '-',
  },
  {
    key: 'name',
    title: 'Name',
    sortable: true,
    render: (value: string) => <span className="font-medium">{value}</span>,
  },
  {
    key: 'status',
    title: 'Status',
    sortable: true,
  },
  {
    key: 'navigation_type',
    title: 'Navigation',
    render: (value: string | undefined) => value ?? '-',
  },
]

function AppShellsPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [appShellToDelete, setAppShellToDelete] =
    useState<AppShellWithClient | null>(null)

  const { data: appShellData, isLoading } = useAppShellList({
    page,
    page_size: PAGE_SIZE,
  })
  const deleteMutation = useDeleteAppShell()
  const appShells = appShellData?.data ?? []
  const totalCount = appShellData?.count ?? 0
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const { data: tenantData } = useTenantList({
    page: 1,
    page_size: 100,
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

  const appShellsWithClientName: AppShellWithClient[] = useMemo(() => {
    return appShells.map((shell: AppShellOutDto) => ({
      ...shell,
      client_name: shell.client_id ? clientNameMap[shell.client_id] : undefined,
    }))
  }, [appShells, clientNameMap])

  const handleView = (shell: AppShellWithClient) => {
    if (shell.id) {
      navigate({
        to: '/admin/settings/app-shells/$appShellId',
        params: { appShellId: shell.id },
      })
    }
  }

  const handleCopy = (shell: AppShellWithClient) => {
    if (shell.id) {
      navigate({
        to: '/admin/settings/app-shells/$appShellId/duplicate',
        params: { appShellId: shell.id },
      })
    }
  }

  const handleDelete = (shell: AppShellWithClient) => {
    setAppShellToDelete(shell)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (appShellToDelete?.id) {
      await deleteMutation.mutateAsync(appShellToDelete.id)
      setShowDeleteModal(false)
      setAppShellToDelete(null)
    }
  }

  const handleNew = () => {
    navigate({ to: '/admin/settings/app-shells/new' })
  }

  const appShellActions: Action<AppShellWithClient>[] = [
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
            App Shells {totalCount > 0 && `(${totalCount})`}
          </h2>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-4 py-2 bg-divers-button text-white rounded-lg hover:opacity-90 transition"
          >
            <Plus className="h-5 w-5" />
            <span>New</span>
          </button>
        </div>

        <Table<AppShellWithClient>
          data={appShellsWithClientName}
          columns={appShellColumns}
          actions={appShellActions}
          onRowClick={handleView}
          loading={isLoading}
          emptyMessage="No app shells found"
          searchable
          searchPlaceholder="Search App Shells..."
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

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete App Shell"
        message={`Are you sure you want to delete "${appShellToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        variant="danger"
      />
    </div>
  )
}
