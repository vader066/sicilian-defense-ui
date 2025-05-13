import type { GAMES, PLAYER } from '@/types/database/models'
import { GetTourneyPlayers } from '.'

// evaluate the new ratings of the players after the tournament results
export function ratingPointsEval({
  tourneyGames,
  globPlayers,
}: {
  tourneyGames: GAMES[]
  globPlayers: PLAYER[]
}): { ratingUpdates: ratingUpdate[]; updatedGames: GAMES[] } {
  // Gets the array of usernames of all players who played in the tournament
  const playerList = GetTourneyPlayers(tourneyGames)

  //Maps throuarray of username and ratings of players who played the tournament
  const localTourneyPlayers: ratingUpdate[] = playerList.map((username) => {
    const player = globPlayers.find((player) => player.username === username)
    if (player) {
      return {
        username: player.username,
        newRating: player.rating,
      }
    } else {
      throw new Error(
        `Player with username: "${username}" exists in the tournament but cannot be found in global players List`,
      )
    }
  })
  console.log('Local players:', localTourneyPlayers)

  tourneyGames.forEach((game) => {
    // updating games rating fields with entry ratings of both players
    game.blackRating = localTourneyPlayers.find(
      (player) => player?.username === game.black,
    )?.newRating
    game.whiteRating = localTourneyPlayers.find(
      (player) => player?.username === game.white,
    )?.newRating

    // calculating rating points for players
    const blackRatingPoints = parseFloat(blackPoints(game).toFixed(2))
    const whiteRatingPoints = parseFloat(whitePoints(game).toFixed(2))

    // update the localPlayers array by adding the rating points to the ratings of the appropriate usernames
    localTourneyPlayers.forEach((player) => {
      if (player?.username === game.black) {
        player.newRating += blackRatingPoints
      }
      if (player?.username === game.white) {
        player.newRating += whiteRatingPoints
      }
    })
  })

  //returns an array of players and their new ratings
  return { ratingUpdates: localTourneyPlayers, updatedGames: tourneyGames }
}

type ratingUpdate = {
  username: string
  newRating: number
}

// EXPECTED SCORES
function blackExpectedScore(duel: GAMES): number {
  const result =
    1 / (1 + Math.pow(10, (duel.whiteRating! - duel.blackRating!) / 400))
  return result
}
function whiteExpectedScore(duel: GAMES): number {
  const result =
    1 / (1 + Math.pow(10, (duel.blackRating! - duel.whiteRating!) / 400))
  return result
}

// K-FACTOR
function getKFactor(rating: number): 10 | 20 | 40 {
  if (rating > 2400) {
    return 10
  } else if (rating >= 1600) {
    return 20
  } else {
    return 40
  }
}

// calculates rating points for players

function blackPoints(duel: GAMES): number {
  const expectedScore = blackExpectedScore(duel)
  const kFactor = getKFactor(duel.blackRating!)
  const score: 1 | 0 = duel.winner === duel.black ? 1 : 0
  const ratingPoints = kFactor * (score - expectedScore)
  // console.log(ratingPoints);
  return ratingPoints
}

function whitePoints(duel: GAMES): number {
  const expectedScore = whiteExpectedScore(duel)
  const kFactor = getKFactor(duel.whiteRating!)
  // console.log(kFactor)
  const score: 1 | 0 = duel.winner === duel.white ? 1 : 0
  const ratingPoints = kFactor * (score - expectedScore)
  // console.log(ratingPoints)
  return ratingPoints
}
