import { type GAMES, type TOURNAMENT } from '@/types/database/models'
import { type ARENATOURNAMENTGAME } from '@/types/lichess/game'
import { localFetch } from '../fetch'

// 1. fetch a tournament data from our api which fetches the tournament from lichess api
export async function RecordNewTournament(tournamentId: string) {
  //fetch lichess tournament data through our api
  try {
    const response = await localFetch<ARENATOURNAMENTGAME[]>(
      `/lichess-tournament/${tournamentId}`,
    )
    const lichessTournamentGames = response.data
    console.log('Games successfully fetched')

    //Create tournament game objects according to db schema
    const tournamentGames = CreateTournamentGames(
      lichessTournamentGames,
      tournamentId,
    )
    //create tournament object according to db schema
    const tournament: TOURNAMENT = {
      tournamentId: tournamentId,
      games: tournamentGames,
      players: getPlayers(lichessTournamentGames),
    }

    return tournament
  } catch (error) {
    console.error(error)
  }
}

//create tournament game objects according to our appwrite database structure
function CreateTournamentGames(
  tournamentGames: Array<ARENATOURNAMENTGAME>,
  tournamentId: string,
) {
  const tournament = tournamentGames.map((game) => {
    let newgame: GAMES = {
      // tournamentId: tournamentId,
      gameId: game.id,
      players: [game.players.white.user.id, game.players.black.user.id],
      winner: getWinner(game),
      date: new Date().toLocaleString(),
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
