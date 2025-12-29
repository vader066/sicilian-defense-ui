import { type GAME } from './games'
import type { PLAYER } from './players'

export interface TOURNAMENT {
  id: string
  tournamentName: string
  games: Array<GAME>
  playerIDs: Array<string> // player id's
  dbPlayers?: Array<PLAYER> // don't use for now
  synced?: boolean
  clubId: string
  beganAt: Date
}

export interface DBTourney {
  id: string
  tournament_name: string
  number_of_players: number
  synced: boolean
  club_id: string
  began_at?: string
}

export type tournamentReq = {
  tournamentName: string
  games: GAME[]
  playerIDs: string[]
}

export type syncTournReq = {
  tournamentId: string
  updatedGames: GAME[]
  ratingUpdates: Array<{
    playerId: string
    newRating: number
  }>
}
