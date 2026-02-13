import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Plus, ChevronLeft, ChevronRight, Copy, Trash2 } from 'lucide-react'
import { Table, ConfirmationModal } from '@/components/common'
import type { Column, Action } from '@/components/common/Table'
import { useContractList, useDeleteContract } from '@/api/contract.api'
import type { ContractOutDto } from '@/types/contract.types'
import { useTenantList } from '@/api/tenant.api'
import type { TenantOutDto } from '@/types/tenant.types'
import { useState, useMemo } from 'react'
import { authRedirect } from '@/lib/authRedirect'

export const Route = createFileRoute('/admin/contracts/')({
  beforeLoad: authRedirect,
  component: ContractsPage,
})

const PAGE_SIZE = 5

type ContractWithExtra = ContractOutDto & {
  client_name?: string
  date_range?: string
}

const contractColumns: Column<ContractWithExtra>[] = [
  {
    key: 'name',
    title: 'Name',
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
    key: 'date_range',
    title: 'Date Range',
    sortable: false,
    render: (value: string | undefined) => value ?? '-',
  },
  {
    key: 'total_events',
    title: 'Events',
    sortable: true,
    render: (value: number) => (
      <span className="font-medium">{value}</span>
    ),
  },
]

function ContractsPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [contractToDelete, setContractToDelete] =
    useState<ContractWithExtra | null>(null)

  const { data: contractData, isLoading: contractsLoading } = useContractList({
    page,
    page_size: PAGE_SIZE,
  })
  const deleteMutation = useDeleteContract()
  const contracts = contractData?.data ?? []
  const totalCount = contractData?.count ?? 0
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const { data: tenantData } = useTenantList({
    page: 1,
    page_size: 100,
  })
  const tenants = tenantData?.data ?? []

  const clientNameMap = useMemo(() => {
    const map: Record<string, string> = {}
    tenants.forEach((tenant: TenantOutDto) => {
      if (tenant.id) map[tenant.id] = tenant.name
    })
    return map
  }, [tenants])

  const contractsWithExtra: ContractWithExtra[] = useMemo(() => {
    return contracts.map((contract: ContractOutDto) => ({
      ...contract,
      client_name: contract.client_id
        ? clientNameMap[contract.client_id]
        : undefined,
      date_range: `${contract.start_date} - ${contract.end_date}`,
    }))
  }, [contracts, clientNameMap])

  const handleView = (contract: ContractWithExtra) => {
    if (contract.id) {
      navigate({
        to: '/admin/contracts/$contractId',
        params: { contractId: contract.id },
      })
    }
  }

  const handleCopy = (contract: ContractWithExtra) => {
    if (contract.id) {
      navigate({
        to: '/admin/contracts/$contractId/duplicate',
        params: { contractId: contract.id },
      })
    }
  }

  const handleDelete = (contract: ContractWithExtra) => {
    setContractToDelete(contract)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (contractToDelete?.id) {
      await deleteMutation.mutateAsync(contractToDelete.id)
      setShowDeleteModal(false)
      setContractToDelete(null)
    }
  }

  const handleNew = () => {
    navigate({ to: '/admin/contracts/new' })
  }

  const contractActions: Action<ContractWithExtra>[] = [
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
            Contracts {totalCount > 0 && `(${totalCount})`}
          </h2>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-4 py-2 bg-divers-button text-white rounded-lg hover:opacity-90 transition"
          >
            <Plus className="h-5 w-5" />
            <span>New Contract</span>
          </button>
        </div>

        <Table<ContractWithExtra>
          data={contractsWithExtra}
          columns={contractColumns}
          actions={contractActions}
          onRowClick={handleView}
          loading={contractsLoading}
          emptyMessage="No contracts found"
          searchable
          searchPlaceholder="Search Contract..."
          searchableFields={['name', 'client_name', 'date_range']}
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
        message={`You are about to remove **${contractToDelete?.name}**.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        variant="danger"
      />
    </div>
  )
}
