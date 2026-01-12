import { type GAME } from './games'
import type { PLAYER } from './players'

export interface TOURNAMENT {
  id: string
  tournamentName: string
  numberOfRounds: number
  numberOfGames: number
  status: 'in_progress' | 'completed' | 'cancelled'
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
  number_of_rounds: number
  number_of_players: number
  number_of_games: number
  status: 'in_progress' | 'completed' | 'cancelled'
  synced: boolean
  club_id: string
  began_at?: string
}

export type tournamentReq = {
  tournamentName: string
  numberOfRounds: number
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

export type createRoundRobinTournamentReq = {
  playerIDs: string[]
  tournamentName: string
}

export interface TOURNAMENT_PAIRINGS {
  id: string
  tournament_id: string
  white?: string
  black?: string
  bye?: string
  round: number
  created_at: string
}

export type createRoundRobinTournamentRes = {
  tournament: DBTourney
  pairings: TOURNAMENT_PAIRINGS[]
}

export type Pair = {
  white?: string
  black?: string
  bye?: string
}

export type Round = {
  round: number
  pairings: Pair[]
}

export interface ARENATOURNAMENTGAME {
	id: string;
	rated: boolean;
	variant: string;
	speed: string;
	perf: string;
	createdAt: number;
	lastMoveAt: number;
	status: string;
	source: string;
	players: {
		white: LICHESSPLAYER;
		black: LICHESSPLAYER;
	};
	winner: "white" | "black";
	moves: string;
	tournament: string;
	clock: {
		initial: number;
		increment: number;
		totalTime: number;
	};
}

export interface LICHESSPLAYER {
	user: {
		name: string;
		id: string;
	};
	rating: number;
	ratingDiff: number;
}