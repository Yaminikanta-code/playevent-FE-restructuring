export interface CreateTenantDto {
  name: string
  root_group_name: string
  short_name?: string
  status?: string
  activity_name?: string
}

export interface UpdateTenantDto {
  name?: string
  short_name?: string
  status?: string
  activity_name?: string
  is_deleted?: boolean
  onboarding_status?: string
}

export interface TenantOutDto {
  id: string
  name: string
  short_name?: string
  status?: string
  activity_name?: string
  root_group_name?: string
  root_group_id?: string
  created_at: string
  is_deleted?: boolean
  deleted_at?: string | null
  onboarding_status?: string
  total_users?: number
  total_events?: number
}

export interface TenantOnboardingStatus {
  id: string
  client_id: string
  onboarding_status: string
  [key: string]: unknown
}
