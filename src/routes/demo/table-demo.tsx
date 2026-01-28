import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import Table from '../../common/Table'
import type { Column, Action } from '../../common/Table'
import StatusBadge from '../../common/StatusBadge'
import { Pencil, Trash2 } from 'lucide-react'

interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  createdAt: string
}

export const Route = createFileRoute('/demo/table-demo')({
  component: TableDemo,
})

function TableDemo() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Admin',
      status: 'active',
      createdAt: '2024-01-15',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Editor',
      status: 'active',
      createdAt: '2024-01-18',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      role: 'Viewer',
      status: 'inactive',
      createdAt: '2024-01-20',
    },
    {
      id: 4,
      name: 'Alice Williams',
      email: 'alice.williams@example.com',
      role: 'Editor',
      status: 'pending',
      createdAt: '2024-01-22',
    },
    {
      id: 5,
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com',
      role: 'Viewer',
      status: 'active',
      createdAt: '2024-01-25',
    },
    {
      id: 6,
      name: 'Diana Prince',
      email: 'diana.prince@example.com',
      role: 'Admin',
      status: 'active',
      createdAt: '2024-02-01',
    },
    {
      id: 7,
      name: 'Eve Anderson',
      email: 'eve.anderson@example.com',
      role: 'Viewer',
      status: 'inactive',
      createdAt: '2024-02-05',
    },
    {
      id: 8,
      name: 'Frank Miller',
      email: 'frank.miller@example.com',
      role: 'Editor',
      status: 'active',
      createdAt: '2024-02-10',
    },
    {
      id: 9,
      name: 'Grace Lee',
      email: 'grace.lee@example.com',
      role: 'Viewer',
      status: 'pending',
      createdAt: '2024-02-15',
    },
    {
      id: 10,
      name: 'Henry Davis',
      email: 'henry.davis@example.com',
      role: 'Admin',
      status: 'active',
      createdAt: '2024-02-20',
    },
    {
      id: 11,
      name: 'Ivy Chen',
      email: 'ivy.chen@example.com',
      role: 'Editor',
      status: 'inactive',
      createdAt: '2024-02-25',
    },
    {
      id: 12,
      name: 'Jack Wilson',
      email: 'jack.wilson@example.com',
      role: 'Viewer',
      status: 'active',
      createdAt: '2024-03-01',
    },
  ])

  const columns: Column<User>[] = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      render: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'email',
      title: 'Email',
      sortable: true,
    },
    {
      key: 'role',
      title: 'Role',
      sortable: true,
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value: 'active' | 'inactive' | 'pending') => (
        <StatusBadge status={value} />
      ),
    },
    {
      key: 'createdAt',
      title: 'Created at',
      sortable: true,
    },
  ]

  const actions: Action<User>[] = [
    {
      icon: Pencil,
      label: 'Edit',
      onClick: (user) => {
        alert(`Edit user: ${user.name}`)
      },
    },
    {
      icon: Trash2,
      label: 'Delete',
      onClick: (user) => {
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
          setUsers(users.filter((u) => u.id !== user.id))
        }
      },
      variant: 'destructive',
    },
  ]

  const handleRowClick = (user: User) => {
    alert(`Row clicked: ${user.name} (${user.email})`)
  }

  const handleSort = (
    column: Column<User>,
    direction: 'asc' | 'desc' | null,
  ) => {
    console.log('Sort:', column.key, direction)
  }

  return (
    <div className="min-h-screen bg-midnight-darkest p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-inputs-title mb-6">
          Table Component Demo
        </h1>

        <div className="bg-midnight-base border border-inputs-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-inputs-title mb-4">
            User Management Table
          </h2>
          <Table<User>
            data={users}
            columns={columns}
            actions={actions}
            searchable={true}
            searchPlaceholder="Search by name, email, or role..."
            searchableFields={['name', 'email', 'role']}
            pagination={true}
            pageSize={5}
            onRowClick={handleRowClick}
            onSort={handleSort}
            defaultSortColumn="name"
            defaultSortDirection="asc"
          />
        </div>

        <div className="mt-8 bg-midnight-base border border-inputs-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-inputs-title mb-4">
            Features
          </h2>
          <ul className="space-y-2 text-inputs-title">
            <li>✓ Sortable columns with visual indicators</li>
            <li>✓ Search functionality across multiple fields</li>
            <li>✓ Pagination with customizable page size</li>
            <li>✓ Row actions with inline buttons</li>
            <li>✓ Custom cell rendering</li>
            <li>✓ Clickable rows with onRowClick handler</li>
            <li>✓ Loading and empty states</li>
            <li>✓ Fully responsive design</li>
            <li>✓ TypeScript support with generic types</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
