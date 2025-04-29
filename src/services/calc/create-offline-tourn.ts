// This will construct the appwrite database tournament data schema from the data
// entered by admin
import { v4 as uuidv4 } from 'uuid'
import { GAME_TABLE_FORM, GAMES, TOURNAMENT } from '@/types/database/models'

export function CreateAppWriteTourney(
  formGamesArray: GAME_TABLE_FORM[],
): TOURNAMENT {
  const games: GAMES[] = formGamesArray.map((game) => {
    return {
      gameId: uuidv4().slice(0, 14),
      players: [game.value.white, game.value.black],
      winner: game.value.winner,
      date: new Date().toLocaleString(),
    }
  })

  return {
    tournamentId: uuidv4().slice(0, 14), // let user enter custom tournament Id
    games: games,
    players: GetTourneyPlayers_offline(formGamesArray),
  }
}

// Get array of Tournament players
function GetTourneyPlayers_offline(
  formGamesArray: GAME_TABLE_FORM[],
): Array<string> {
  const players = formGamesArray.reduce<string[]>(
    (acc_players, currentGame) => {
      if (!acc_players.includes(currentGame.value.black)) {
        acc_players.push(currentGame.value.black)
      } else if (!acc_players.includes(currentGame.value.white)) {
        acc_players.push(currentGame.value.white)
      }
      return acc_players
    },
    [],
  )
  return players
}
