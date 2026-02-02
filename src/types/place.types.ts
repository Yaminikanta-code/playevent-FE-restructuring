export interface Subplace {
  id: string
  name: string
  number_of_winners: number
  index: number
  status: string
}

export interface PlaceCreate {
  name: string
  client_id?: string
  status?: string
  subplaces?: Subplace[]
}

export interface PlaceUpdate {
  name?: string
  client_id?: string
  status?: string
  subplaces?: Subplace[]
  is_deleted?: boolean
}

export interface PlaceRead {
  id: string
  name: string
  client_id?: string
  status: string
  subplaces: Subplace[]
  created_at: string
  updated_at: string
  is_deleted: boolean
  deleted_at?: string
}
