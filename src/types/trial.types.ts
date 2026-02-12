export enum TrialStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVE = 'archive',
}

export interface TrialCreate {
  name: string
  client_id: string
  status?: TrialStatus
  started_at?: string
  ends_at?: string
  data?: Record<string, any>
}

export interface TrialUpdate {
  name?: string
  client_id?: string
  status?: TrialStatus
  started_at?: string
  ends_at?: string
  data?: Record<string, any>
  is_deleted?: boolean
  deleted_at?: string
}

export interface TrialRead {
  id: string
  name: string
  client_id: string
  status: TrialStatus
  started_at?: string
  ends_at?: string
  data?: Record<string, any>
  created_at: string
  updated_at: string
  is_deleted: boolean
  deleted_at?: string
}
