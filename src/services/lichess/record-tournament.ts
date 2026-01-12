import { type ARENATOURNAMENTGAME } from '@/types/lichess/game'

import type { GAME } from '@/types/games'
import type { TOURNAMENT } from '@/types/tournament'

// 1. fetch a tournament data from our api which fetches the tournament from lichess api
export function RecordNewTournament(tournamentId: string, lichessGames: ARENATOURNAMENTGAME[]) {
  //fetch lichess tournament data through our api
  try {
    //Create tournament game objects according to db schema
    const tournamentGames = CreateTournamentGames(
      lichessGames,
      // tournamentId,
    )
    //create tournament object according to db schema
    const tournament: TOURNAMENT = {
      beganAt: new Date(),
      clubId: " ",
      id: " ",
      games: tournamentGames,
      tournamentName: tournamentId,
      numberOfGames: lichessGames.length,
      numberOfRounds: 1,
      status: "completed",
      playerIDs: getPlayers(lichessGames),
    }

    return tournament
  } catch (error) {
    console.error(error)
  }
}

//create tournament game objects according to our appwrite database structure
function CreateTournamentGames(
  tournamentGames: Array<ARENATOURNAMENTGAME>,
  // tournamentId: string,
) {
  // need to update this to include draws and forfeits but lichess api doesn't seem to provide draw/forfeit info - investigate
  const tournament = tournamentGames.map((game) => {
    let newgame: GAME = {
      round: 1,
      game_id: game.id,
      black: game.players.black.user.id,
      white: game.players.white.user.id,
      winner: getWinner(game),
      played_at: new Date().toISOString(),
      draw: false,
    }
    return newgame
  })

  return tournament
}

function getWinner(game: ARENATOURNAMENTGAME) {
  if (game.winner === 'white') {
    return game.players.white.user.id
  } else {
    return game.players.black.user.id
  }
}

function getPlayers(tournament: ARENATOURNAMENTGAME[]): Array<string> {
  const players = tournament.reduce<string[]>((acc_tourn, currentGame) => {
    if (!acc_tourn.includes(currentGame.players.black.user.id)) {
      acc_tourn.push(currentGame.players.black.user.id)
    } else if (!acc_tourn.includes(currentGame.players.white.user.id)) {
      acc_tourn.push(currentGame.players.white.user.id)
    }
    return acc_tourn
  }, [])

  return players
}
