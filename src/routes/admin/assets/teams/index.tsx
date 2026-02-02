import { createFileRoute } from '@tanstack/react-router'
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Table } from '../../../../components/common'
import type { Column, Action } from '../../../../components/common/Table'
import { useTeamList } from '../../../../api/team.api'
import type { TeamRead } from '../../../../types/team.types'
import { useTenantList } from '../../../../api/tenant.api'
import type { TenantOutDto } from '../../../../types/tenant.types'
import { useState, useMemo } from 'react'
import { authRedirect } from '@/lib/authRedirect'

export const Route = createFileRoute('/admin/assets/teams/')({
  beforeLoad: authRedirect,
  component: TeamsPage,
})

const PAGE_SIZE = 5

type TeamReadWithClient = TeamRead & {
  client_name?: string
}

const teamColumns: Column<TeamReadWithClient>[] = [
  {
    key: 'client_name',
    title: 'Client',
    sortable: true,
    render: (value: string | undefined) => value ?? '-',
  },
  {
    key: 'name',
    title: 'Team Name',
    sortable: true,
    render: (value: string) => <span className="font-medium">{value}</span>,
  },
  {
    key: 'members',
    title: 'Members',
    align: 'center',
    render: (value: TeamReadWithClient['members']) => value?.length ?? 0,
  },
]

function TeamsPage() {
  const [page, setPage] = useState(1)

  const { data: teamData, isLoading: teamsLoading } = useTeamList({
    page,
    page_size: PAGE_SIZE,
  })
  const teams = teamData?.data ?? []
  const totalCount = teamData?.count ?? 0
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const { data: tenantData } = useTenantList({
    page: 1,
    page_size: 1000,
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

  const teamsWithClientName: TeamReadWithClient[] = useMemo(() => {
    return teams.map((team: TeamRead) => ({
      ...team,
      client_name: team.client_id ? clientNameMap[team.client_id] : undefined,
    }))
  }, [teams, clientNameMap])

  const handleView = (team: TeamReadWithClient) => {
    console.log('View team:', team)
  }

  const handleEdit = (team: TeamReadWithClient) => {
    console.log('Edit team:', team)
  }

  const handleDelete = (team: TeamReadWithClient) => {
    console.log('Delete team:', team)
  }

  const teamActions: Action<TeamReadWithClient>[] = [
    {
      icon: Eye,
      label: 'View',
      onClick: handleView,
      variant: 'ghost',
    },
    {
      icon: Pencil,
      label: 'Edit',
      onClick: handleEdit,
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
      <h1 className="text-3xl font-bold text-foreground mb-6">Team Members</h1>
      <div className="bg-inputs-background border border-inputs-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-inputs-title">
            {totalCount > 0 && `Teams (${totalCount})`}
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-divers-button text-white rounded-lg hover:opacity-90 transition">
            <Plus className="h-5 w-5" />
            <span>New</span>
          </button>
        </div>

        <Table<TeamReadWithClient>
          data={teamsWithClientName}
          columns={teamColumns}
          actions={teamActions}
          loading={teamsLoading}
          emptyMessage="No teams found"
          searchable
          searchPlaceholder="Search Team..."
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
