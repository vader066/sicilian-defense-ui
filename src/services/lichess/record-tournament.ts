import { type ARENATOURNAMENTGAME } from '@/types/lichess/game'
import type { GAME } from '@/types/games'
import type { TOURNAMENT } from '@/types/tournament'

// 1. fetch a tournament data from our api which fetches the tournament from lichess api
export function TransformLichessTournament(
  lichessTournament: ARENATOURNAMENTGAME[],
  tournamentName: string,
) {
  //Create tournament game objects according to db schema
  const tournamentGames = TransformLichessGames(lichessTournament)
  //create tournament object according to db schema
  const tournament: TOURNAMENT = {
    tournamentName,
    id: '', // to be filled by database
    numberOfRounds: 1, // Arena tournaments don't have rounds
    numberOfGames: tournamentGames.length,
    games: tournamentGames,
    status: 'completed',
    beganAt: new Date(),
    clubId: '', // to be filled at the time of adding to db
    playerIDs: getPlayers(lichessTournament), // these are actually their usernames on lichess
  }

  return tournament
}

//create tournament game objects according to our appwrite database structure
function TransformLichessGames(
  tournamentGames: Array<ARENATOURNAMENTGAME>,
): Array<GAME> {
  // no draw/forfeit for arena tournament games
  const tournament = tournamentGames.map((game) => {
    let newgame: GAME = {
      round: 1,
      game_id: game.id,
      black: game.players.black.user.id, //username
      white: game.players.white.user.id, //username
      black_rating: game.players.black.ratingDiff,
      white_rating: game.players.white.ratingDiff,
      winner: getWinner(game), //username
      played_at: game.createdAt.toString(),
      draw: false,
    }
    return newgame
  })

  return tournament
}

function getWinner(game: ARENATOURNAMENTGAME): string {
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
