import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Plus, Trash2 } from 'lucide-react'
import { Table, ConfirmationModal } from '../../../../components/common'
import type { Action } from '../../../../components/common/Table'
import { useFontList, useDeleteFont } from '../../../../api/font.api'
import type { FontOutDto } from '../../../../types/font.types'
import { authRedirect } from '@/lib/authRedirect'
import { useState } from 'react'

export const Route = createFileRoute('/admin/settings/fonts/')({
  beforeLoad: authRedirect,
  component: FontsPage,
})

const fontColumns = [
  {
    key: 'name',
    title: 'Name',
    sortable: true,
    render: (value: string) => <span className="font-medium">{value}</span>,
  },
  {
    key: 'regular',
    title: 'Regular URL',
    sortable: true,
    render: (value: string) => <span className="text-sm">{value}</span>,
  },
  {
    key: 'bold',
    title: 'Bold URL',
    sortable: true,
    render: (value: string) => <span className="text-sm">{value}</span>,
  },
  {
    key: 'italic',
    title: 'Italic URL',
    sortable: true,
    render: (value: string) => <span className="text-sm">{value}</span>,
  },
]

function FontsPage() {
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [fontToDelete, setFontToDelete] = useState<FontOutDto | null>(null)

  const { data: fontData, isLoading } = useFontList({
    page: 1,
    page_size: 100,
  })
  const deleteMutation = useDeleteFont()
  const fonts = fontData?.data ?? []
  const totalCount = fontData?.count ?? 0

  const handleEdit = (font: FontOutDto) => {
    if (font.id) {
      navigate({
        to: '/admin/settings/fonts/$fontId' as any,
        params: { fontId: font.id } as any,
      })
    }
  }

  const handleDelete = (font: FontOutDto) => {
    setFontToDelete(font)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (fontToDelete?.id) {
      await deleteMutation.mutateAsync(fontToDelete.id)
      setShowDeleteModal(false)
      setFontToDelete(null)
    }
  }

  const handleNew = () => {
    navigate({ to: '/admin/settings/fonts/new' })
  }

  const fontActions: Array<Action<FontOutDto>> = [
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
            Fonts {totalCount > 0 && `(${totalCount})`}
          </h2>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-4 py-2 bg-divers-button text-white rounded-lg hover:opacity-90 transition"
          >
            <Plus className="h-5 w-5" />
            <span>New</span>
          </button>
        </div>

        <Table<FontOutDto>
          data={fonts}
          columns={fontColumns}
          actions={fontActions}
          onRowClick={handleEdit}
          loading={isLoading}
          emptyMessage="No fonts found"
          searchable
          searchPlaceholder="Search Fonts..."
          searchableFields={['name', 'regular', 'bold', 'italic']}
          defaultSortColumn="name"
          defaultSortDirection="asc"
        />
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Font"
        message={`Are you sure you want to delete "${fontToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        variant="danger"
      />
    </div>
  )
}
