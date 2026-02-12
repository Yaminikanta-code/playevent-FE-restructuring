export type GroupStatus = 'active' | 'inactive' | 'archive'

export interface CreateGroupDto {
    name: string
    client_id: string
    contract_id?: string
    parent_id?: string
    status?: GroupStatus
    contracts_history?: Record<string, any>
}

export interface UpdateGroupDto {
    name?: string
    client_id?: string
    contract_id?: string
    parent_id?: string
    status?: GroupStatus
    contracts_history?: Record<string, any>
}

export interface GroupOutDto {
    id: string
    name: string
    client_id: string
    contract_id?: string
    parent_id?: string
    status: string
    contracts_history?: Record<string, any>
    source_id?: string
    created_at?: string
    updated_at?: string
    deleted_at?: string
}
