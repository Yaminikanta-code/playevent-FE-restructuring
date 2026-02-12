export type AdminRole = 'clientadmin' | 'superadmin'
export type AdminStatus = 'active' | 'inactive' | 'archive'

export interface CreateAdminDto {
    email: string
    password: string
    role: AdminRole
    first_name?: string
    last_name?: string
    client_id?: string
}

export interface UpdateAdminDto {
    email?: string
    first_name?: string
    last_name?: string
    status?: AdminStatus
    rights?: Record<string, any>
    language_id?: number
    group_ids?: string[]
}

export interface AdminOutDto {
    id: string
    email: string
    first_name?: string
    last_name?: string
    client_id?: string
    status: string
    role: string
    rights?: Record<string, any>
    language_id?: number
    created_at?: string
    updated_at?: string
    deleted_at?: string
}

export interface AdminDetailDto extends AdminOutDto {
    group_ids: string[]
}
