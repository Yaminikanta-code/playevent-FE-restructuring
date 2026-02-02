export interface TrialCreate {
  name: string
  client_id: string
  status?: string
  started_at?: string
  ends_at?: string
  data?: Record<string, any>
}

export interface TrialUpdate {
  name?: string
  client_id?: string
  status?: string
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
  status: string
  started_at?: string
  ends_at?: string
  data?: Record<string, any>
  created_at: string
  updated_at: string
  is_deleted: boolean
  deleted_at?: string
}
