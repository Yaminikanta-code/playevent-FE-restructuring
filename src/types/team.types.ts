export interface TeamMember {
  full_name: string
  photo: string
  index: number
  position: string
  kit_number: number
  status: string
}

export interface TeamCreate {
  name: string
  client_id?: string
  status?: string
  members?: TeamMember[]
}

export interface TeamUpdate {
  name?: string
  client_id?: string
  status?: string
  members?: TeamMember[]
  is_deleted?: boolean
}

export interface TeamRead {
  id: string
  name: string
  client_id?: string
  status: string
  members: TeamMember[]
  created_at: string
  updated_at: string
  is_deleted: boolean
  deleted_at?: string
}
