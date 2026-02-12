export interface CreateModuleDto {
    type_name: string
    status?: 'active' | 'inactive'
    default_version?: number
    default_status: string
}

export interface UpdateModuleDto {
    type_name?: string
    status?: string
    default_version?: number
    default_status?: string
}

export interface ModuleOutDto {
    id: string
    source_id?: string
    type_name: string
    status: string
    default_version: number
    default_status: string
    created_at?: string
    updated_at?: string
    deleted_at?: string
}
