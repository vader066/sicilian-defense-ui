export interface ARENATOURNAMENTGAME {
  id: string
  rated: boolean
  variant: string
  speed: string
  perf: string
  createdAt: number
  lastMoveAt: number
  status: string
  source: string
  players: {
    white: PLAYER
    black: PLAYER
  }
  winner: 'white' | 'black'
  moves: string
  tournament: string
  clock: {
    initial: number
    increment: number
    totalTime: number
  }
}

export interface PLAYER {
  user: {
    name: string
    id: string
  }
  rating: number
  ratingDiff: number
}
