export enum TenantStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVE = 'archive',
}

export interface CreateTenantDto {
  name: string
  short_name?: string
  status?: TenantStatus
  activity_name?: string
  creation_step?: string
}

export interface UpdateTenantDto {
  name?: string
  short_name?: string
  status?: TenantStatus
  activity_name?: string
  creation_step?: string
}

export interface TenantOutDto {
  id: string
  name: string
  short_name?: string
  status: TenantStatus
  activity_name?: string
  creation_step?: string
  created_at?: string
  updated_at?: string
  deleted_at?: string
}

export interface TenantOnboardingStatus {
  id: string
  client_id: string
  onboarding_status: string
  [key: string]: unknown
}
