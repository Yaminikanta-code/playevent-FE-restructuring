import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Plus, ChevronLeft, ChevronRight, Copy, Trash2 } from 'lucide-react'
import { Table, ConfirmationModal } from '@/components/common'
import type { Column, Action } from '@/components/common/Table'
import { useGroupList, useDeleteGroup } from '@/api/group.api'
import type { GroupOutDto } from '@/types/group.types'
import { useTenantList } from '@/api/tenant.api'
import type { TenantOutDto } from '@/types/tenant.types'
import { useState, useMemo } from 'react'
import { authRedirect } from '@/lib/authRedirect'

export const Route = createFileRoute('/admin/groups/')({
  beforeLoad: authRedirect,
  component: GroupsPage,
})

const PAGE_SIZE = 5

type GroupWithExtra = GroupOutDto & {
  client_name?: string
  group_path?: string
}

function buildGroupPath(
  groupId: string,
  groupMap: Record<string, GroupOutDto>,
): string {
  const parts: string[] = []
  let currentId: string | undefined = groupId

  while (currentId) {
    const current: GroupOutDto | undefined = groupMap[currentId]
    if (!current) break
    parts.unshift(current.name)
    currentId = current.parent_id ?? undefined
  }

  if (parts.length === 0) return '_ROOT'
  return '_ROOT > ' + parts.join(' > ')
}

const groupColumns: Column<GroupWithExtra>[] = [
  {
    key: 'client_name',
    title: 'Client',
    sortable: true,
    render: (value: string | undefined) => value ?? '-',
  },
  {
    key: 'name',
    title: 'Group name',
    sortable: true,
    render: (value: string) => <span className="font-medium">{value}</span>,
  },
  {
    key: 'group_path',
    title: 'Group path',
    sortable: false,
    render: (value: string | undefined) => (
      <span className="text-xs text-inputs-text">{value ?? '-'}</span>
    ),
  },
]

function GroupsPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [groupToDelete, setGroupToDelete] = useState<GroupWithExtra | null>(
    null,
  )

  const { data: groupData, isLoading: groupsLoading } = useGroupList({
    page,
    page_size: PAGE_SIZE,
  })
  const deleteMutation = useDeleteGroup()
  const groups = groupData?.data ?? []
  const totalCount = groupData?.count ?? 0
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  // Fetch all groups for path computation
  const { data: allGroupData } = useGroupList({
    page: 1,
    page_size: 100,
  })
  const allGroups = allGroupData?.data ?? []

  const groupMap = useMemo(() => {
    const map: Record<string, GroupOutDto> = {}
    allGroups.forEach((g: GroupOutDto) => {
      if (g.id) map[g.id] = g
    })
    return map
  }, [allGroups])

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

  const groupsWithExtra: GroupWithExtra[] = useMemo(() => {
    return groups.map((group: GroupOutDto) => ({
      ...group,
      client_name: group.client_id
        ? clientNameMap[group.client_id]
        : undefined,
      group_path: buildGroupPath(group.id, groupMap),
    }))
  }, [groups, clientNameMap, groupMap])

  const handleView = (group: GroupWithExtra) => {
    if (group.id) {
      navigate({
        to: '/admin/groups/$groupId',
        params: { groupId: group.id },
      })
    }
  }

  const handleCopy = (group: GroupWithExtra) => {
    if (group.id) {
      navigate({
        to: '/admin/groups/$groupId/duplicate',
        params: { groupId: group.id },
      })
    }
  }

  const handleDelete = (group: GroupWithExtra) => {
    setGroupToDelete(group)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (groupToDelete?.id) {
      await deleteMutation.mutateAsync(groupToDelete.id)
      setShowDeleteModal(false)
      setGroupToDelete(null)
    }
  }

  const handleNew = () => {
    navigate({ to: '/admin/groups/new' })
  }

  const groupActions: Action<GroupWithExtra>[] = [
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
            Groups {totalCount > 0 && `(${totalCount})`}
          </h2>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-4 py-2 bg-divers-button text-white rounded-lg hover:opacity-90 transition"
          >
            <Plus className="h-5 w-5" />
            <span>New</span>
          </button>
        </div>

        <Table<GroupWithExtra>
          data={groupsWithExtra}
          columns={groupColumns}
          actions={groupActions}
          onRowClick={handleView}
          loading={groupsLoading}
          emptyMessage="No groups found"
          searchable
          searchPlaceholder="Search Group..."
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
        title="Delete Group"
        message={`Are you sure you want to delete "${groupToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        variant="danger"
      />
    </div>
  )
}
