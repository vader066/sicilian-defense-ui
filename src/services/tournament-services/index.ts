import type {
  DBTourney,
  syncTournReq,
  TOURNAMENT,
  tournamentReq,
  createRoundRobinTournamentReq,
  createRoundRobinTournamentRes,
  Round,
} from '@/types/tournament'
import api from '../api-client'
import type { ApiResponse } from '../types'
import type { GAME } from '@/types/games'
import { ServerError } from '@/types/auth'
import type { ARENATOURNAMENTGAME } from '@/types/lichess/game'

// Creates an array of player ID's of all players that played in a tournament
export function GetTourneyPlayers(games: GAME[]): Array<string> {
  const players = games.reduce<string[]>((acc_players, currentGame) => {
    if (!acc_players.includes(currentGame.black)) {
      acc_players.push(currentGame.black)
    }
    if (!acc_players.includes(currentGame.white)) {
      acc_players.push(currentGame.white)
    }
    return acc_players
  }, [])
  return players
}

export const tournamentServices = {
  createDBTourneyReq({
    numberOfRounds,
    games,
    tournamentName,
  }: {
    numberOfRounds: number
    games: GAME[]
    tournamentName: string
  }): tournamentReq {
    return {
      numberOfRounds: numberOfRounds,
      tournamentName: tournamentName,
      games: games,
      playerIDs: GetTourneyPlayers(games),
    }
  },

  async listTournaments(): Promise<DBTourney[]> {
    try {
      const response = await api.get<ApiResponse<DBTourney[]>>(`/tournaments`)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async getTournamentWithGames(tournamentId: string): Promise<TOURNAMENT> {
    try {
      const response = await api.get<ApiResponse<TOURNAMENT>>(
        `/tournaments/${tournamentId}`,
      )
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async addTournament(tournamentData: tournamentReq): Promise<{
    tournament_id: string
    games_added: number
  }> {
    try {
      const response = await api.post<
        ApiResponse<{ tournament_id: string; games_added: number }>
      >(`/tournaments`, tournamentData)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async syncTournament(sync: syncTournReq): Promise<DBTourney> {
    try {
      const response = await api.post<ApiResponse<DBTourney>>(
        `/tournaments/${sync.tournamentId}/sync`,
        {
          updatedGames: sync.updatedGames,
          ratingUpdates: sync.ratingUpdates,
        },
      )
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async getLichessArenaTournament(
    tournamentId: string,
  ): Promise<ARENATOURNAMENTGAME[]> {
    try {
      const response = await api.get<ApiResponse<ARENATOURNAMENTGAME[]>>(
        `/tournaments/lichess/arena/${tournamentId}`,
      )
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async createRoundRobinTournament(
    data: createRoundRobinTournamentReq,
  ): Promise<createRoundRobinTournamentRes> {
    try {
      const response = await api.post<
        ApiResponse<createRoundRobinTournamentRes>
      >(`/tournaments/round-robin/create`, data)
      return response.data.data
    } catch (error) {
      throw new ServerError('Failed to create round robin tournament', error)
    }
  },

  async getTournamentPairings(
    tournamentId: string,
  ): Promise<{ rounds: Round[] }> {
    try {
      const response = await api.get<ApiResponse<{ rounds: Round[] }>>(
        `/tournaments/${tournamentId}/pairings`,
      )
      return response.data.data
    } catch (error) {
      throw new ServerError('Failed to get tournament pairings', error)
    }
  },
}
