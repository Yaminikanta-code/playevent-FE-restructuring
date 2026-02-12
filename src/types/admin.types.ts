export enum AdminRole {
    CLIENT_ADMIN = 'clientadmin',
    SUPER_ADMIN = 'superadmin',
}

export enum AdminStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    ARCHIVE = 'archive',
}

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
    status: AdminStatus
    role: AdminRole
    rights?: Record<string, any>
    language_id?: number
    created_at?: string
    updated_at?: string
    deleted_at?: string
}

export interface AdminDetailDto extends AdminOutDto {
    group_ids: string[]
}
