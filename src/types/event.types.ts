export enum EventStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVE = 'archive',
}

export interface EventCreate {
  client_id: string
  created_by: string
  name: string
  start_at: string
  subclient_id?: string
  contract_id?: string
  end_at?: string
  status?: EventStatus
  bookmark?: boolean
  host_name?: string
  guest_name?: string
  host_picture_url?: string
  guest_picture_url?: string
  scope_path?: Record<string, unknown>
}

export interface EventUpdate {
  name?: string
  start_at?: string
  end_at?: string
  status?: EventStatus
  bookmark?: boolean
  host_name?: string
  guest_name?: string
  host_picture_url?: string
  guest_picture_url?: string
  scope_path?: Record<string, unknown>
}

export interface EventRead {
  id: string
  client_id: string
  name: string
  start_at: string
  created_at: string
  subclient_id?: string
  contract_id?: string
  end_at?: string
  status?: EventStatus
  bookmark?: boolean
  host_name?: string
  guest_name?: string
  host_picture_url?: string
  guest_picture_url?: string
  scope_path?: Record<string, unknown>
  created_by?: string
  client_name?: string
  group_name?: string
  design_config?: Record<string, unknown>
  login_config?: Record<string, unknown>
  shell_html?: string
  navigation_html?: string
  header_html?: string
  footer_html?: string
}
