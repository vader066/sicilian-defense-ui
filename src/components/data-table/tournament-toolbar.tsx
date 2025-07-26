import { Spinner } from '../ui/spinner'
import { ratingPointsEval } from '@/services/tournament-services/tourney-rating'
import {
  type GAMES,
  type PLAYER,
  type TOURNAMENT,
} from '@/types/database/models'
import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { BiSearch } from 'react-icons/bi'
import { localFetch } from '@/services/fetch'
import { toast } from '../toast'
import { Button } from '../ui/button'
import { FaSyncAlt } from 'react-icons/fa'
import { Calendar, UsersIcon } from 'lucide-react'
import { GetTourneyPlayers } from '@/services/tournament-services'

// This toolbar for tournament tables performs calculations and updates the tournament synced state on the database
export function Toolbar({
  table,
  tourney,
  players,
}: {
  table: Table<GAMES>
  tourney: TOURNAMENT
  players: PLAYER[]
}) {
  const [isSyncing, setIsSyncing] = useState(false)
  const [isRated, setIsRated] = useState(tourney.synced)
  const tData = table.options.data

  // search functionality
  const winner = table.getState().columnFilters.find((f) => {
    f.id === 'winner'
  })?.value
  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    table.setColumnFilters((prev) => {
      return prev
        .filter((e) => e.id != 'winner')
        .concat({
          id: 'winner',
          value: e.target.value,
        })
    })
  }

  // calculate ratingUpdates
  async function syncRatings(tData: GAMES[]) {
    setIsSyncing(true)
    const { updatedGames, ratingUpdates } = ratingPointsEval({
      tourneyGames: tData,
      globPlayers: players,
    })
    try {
      console.log(tourney.tournamentId)
      const response = await localFetch(
        `/sync-tournament/${tourney.tournamentId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            games: updatedGames,
            ratingUpdates: ratingUpdates,
          }),
        },
      )

      console.log(response)
      toast({
        title: 'Tournament synced successfully',
        description: 'Tournament has been synced successfully',
        variant: 'success',
      })
      setIsRated(true)
    } catch (error) {
      console.log(error)
    } finally {
      setIsSyncing(false)
      console.log(updatedGames)
      // console.log(ratingUpdates)
    }
  }
  return (
    <div className="w-full py-6 px-6 flex gap-3 flex-col bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-t-lg">
      <div className="w-full flex items-center justify-between">
        <h1 className="font-bold text-2xl">{tourney.tournamentId}</h1>
        {!isRated && (
          <Button
            disabled={isSyncing}
            onClick={() => {
              syncRatings(tData)
            }}
            type="button"
            className="flex gap-2 bg-slate-200 text-slate-800 hover:bg-slate-300 cursor-pointer"
          >
            {isSyncing ? (
              <Spinner />
            ) : (
              <div className="contents">
                <span>Sync</span>
                <FaSyncAlt />
              </div>
            )}
          </Button>
        )}
      </div>
      <div className="flex gap-3 text-slate-200 text-sm font-semibold">
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {'March 15-17, 2024' /* Replace with actual date later */}
        </span>
        <span className="flex items-center gap-1">
          <UsersIcon className="h-4 w-4" />
          {GetTourneyPlayers(tourney.games).length} participants
        </span>
        <label className="flex items-center bg-white text-black/70 gap-2 rounded-md p-2 border border-black/50 ml-auto text-sm">
          <span>
            <BiSearch />
          </span>
          <input
            type="text"
            placeholder="Search Winner"
            value={winner as string}
            onChange={(e) => {
              handleFilter(e)
            }}
            className="focus:outline-none"
          />
        </label>
      </div>
    </div>
  )
}
