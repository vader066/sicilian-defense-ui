import type { PLAYER } from '@/types/database/models'

export function getPlayerName(username: string, players: PLAYER[]): string {
  const player = players.find((player) => username === player.username)
  if (player) {
    return `${player.first_name} ${player.last_name}`
  }
  throw new Error(`${username} is not present in global players`)
}
