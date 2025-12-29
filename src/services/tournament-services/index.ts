import type {
  DBTourney,
  syncTournReq,
  TOURNAMENT,
  tournamentReq,
} from '@/types/tournament'
import api from '../api-client'
import type { ApiResponse } from '../types'
import type { GAME } from '@/types/games'

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
    games,
    tournamentName,
  }: {
    games: GAME[]
    tournamentName: string
  }): tournamentReq {
    return {
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

  async getLichessArenaTournament(tournamentId: string): Promise<any> {
    try {
      const response = await api.get<any>(
        `/tournaments/lichess/arena/${tournamentId}`,
      )
      return response.data
    } catch (error) {
      throw error
    }
  },
}
