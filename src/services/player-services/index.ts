import type { PLAYER } from '@/types/database/models'

export function getPlayerName(
  username: string,
  players: PLAYER[],
): string | null {
  const player = players.find((player) => username === player.username)
  if (player) {
    return `${player.first_name} ${player.last_name}`
  }
  return null
}
