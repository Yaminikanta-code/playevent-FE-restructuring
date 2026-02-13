import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Plus, ChevronLeft, ChevronRight, Copy, Trash2 } from 'lucide-react'
import { Table, ConfirmationModal } from '@/components/common'
import type { Column, Action } from '@/components/common/Table'
import { useAdminList, useDeleteAdmin } from '@/api/admin.api'
import type { AdminOutDto } from '@/types/admin.types'
import { useTenantList } from '@/api/tenant.api'
import type { TenantOutDto } from '@/types/tenant.types'
import { useState, useMemo } from 'react'
import { authRedirect } from '@/lib/authRedirect'

export const Route = createFileRoute('/admin/users/')({
  beforeLoad: authRedirect,
  component: UsersPage,
})

const PAGE_SIZE = 5

type UserWithExtra = AdminOutDto & {
  fullname?: string
  client_name?: string
}

const userColumns: Column<UserWithExtra>[] = [
  {
    key: 'fullname',
    title: 'Fullname',
    sortable: true,
    render: (value: string | undefined) => (
      <span className="font-medium">{value ?? '-'}</span>
    ),
  },
  {
    key: 'client_name',
    title: 'Client',
    sortable: true,
    render: (value: string | undefined) => value ?? '-',
  },
  {
    key: 'email',
    title: 'Email',
    sortable: true,
  },
]

function UsersPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<UserWithExtra | null>(null)

  const { data: adminData, isLoading: adminsLoading } = useAdminList({
    page,
    page_size: PAGE_SIZE,
  })
  const deleteMutation = useDeleteAdmin()
  const admins = adminData?.data ?? []
  const totalCount = adminData?.count ?? 0
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

  const usersWithExtra: UserWithExtra[] = useMemo(() => {
    return admins.map((admin: AdminOutDto) => ({
      ...admin,
      fullname: [admin.first_name, admin.last_name]
        .filter(Boolean)
        .join(' ')
        .toUpperCase() || '-',
      client_name: admin.client_id
        ? clientNameMap[admin.client_id]
        : undefined,
    }))
  }, [admins, clientNameMap])

  const handleView = (user: UserWithExtra) => {
    if (user.id) {
      navigate({
        to: '/admin/users/$userId',
        params: { userId: user.id },
      })
    }
  }

  const handleCopy = (user: UserWithExtra) => {
    if (user.id) {
      navigate({
        to: '/admin/users/$userId/duplicate',
        params: { userId: user.id },
      })
    }
  }

  const handleDelete = (user: UserWithExtra) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (userToDelete?.id) {
      await deleteMutation.mutateAsync(userToDelete.id)
      setShowDeleteModal(false)
      setUserToDelete(null)
    }
  }

  const handleNew = () => {
    navigate({ to: '/admin/users/new' })
  }

  const userActions: Action<UserWithExtra>[] = [
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

  const deleteUserName = userToDelete
    ? [userToDelete.first_name, userToDelete.last_name]
        .filter(Boolean)
        .join(' ') || userToDelete.email
    : ''

  return (
    <div>
      <div className="bg-inputs-background border border-inputs-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-inputs-title">
            Users {totalCount > 0 && `(${totalCount})`}
          </h2>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-4 py-2 bg-divers-button text-white rounded-lg hover:opacity-90 transition"
          >
            <Plus className="h-5 w-5" />
            <span>New User</span>
          </button>
        </div>

        <Table<UserWithExtra>
          data={usersWithExtra}
          columns={userColumns}
          actions={userActions}
          onRowClick={handleView}
          loading={adminsLoading}
          emptyMessage="No users found"
          searchable
          searchPlaceholder="Search User..."
          searchableFields={['fullname', 'email', 'client_name']}
          defaultSortColumn="fullname"
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
        message={`You are about to remove **${deleteUserName}**.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        variant="danger"
      />
    </div>
  )
}
