export interface CLUB {
  id: string
  name: string
  userName: string
  email: string
  players: Array<PLAYER>
  tournaments: Array<TOURNAMENT>
}

export interface GAMES {
  gameId: string
  black: PLAYER
  white: PLAYER
  winner: PLAYER
  date: string
  tournaments?: string
}

export interface TOURNAMENT {
  tournamentId: string
  games: Array<GAMES>
  players: Array<string>
  synced?: boolean
  club?: string
}

export type sex = 'male' | 'female' | undefined

// export type Member = {
//   first_name: string
//   last_name: string
//   programme: string
//   username: string
//   dob: Date
//   sex: sex
//   rating: number
// }

export interface PLAYER {
  rating: number
  club: string
  sex: sex
  dob: Date
  username: string
  programme: string
  first_name: string
  last_name: string
}

export interface APPWRITE_TOURNAMENT {
  total: number
  documents: TOURNAMENT[]
}
export interface APPWRITE_PLAYERS {
  total: number
  documents: PLAYER[]
}

export interface TTableData {
  white: string
  black: string
  winner: string
}

export interface GAME_TABLE_FORM {
  id: string
  value: TTableData
}
