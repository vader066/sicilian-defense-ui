import { z } from 'zod'
import type { ADMIN } from './auth'

export const CreateAccountReqSchema = z.object({
  club_name: z.string(),
  creator_is_player: z.boolean(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  username: z.string(),
  creator: z.boolean(),
  password: z.string(),
})

export type CREATEACCOUNTREQ = z.infer<typeof CreateAccountReqSchema>
export interface CLUB {
  id: string
  club_name: string
  number_of_players: number
  created_at?: string
  updated_at?: string
}

export interface CREATEACCOUNTRES extends ADMIN, CLUB {}
