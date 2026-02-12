export interface CreateAdminGroupDto {
    admin_id: string
    group_id: string
}

export interface UpdateAdminGroupDto {
    admin_id?: string
    group_id?: string
}

export interface AdminGroupOutDto {
    id: string
    admin_id: string
    group_id: string
    created_at?: string
    updated_at?: string
}
