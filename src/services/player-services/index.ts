import type { PLAYER } from '@/types/players'
import api from '../api-client'
import type { ApiResponse } from '../types'
import { ServerError } from '@/types/auth'

export function getPlayerName(
  playerId: string,
  players: PLAYER[],
): string | null {
  const player = players.find((player) => playerId === player.id)
  if (player) {
    return `${player.first_name} ${player.last_name}`
  }
  return null
}

export function getPlayer(playerId: string, players: PLAYER[]): PLAYER | null {
  const player = players.find((player) => playerId === player.id)
  if (player) {
    return player
  }
  return null
}

export const playerService = {
  async getPlayers(clubId: string): Promise<PLAYER[]> {
    try {
      const response = await api.get<ApiResponse<PLAYER[]>>(
        `/club/${clubId}/players`,
      )
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async addPlayer(playerData: Partial<PLAYER>): Promise<PLAYER> {
    try {
      const response = await api.post<ApiResponse<PLAYER>>(
        '/players',
        playerData,
      )
      return response.data.data
    } catch (error) {
      throw new ServerError('Failed to add player', error)
    }
  },

  async addPlayers(playerArray: Partial<PLAYER[]>): Promise<PLAYER[]> {
    try {
      const response = await api.post<ApiResponse<PLAYER[]>>(
        '/players/populate',
        playerArray,
      )
      return response.data.data
    } catch (error) {
      throw new ServerError('Failed to add players', error)
    }
  },

  async updatePlayer(
    playerId: string,
    playerData: Partial<PLAYER>,
  ): Promise<PLAYER> {
    try {
      const response = await api.put<ApiResponse<PLAYER>>(
        `/players/${playerId}`,
        playerData,
      )
      return response.data.data
    } catch (error) {
      throw error
    }
  },
}
