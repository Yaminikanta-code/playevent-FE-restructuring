import { createFileRoute } from '@tanstack/react-router'
import { Plus, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { Table } from '../../components/common'
import type { Column } from '../../components/common/Table'
import { useTenantList } from '../../api/tenant.api'
import type { TenantOutDto } from '../../types/tenant.types'
import { useEventList } from '../../api/event.api'
import type { EventRead } from '../../types/event.types'

import { useState } from 'react'
import { authRedirect } from '@/lib/authRedirect'
export const Route = createFileRoute('/admin/dashboard')({
  beforeLoad: authRedirect,
  component: AdminDashboard,
})

const PAGE_SIZE = 5

const tenantColumns: Column<TenantOutDto>[] = [
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

const eventColumns: Column<EventRead>[] = [
  {
    key: 'name',
    title: 'Event Name',
    sortable: true,
    render: (value: string) => (
      <span className="font-medium">{value}</span>
    ),
  },
  {
    key: 'client_name',
    title: 'Client',
    sortable: true,
    render: (value: string | undefined) => value ?? '-',
  },
  {
    key: 'start_at',
    title: 'Date',
    sortable: true,
    render: (value: string) => {
      if (!value) return '-'
      const date = new Date(value)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    },
  },
  {
    key: 'status',
    title: 'Status',
    align: 'center',
    render: (value: string | undefined) => {
      const statusColors: Record<string, string> = {
        not_started: 'bg-gray-500/20 text-gray-400',
        in_progress: 'bg-blue-500/20 text-blue-400',
        completed: 'bg-green-500/20 text-green-400',
        cancelled: 'bg-red-500/20 text-red-400',
      }
      const statusLabel = value?.replace(/_/g, ' ') ?? 'Unknown'
      return (
        <span className={`px-2 py-1 rounded-full text-xs capitalize ${statusColors[value ?? ''] ?? 'bg-gray-500/20 text-gray-400'}`}>
          {statusLabel}
        </span>
      )
    },
  },
  {
    key: 'bookmark',
    title: '',
    align: 'center',
    width: '50px',
    render: (value: boolean | undefined) => (
      <Star
        className={`h-5 w-5 ${value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500'}`}
      />
    ),
  },
]

function AdminDashboard() {
  const [tenantPage, setTenantPage] = useState(1)
  const [eventPage, setEventPage] = useState(1)

  // Tenants data
  const { data: tenantData, isLoading: tenantsLoading } = useTenantList({
    page: tenantPage,
    page_size: PAGE_SIZE,
  })
  const tenants = tenantData?.data ?? []
  const tenantTotalCount = tenantData?.count ?? 0
  const tenantTotalPages = Math.ceil(tenantTotalCount / PAGE_SIZE)

  // Events data
  const { data: eventData, isLoading: eventsLoading } = useEventList({
    page: eventPage,
    page_size: PAGE_SIZE,
  })
  const events = eventData?.data ?? []
  const eventTotalCount = eventData?.count ?? 0
  const eventTotalPages = Math.ceil(eventTotalCount / PAGE_SIZE)

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
            Clients {tenantTotalCount > 0 && `(${tenantTotalCount})`}
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-divers-button text-white rounded-lg hover:opacity-90 transition">
            <Plus className="h-5 w-5" />
            <span>New</span>
          </button>
        </div>

        <Table<TenantOutDto>
          data={tenants}
          columns={tenantColumns}
          loading={tenantsLoading}
          emptyMessage="No clients found"
          searchable
          searchPlaceholder="Search Client..."
          searchableFields={['name']}
          defaultSortColumn="name"
          defaultSortDirection="asc"
        />

        {/* Server-side Pagination */}
        {tenantTotalPages > 1 && (
          <div className="mt-8 flex justify-end items-center gap-3">
            <button
              disabled={tenantPage === 1}
              onClick={() => setTenantPage((p) => p - 1)}
              className="p-2 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {Array.from({ length: tenantTotalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setTenantPage(page)}
                className={`px-4 py-2 rounded-xl font-medium transition ${
                  page === tenantPage
                    ? 'bg-divers-button text-white'
                    : 'border border-white/10 hover:bg-white/5 text-inputs-text'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={tenantPage === tenantTotalPages}
              onClick={() => setTenantPage((p) => p + 1)}
              className="p-2 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Events Table Section */}
      <div className="mt-8 bg-inputs-background border border-inputs-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-inputs-title">
            Events {eventTotalCount > 0 && `(${eventTotalCount})`}
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-divers-button text-white rounded-lg hover:opacity-90 transition">
            <Plus className="h-5 w-5" />
            <span>New</span>
          </button>
        </div>

        <Table<EventRead>
          data={events}
          columns={eventColumns}
          loading={eventsLoading}
          emptyMessage="No events found"
          searchable
          searchPlaceholder="Search Event..."
          searchableFields={['name', 'client_name']}
          defaultSortColumn="start_at"
          defaultSortDirection="desc"
        />

        {/* Server-side Pagination */}
        {eventTotalPages > 1 && (
          <div className="mt-8 flex justify-end items-center gap-3">
            <button
              disabled={eventPage === 1}
              onClick={() => setEventPage((p) => p - 1)}
              className="p-2 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {Array.from({ length: eventTotalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setEventPage(page)}
                className={`px-4 py-2 rounded-xl font-medium transition ${
                  page === eventPage
                    ? 'bg-divers-button text-white'
                    : 'border border-white/10 hover:bg-white/5 text-inputs-text'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={eventPage === eventTotalPages}
              onClick={() => setEventPage((p) => p + 1)}
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
