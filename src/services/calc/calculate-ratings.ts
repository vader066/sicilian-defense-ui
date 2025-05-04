import { players as playerstore } from '@/store/player-data'
import { type PLAYER, type TTableData } from '@/types/database/models'

// creates a list of players and their rating difference after all the games they played
export function calcRatingUpdates(tournament: TTableData[]): Updates[] {
  let players = playerstore
  const results: Updates[] = tournament.flatMap((game) => {
    const duel: match = {
      black: {
        name: game.black,
        id: GetId(game.black, players),
        rating: GetRating(game.black, players),
      },
      white: {
        name: game.white,
        id: GetId(game.white, players),
        rating: GetRating(game.white, players),
      },
      winner: game.winner,
    }
    // calculate rating diff of both players
    let blackRatingDiff = blackDiff(duel)

    // console.log(blackRatingDiff);

    let whiteRatingDiff = whiteDiff(duel)
    // console.log(whiteRatingDiff);

    // update players array with new ratings
    UpdatePlayerRating(duel.black.name, blackRatingDiff, players)
    UpdatePlayerRating(duel.white.name, whiteRatingDiff, players)
    console.log(players)

    const newRatings = [
      {
        name: game.black,
        id: GetId(game.black, players),
        diff: blackRatingDiff,
      },
      {
        name: game.white,
        id: GetId(game.white, players),
        diff: whiteRatingDiff,
      },
    ]
    return newRatings
  })
  return results
}

export function GetId(name: string, players: PLAYER[]): string {
  const player = players.find((player) => player.name === name)
  return player ? player.id : ''
}
export function GetRating(name: string, players: PLAYER[]): number {
  const player = players.find((player) => player.name === name)
  return player ? player.rating : 0
}
export function UpdatePlayerRating(
  name: string,
  diff: number,
  players: PLAYER[],
): void {
  //find player
  // console.log(diff);

  const player = players.find((player) => player.name === name)
  // console.log(`${player?.name}: ${player?.rating}`);
  //update the players rating in the original array
  if (player) {
    player.rating += diff
  }
  // console.log(`${player?.name}: ${player?.rating}`);
}

// EXPECTED SCORES
function blackExpectedScore(duel: match): number {
  const result =
    1 / (1 + Math.pow(10, (duel.white.rating - duel.black.rating) / 400))
  return result
}
function whiteExpectedScore(duel: match): number {
  const result =
    1 / (1 + Math.pow(10, (duel.black.rating - duel.white.rating) / 400))
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

// Rating debit or credit
function blackDiff(duel: match): number {
  const expectedScore = blackExpectedScore(duel)
  const kFactor = getKFactor(duel.black.rating)
  const score: 1 | 0 = duel.winner === duel.black.name ? 1 : 0
  const diff = kFactor * (score - expectedScore)
  // console.log(diff);
  return diff
}
function whiteDiff(duel: match): number {
  const expectedScore = whiteExpectedScore(duel)
  console.log(expectedScore)
  const kFactor = getKFactor(duel.white.rating)
  console.log(kFactor)
  const score: 1 | 0 = duel.winner === duel.white.name ? 1 : 0
  const diff = kFactor * (score - expectedScore)
  console.log(diff)
  return diff
}

export interface Updates {
  name: string
  id: string
  diff: number
}

export interface match {
  black: PLAYER
  white: PLAYER
  winner: string
}
