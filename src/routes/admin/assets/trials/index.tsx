import { createFileRoute } from '@tanstack/react-router'
import { Plus, ChevronLeft, ChevronRight, Copy, Trash2 } from 'lucide-react'
import { Table } from '../../../../components/common'
import type { Column, Action } from '../../../../components/common/Table'
import { useTrialList } from '../../../../api/trial.api'
import type { TrialRead } from '../../../../types/trial.types'
import { useTenantList } from '../../../../api/tenant.api'
import type { TenantOutDto } from '../../../../types/tenant.types'
import { useState, useMemo } from 'react'
import { authRedirect } from '@/lib/authRedirect'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/assets/trials/')({
  beforeLoad: authRedirect,
  component: TrialsPage,
})

const PAGE_SIZE = 5

type TrialReadWithClient = TrialRead & {
  client_name?: string
}

const trialColumns: Column<TrialReadWithClient>[] = [
  {
    key: 'client_name',
    title: 'Client',
    sortable: true,
    render: (value: string | undefined) => value ?? '-',
  },
  {
    key: 'name',
    title: 'Trial Name',
    sortable: true,
    render: (value: string) => <span className="font-medium">{value}</span>,
  },
  {
    key: 'started_at',
    title: 'Start Date',
    sortable: true,
    render: (value: string | undefined) => {
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
    key: 'ends_at',
    title: 'End Date',
    sortable: true,
    render: (value: string | undefined) => {
      if (!value) return '-'
      const date = new Date(value)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    },
  },
]

function TrialsPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)

  const { data: trialData, isLoading: trialsLoading } = useTrialList({
    page,
    page_size: PAGE_SIZE,
  })
  const trials = trialData?.data ?? []
  const totalCount = trialData?.count ?? 0
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

  const trialsWithClientName: TrialReadWithClient[] = useMemo(() => {
    return trials.map((trial: TrialRead) => ({
      ...trial,
      client_name: trial.client_id ? clientNameMap[trial.client_id] : undefined,
    }))
  }, [trials, clientNameMap])

  const handleView = (trial: TrialReadWithClient) => {
    if (trial.id) {
      navigate({
        to: '/admin/assets/trials/$trialId',
        params: { trialId: trial.id },
      })
    }
  }

  const handleCopy = (trial: TrialReadWithClient) => {
    if (trial.id) {
      navigate({
        to: '/admin/assets/trials/$trialId/duplicate',
        params: { trialId: trial.id },
      })
    }
  }

  const handleDelete = (trial: TrialReadWithClient) => {
    console.log('Delete trial:', trial)
  }

  const handleNew = () => {
    navigate({ to: '/admin/assets/trials/new' })
  }

  const trialActions: Action<TrialReadWithClient>[] = [
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
            Trials {totalCount > 0 && `(${totalCount})`}
          </h2>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-4 py-2 bg-divers-button text-white rounded-lg hover:opacity-90 transition"
          >
            <Plus className="h-5 w-5" />
            <span>New</span>
          </button>
        </div>

        <Table<TrialReadWithClient>
          data={trialsWithClientName}
          columns={trialColumns}
          actions={trialActions}
          onRowClick={handleView}
          loading={trialsLoading}
          emptyMessage="No trials found"
          searchable
          searchPlaceholder="Search Trial..."
          searchableFields={['name', 'client_name']}
          defaultSortColumn="started_at"
          defaultSortDirection="desc"
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
