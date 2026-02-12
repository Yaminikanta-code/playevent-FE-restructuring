export enum ContractStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export interface CreateContractDto {
    name: string
    description?: string
    client_id?: string
    source_id?: string
    start_date: string
    end_date: string
    total_events: number
    status?: ContractStatus
    allocated_modules?: Record<string, any>[]
    group_ids?: string[]
}

export interface UpdateContractDto {
    name?: string
    description?: string
    client_id?: string
    source_id?: string
    start_date?: string
    end_date?: string
    total_events?: number
    status?: ContractStatus
    allocated_modules?: Record<string, any>[]
    group_ids?: string[]
}

export interface ContractOutDto {
    id: string
    client_id?: string
    source_id?: string
    name: string
    description?: string
    start_date: string
    end_date: string
    total_events: number
    status: ContractStatus
    allocated_modules?: Record<string, any>[]
    created_at?: string
    updated_at?: string
    deleted_at?: string
}

export interface ContractDetailDto extends ContractOutDto {
    group_ids: string[]
}
