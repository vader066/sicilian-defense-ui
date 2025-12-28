export interface PLAYER {
  id: string
  club_id: string
  first_name: string
  last_name: string
  programme: string
  rating: number
  username: string
  date_of_birth: string
  sex: 'MALE' | 'FEMALE'
  created_at?: string
  updated_at?: string
}
