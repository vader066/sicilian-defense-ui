// // import { players as playerstore } from '@/store/player-data'
// import { type PLAYER, type GAMES } from '@/types/database/models'

// // creates a list of players and their rating Pointserence after all the games they played
// export function calcRatingUpdates(
//   tournamentGames: GAMES[],
//   players: PLAYER[],
// ): Updates[] {
//   // let players = playerstore
//   const results: Updates[] = tournamentGames.flatMap((game) => {
//     const duel: match = {
//       black: {
//         first_name: game.black,
//         username: GetId(game.black, players),
//         rating: GetRating(game.black, players),
//       },
//       white: {
//         first_name: game.white,
//         username: GetId(game.white, players),
//         rating: GetRating(game.white, players),
//       },
//       winner: game.winner,
//     }
//     // calculate rating ratingPoints of both players
//     let blackRatingPoints = blackPoints(duel)

//     // console.log(blackRatingPoints);

//     let whiteRatingPoints = whitePoints(duel)
//     // console.log(whiteRatingPoints);

//     // update players array with new ratings
//     UpdatePlayerRating(duel.black.first_name, blackRatingPoints, players)
//     UpdatePlayerRating(duel.white.first_name, whiteRatingPoints, players)
//     console.log(players)

//     const newRatings = [
//       {
//         first_name: game.black,
//         username: GetId(game.black, players),
//         ratingPoints: blackRatingPoints,
//       },
//       {
//         first_name: game.white,
//         username: GetId(game.white, players),
//         ratingPoints: whiteRatingPoints,
//       },
//     ]
//     return newRatings
//   })
//   return results
// }

// export function GetId(first_name: string, players: PLAYER[]): string {
//   const player = players.find((player) => player.first_name === first_name)
//   return player ? player.username : ''
// }
// export function GetRating(first_name: string, players: PLAYER[]): number {
//   const player = players.find((player) => player.first_name === first_name)
//   return player ? player.rating : 0
// }
// export function UpdatePlayerRating(
//   first_name: string,
//   ratingPoints: number,
//   players: PLAYER[],
// ): void {
//   //find player
//   // console.log(ratingPoints);

//   const player = players.find((player) => player.first_name === first_name)
//   // console.log(`${player?.first_name}: ${player?.rating}`);
//   //update the players rating in the original array
//   if (player) {
//     player.rating += ratingPoints
//   }
//   // console.log(`${player?.first_name}: ${player?.rating}`);
// }

// // EXPECTED SCORES
// function blackExpectedScore(duel: match): number {
//   const result =
//     1 / (1 + Math.pow(10, (duel.white.rating - duel.black.rating) / 400))
//   return result
// }
// function whiteExpectedScore(duel: match): number {
//   const result =
//     1 / (1 + Math.pow(10, (duel.black.rating - duel.white.rating) / 400))
//   return result
// }

// // K-FACTOR
// function getKFactor(rating: number): 10 | 20 | 40 {
//   if (rating > 2400) {
//     return 10
//   } else if (rating >= 1600) {
//     return 20
//   } else {
//     return 40
//   }
// }

// // Rating debit or credit
// function blackPoints(duel: match): number {
//   const expectedScore = blackExpectedScore(duel)
//   const kFactor = getKFactor(duel.black.rating)
//   const score: 1 | 0 = duel.winner === duel.black.first_name ? 1 : 0
//   const ratingPoints = kFactor * (score - expectedScore)
//   // console.log(ratingPoints);
//   return ratingPoints
// }
// function whitePoints(duel: match): number {
//   const expectedScore = whiteExpectedScore(duel)
//   console.log(expectedScore)
//   const kFactor = getKFactor(duel.white.rating)
//   console.log(kFactor)
//   const score: 1 | 0 = duel.winner === duel.white.first_name ? 1 : 0
//   const ratingPoints = kFactor * (score - expectedScore)
//   console.log(ratingPoints)
//   return ratingPoints
// }

// export interface Updates {
//   first_name: string
//   username: string
//   ratingPoints: number
// }

// export interface match {
//   black: PLAYER
//   white: PLAYER
//   winner: string
// }
