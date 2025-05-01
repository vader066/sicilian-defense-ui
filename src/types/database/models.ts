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
  players: Array<string>
  winner: string
  date: string
  tournaments?: string
}

export interface TOURNAMENT {
  tournamentId: string
  $id?: string
  games: Array<GAMES>
  players: Array<string>
  synced?: boolean
  clubs?: string
}

export type sex = 'male' | 'female' | undefined

export type Member = {
  first_name: string
  last_name: string
  programme: string
  username: string
  dob: Date
  sex: sex
  rating: number
}

export interface PLAYER {
  id: string
  name: string
  rating: number
  clubs?: string
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
