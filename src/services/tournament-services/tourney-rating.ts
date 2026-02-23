import type { GAME } from '@/types/games'
import { GetTourneyPlayers } from '.'
import type { PLAYER } from '@/types/players'

// evaluate the new ratings of the players after the tournament results
export function ratingPointsEval({
  tourneyGames,
  globPlayers,
}: {
  tourneyGames: GAME[]
  globPlayers: PLAYER[]
}): { ratingUpdates: ratingUpdate[]; updatedGames: GAME[] } {
  // Gets the array of ID's of all players who played in the tournament
  const playerList = GetTourneyPlayers(tourneyGames)

  //Maps through array of ID's returns ID and ratings of players who played the tournament
  const localTourneyPlayers: ratingUpdate[] = playerList.map((id) => {
    const player = globPlayers.find((player) => player.id === id)
    if (player) {
      return {
        playerId: player.id,
        newRating: player.rating,
      }
    } else {
      throw new Error(
        `Player with ID: "${id}" exists in the tournament but cannot be found in global players List`,
      )
    }
  })
  console.log('Local players:', localTourneyPlayers)

  tourneyGames.forEach((game) => {
    // updating games rating fields with entry ratings of both players
    game.black_rating = localTourneyPlayers.find(
      (player) => player?.playerId === game.black,
    )?.newRating
    game.white_rating = localTourneyPlayers.find(
      (player) => player?.playerId === game.white,
    )?.newRating

    // calculating rating points for players
    const blackRatingPoints = parseFloat(blackPoints(game).toFixed(2))
    const whiteRatingPoints = parseFloat(whitePoints(game).toFixed(2))

    // update the localPlayers array by adding the rating points to the ratings of the appropriate players
    localTourneyPlayers.forEach((player) => {
      if (player?.playerId === game.black) {
        player.newRating += blackRatingPoints
      }
      if (player?.playerId === game.white) {
        player.newRating += whiteRatingPoints
      }
    })
  })

  //returns an array of players and their new ratings
  return { ratingUpdates: localTourneyPlayers, updatedGames: tourneyGames }
}

type ratingUpdate = {
  playerId: string
  newRating: number
}

// EXPECTED SCORES
function blackExpectedScore(duel: GAME): number {
  const result =
    1 / (1 + Math.pow(10, (duel.white_rating! - duel.black_rating!) / 400))
  return result
}
function whiteExpectedScore(duel: GAME): number {
  const result =
    1 / (1 + Math.pow(10, (duel.black_rating! - duel.white_rating!) / 400))
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

function blackPoints(duel: GAME): number {
  const expectedScore = blackExpectedScore(duel)
  const kFactor = getKFactor(duel.black_rating!)

  // determine score based on game result: draw, win, forfeit
  let score: 1 | 0 | 0.5
  if (duel.draw) {
    score = 0.5
  } else if (duel.forfeit === 'BF' || duel.forfeit === 'FF') {
    // If black forfeited or both forfeited, black gets 0 points
    score = 0
  } else if (duel.winner === duel.black) {
    score = 1
  } else {
    throw new Error(
      `Game result is invalid or missing for game_id: ${duel.game_id}`,
    )
  }
  const ratingPoints = kFactor * (score - expectedScore)
  // console.log(ratingPoints);
  return ratingPoints
}

function whitePoints(duel: GAME): number {
  const expectedScore = whiteExpectedScore(duel)
  const kFactor = getKFactor(duel.white_rating!)
  // console.log(kFactor)
  // determine score based on game result: draw, win, forfeit
  let score: 1 | 0 | 0.5
  if (duel.draw) {
    score = 0.5
  } else if (duel.forfeit === 'WF' || duel.forfeit === 'FF') {
    // If white forfeited or both forfeited, white gets 0 points
    score = 0
  } else if (duel.winner === duel.white) {
    score = 1
  } else {
    throw new Error(
      `Game result is invalid or missing for game_id: ${duel.game_id}`,
    )
  }
  const ratingPoints = kFactor * (score - expectedScore)
  // console.log(ratingPoints)
  return ratingPoints
}
