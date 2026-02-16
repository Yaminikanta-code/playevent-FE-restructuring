import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2, Copy, ArrowLeft } from 'lucide-react'
import { Button, Table, ConfirmationModal, ScrollArea } from '../../common'
import type { Column } from '../../common/Table'
import { useClientGroups, useDeleteGroup } from '../../../api/group.api'
import { useClientAdmins, useDeleteAdmin } from '../../../api/admin.api'
import {
  useClientContracts,
  useDeleteContract,
} from '../../../api/contract.api'
import {
  useClientAppShells,
  useDeleteAppShell,
} from '../../../api/app-shell.api'

import type { GroupOutDto } from '../../../types/group.types'
import type { AdminOutDto } from '../../../types/admin.types'
import type { ContractOutDto } from '../../../types/contract.types'
import type { AppShellOutDto } from '../../../types/app-shell.types'
import ClientForm from './ClientForm'
import GroupForm from '../groups/GroupForm'
import UserForm from '../users/UserForm'
import ContractForm from '../contracts/ContractForm'
import AppShellForm from '../appShells/AppShellForm'

type EditTab = 'client' | 'groups' | 'users' | 'contracts' | 'shells'
type FormMode = 'new' | 'edit' | 'duplicate'

interface FormState {
  type: 'group' | 'user' | 'contract' | 'shell' | null
  mode: FormMode
  item?: any
}

interface ClientEditViewProps {
  client: any
}

const ClientEditView = ({ client }: ClientEditViewProps) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [activeTab, setActiveTab] = useState<EditTab>('client')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{
    type: string
    id: string
    name: string
  } | null>(null)
  const [formState, setFormState] = useState<FormState>({
    type: null,
    mode: 'new',
  })

  // Invalidate cache on mount to ensure root group is included
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['groups'] })
    queryClient.invalidateQueries({ queryKey: ['admins'] })
    queryClient.invalidateQueries({ queryKey: ['contracts'] })
    queryClient.invalidateQueries({ queryKey: ['app_shells'] })
  }, [client.id, queryClient])

  const { data: groupsData, refetch: refetchGroups } = useClientGroups(
    client.id,
  )
  const deleteGroupMutation = useDeleteGroup()

  const { data: adminsData, refetch: refetchAdmins } = useClientAdmins(
    client.id,
  )
  const deleteAdminMutation = useDeleteAdmin()

  const { data: contractsData, refetch: refetchContracts } = useClientContracts(
    client.id,
  )
  const deleteContractMutation = useDeleteContract()

  const { data: shellsData, refetch: refetchShells } = useClientAppShells(
    client.id,
  )
  const deleteShellMutation = useDeleteAppShell()

  const groups = groupsData?.data ?? []
  const admins = adminsData?.data ?? []
  const contracts = contractsData?.data ?? []
  const shells = shellsData?.data ?? []

  const tabs = [
    { key: 'client' as EditTab, label: 'Client' },
    { key: 'groups' as EditTab, label: 'Groups' },
    { key: 'users' as EditTab, label: 'Users' },
    { key: 'contracts' as EditTab, label: 'Contracts' },
    { key: 'shells' as EditTab, label: 'Shells' },
  ]

  const handleDelete = (type: string, id: string, name: string) => {
    setItemToDelete({ type, id, name })
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return

    try {
      if (itemToDelete.type === 'group') {
        await deleteGroupMutation.mutateAsync(itemToDelete.id)
        refetchGroups()
      } else if (itemToDelete.type === 'user') {
        await deleteAdminMutation.mutateAsync(itemToDelete.id)
        refetchAdmins()
      } else if (itemToDelete.type === 'contract') {
        await deleteContractMutation.mutateAsync(itemToDelete.id)
        refetchContracts()
      } else if (itemToDelete.type === 'shell') {
        await deleteShellMutation.mutateAsync(itemToDelete.id)
        refetchShells()
      }
    } catch (error) {
      console.error(`Error deleting ${itemToDelete.type}:`, error)
    }

    setShowDeleteModal(false)
    setItemToDelete(null)
  }

  const handleFormClose = () => {
    setFormState({ type: null, mode: 'new' })
    refetchGroups()
    refetchAdmins()
    refetchContracts()
    refetchShells()
  }

  const handleClientUpdate = () => {
    navigate({ to: '/admin/clients' })
  }

  const handleAdd = (type: 'group' | 'user' | 'contract' | 'shell') => {
    setFormState({ type, mode: 'new' })
  }

  const handleEdit = (
    type: 'group' | 'user' | 'contract' | 'shell',
    item: any,
  ) => {
    setFormState({ type, mode: 'edit', item })
  }

  const handleDuplicate = (
    type: 'group' | 'user' | 'contract' | 'shell',
    item: any,
  ) => {
    setFormState({ type, mode: 'duplicate', item })
  }

  const groupColumns: Column<GroupOutDto>[] = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>,
    },
  ]

  const userColumns: Column<AdminOutDto>[] = [
    { key: 'first_name', title: 'First Name', sortable: true },
    { key: 'last_name', title: 'Last Name', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
  ]

  const contractColumns: Column<ContractOutDto>[] = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>,
    },
    { key: 'total_events', title: 'Total Events', sortable: true },
  ]

  const shellColumns: Column<AppShellOutDto>[] = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>,
    },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'client':
        return (
          <ClientForm
            existingClient={client}
            onSubmitSuccess={handleClientUpdate}
            submitLabel="Update Client"
          />
        )

      case 'groups':
        if (formState.type === 'group') {
          return (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleFormClose}
                  variant="secondary"
                  icon={ArrowLeft}
                >
                  Back to List
                </Button>
                <h2 className="text-xl font-semibold">
                  {formState.mode === 'new'
                    ? 'New Group'
                    : formState.mode === 'edit'
                      ? 'Edit Group'
                      : 'Duplicate Group'}
                </h2>
              </div>
              <GroupForm
                group={formState.item}
                tenants={[client]}
                mode={formState.mode}
                onClose={handleFormClose}
              />
            </div>
          )
        }
        return (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button
                onClick={() => handleAdd('group')}
                variant="primary"
                icon={Plus}
              >
                Add Group
              </Button>
            </div>
            <Table<GroupOutDto>
              data={groups}
              columns={groupColumns}
              actions={[
                {
                  icon: Edit,
                  label: 'Edit',
                  onClick: (group) => handleEdit('group', group),
                },
                {
                  icon: Copy,
                  label: 'Duplicate',
                  onClick: (group) => handleDuplicate('group', group),
                },
                {
                  icon: Trash2,
                  label: 'Delete',
                  onClick: (group) =>
                    handleDelete('group', group.id, group.name),
                  variant: 'destructive',
                },
              ]}
              emptyMessage="No groups found"
              searchable
              searchPlaceholder="Search groups..."
              searchableFields={['name']}
            />
          </div>
        )

      case 'users':
        if (formState.type === 'user') {
          return (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleFormClose}
                  variant="secondary"
                  icon={ArrowLeft}
                >
                  Back to List
                </Button>
                <h2 className="text-xl font-semibold">
                  {formState.mode === 'new'
                    ? 'New User'
                    : formState.mode === 'edit'
                      ? 'Edit User'
                      : 'Duplicate User'}
                </h2>
              </div>
              <UserForm
                user={formState.item}
                tenants={[client]}
                allGroups={groups}
                mode={formState.mode}
                clientId={client.id}
                onClose={handleFormClose}
              />
            </div>
          )
        }
        return (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button
                onClick={() => handleAdd('user')}
                variant="primary"
                icon={Plus}
              >
                Add User
              </Button>
            </div>
            <Table<AdminOutDto>
              data={admins}
              columns={userColumns}
              actions={[
                {
                  icon: Edit,
                  label: 'Edit',
                  onClick: (admin) => handleEdit('user', admin),
                },
                {
                  icon: Copy,
                  label: 'Duplicate',
                  onClick: (admin) => handleDuplicate('user', admin),
                },
                {
                  icon: Trash2,
                  label: 'Delete',
                  onClick: (admin) =>
                    handleDelete(
                      'user',
                      admin.id,
                      `${admin.first_name} ${admin.last_name}`,
                    ),
                  variant: 'destructive',
                },
              ]}
              emptyMessage="No users found"
              searchable
              searchPlaceholder="Search users..."
              searchableFields={['first_name', 'last_name', 'email']}
            />
          </div>
        )

      case 'contracts':
        if (formState.type === 'contract') {
          return (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleFormClose}
                  variant="secondary"
                  icon={ArrowLeft}
                >
                  Back to List
                </Button>
                <h2 className="text-xl font-semibold">
                  {formState.mode === 'new'
                    ? 'New Contract'
                    : formState.mode === 'edit'
                      ? 'Edit Contract'
                      : 'Duplicate Contract'}
                </h2>
              </div>
              <ContractForm
                contract={formState.item}
                tenants={[client]}
                allGroups={groups}
                mode={formState.mode}
                clientId={client.id}
                onClose={handleFormClose}
              />
            </div>
          )
        }
        return (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button
                onClick={() => handleAdd('contract')}
                variant="primary"
                icon={Plus}
              >
                Add Contract
              </Button>
            </div>
            <Table<ContractOutDto>
              data={contracts}
              columns={contractColumns}
              actions={[
                {
                  icon: Edit,
                  label: 'Edit',
                  onClick: (contract) => handleEdit('contract', contract),
                },
                {
                  icon: Copy,
                  label: 'Duplicate',
                  onClick: (contract) => handleDuplicate('contract', contract),
                },
                {
                  icon: Trash2,
                  label: 'Delete',
                  onClick: (contract) =>
                    handleDelete('contract', contract.id, contract.name),
                  variant: 'destructive',
                },
              ]}
              emptyMessage="No contracts found"
              searchable
              searchPlaceholder="Search contracts..."
              searchableFields={['name', 'description']}
            />
          </div>
        )

      case 'shells':
        if (formState.type === 'shell') {
          return (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleFormClose}
                  variant="secondary"
                  icon={ArrowLeft}
                >
                  Back to List
                </Button>
                <h2 className="text-xl font-semibold">
                  {formState.mode === 'new'
                    ? 'New Shell'
                    : formState.mode === 'edit'
                      ? 'Edit Shell'
                      : 'Duplicate Shell'}
                </h2>
              </div>
              <AppShellForm
                appShell={formState.item}
                tenants={[client]}
                mode={formState.mode}
                clientId={client.id}
                onClose={handleFormClose}
              />
            </div>
          )
        }
        return (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button
                onClick={() => handleAdd('shell')}
                variant="primary"
                icon={Plus}
              >
                Add Shell
              </Button>
            </div>
            <Table<AppShellOutDto>
              data={shells}
              columns={shellColumns}
              actions={[
                {
                  icon: Edit,
                  label: 'Edit',
                  onClick: (shell) => handleEdit('shell', shell),
                },
                {
                  icon: Copy,
                  label: 'Duplicate',
                  onClick: (shell) => handleDuplicate('shell', shell),
                },
                {
                  icon: Trash2,
                  label: 'Delete',
                  onClick: (shell) =>
                    handleDelete('shell', shell.id, shell.name),
                  variant: 'destructive',
                },
              ]}
              emptyMessage="No shells found"
              searchable
              searchPlaceholder="Search shells..."
              searchableFields={['name']}
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="h-[90vh]">
      <ScrollArea
        title={client.name}
        headerContent={
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  activeTab === tab.key
                    ? 'bg-midnight-light text-inputs-title'
                    : 'text-inputs-text hover:text-inputs-title'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        }
      >
        {renderTabContent()}
      </ScrollArea>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Are you sure?"
        message={`You are about to remove **${itemToDelete?.name}**.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        variant="danger"
      />
    </div>
  )
}

export default ClientEditView
