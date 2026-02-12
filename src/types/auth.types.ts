export interface UserOut {
    id: string
    email: string
    role: string
    client_id?: string
    first_name?: string
    last_name?: string
}

export interface AuthResponse {
    access_token: string
    token_type: string
    user: UserOut
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface AdminRegisterDto {
    email: string
    password: string
    first_name?: string
    last_name?: string
    client_id: string
    group_ids?: string[]
}

export interface SuperAdminRegisterDto {
    email: string
    password: string
    first_name?: string
    last_name?: string
}
