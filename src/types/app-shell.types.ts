export enum AppShellStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export interface CreateAppShellDto {
    name: string
    client_id?: string
    status?: AppShellStatus
    shell_css?: string
    navigation_type?: string
    header_html?: string
    footer_html?: string
}

export interface UpdateAppShellDto {
    name?: string
    client_id?: string
    status?: AppShellStatus
    shell_css?: string
    navigation_type?: string
    header_html?: string
    footer_html?: string
}

export interface AppShellOutDto {
    id: string
    client_id?: string
    source_id?: string
    name: string
    status: AppShellStatus
    shell_css?: string
    navigation_type?: string
    header_html?: string
    footer_html?: string
    created_at?: string
    updated_at?: string
    deleted_at?: string
}
