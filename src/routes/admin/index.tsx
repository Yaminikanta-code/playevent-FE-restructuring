import { createFileRoute } from '@tanstack/react-router'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { Table } from '../../components/common'
import type { Column } from '../../components/common/Table'
import { useTenantList } from '../../api/tenant.api'
import type { TenantOutDto } from '../../types/tenant.types'

import { useState } from 'react'
import { authRedirect } from '@/lib/authRedirect'
export const Route = createFileRoute('/admin/')({
  beforeLoad: authRedirect,
  component: AdminDashboard,
})

const PAGE_SIZE = 5

const columns: Column<TenantOutDto>[] = [
  {
    key: 'name',
    title: 'Client Name',
    sortable: true,
    render: (value: string) => (
      <span className="font-medium uppercase">{value}</span>
    ),
  },
  {
    key: 'total_events',
    title: 'Events',
    align: 'center',
    render: (value: number | undefined) => value ?? '-',
  },
  {
    key: 'units',
    title: 'Units',
    align: 'center',
    render: () => '-',
  },
  {
    key: 'total_users',
    title: 'Participants',
    align: 'right',
    render: (value: number | undefined) =>
      value !== undefined ? value.toLocaleString() : '-',
  },
]

function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading } = useTenantList({
    page: currentPage,
    page_size: PAGE_SIZE,
  })

  const tenants = data?.data ?? []
  const totalCount = data?.count ?? 0
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-inputs-background border border-inputs-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-inputs-title mb-2">
            Users
          </h2>
          <p className="text-inputs-text">
            Manage system users and permissions
          </p>
        </div>
        <div className="bg-inputs-background border border-inputs-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-inputs-title mb-2">
            Modules
          </h2>
          <p className="text-inputs-text">Configure and activate modules</p>
        </div>
        <div className="bg-inputs-background border border-inputs-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-inputs-title mb-2">
            Settings
          </h2>
          <p className="text-inputs-text">
            System configuration and preferences
          </p>
        </div>
      </div>
      <div className="mt-8 bg-inputs-background border border-inputs-border rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-inputs-title mb-4">
          Recent Activity
        </h2>
        <p className="text-inputs-text">No recent activity to display.</p>
      </div>

      {/* Clients Table Section */}
      <div className="mt-8 bg-inputs-background border border-inputs-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-inputs-title">
            Clients {totalCount > 0 && `(${totalCount})`}
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-divers-button text-white rounded-lg hover:opacity-90 transition">
            <Plus className="h-5 w-5" />
            <span>New</span>
          </button>
        </div>

        <Table<TenantOutDto>
          data={tenants}
          columns={columns}
          loading={isLoading}
          emptyMessage="No clients found"
          searchable
          searchPlaceholder="Search Client..."
          searchableFields={['name']}
          defaultSortColumn="name"
          defaultSortDirection="asc"
        />

        {/* Server-side Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-end items-center gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-xl font-medium transition ${
                  page === currentPage
                    ? 'bg-divers-button text-white'
                    : 'border border-white/10 hover:bg-white/5 text-inputs-text'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
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
