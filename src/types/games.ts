export interface GAME {
  game_id: string
  black: string //Black Player ID
  white: string //White Player ID
  round: number
  winner?: string
  black_rating?: number // shouldn't be optional will change later
  white_rating?: number // shouldn't be optional will change later
  played_at: string
  tournament_id?: string // optional because backend handles this during tournament with games creation
  draw: boolean
  forfeit?: 'BF' | 'WF' | 'FF' // Black Forfeit, White Forfeit, Full(Both players) Forfeit
}
