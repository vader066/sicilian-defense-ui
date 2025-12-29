import { Calendar, UsersIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { GetTourneyPlayers } from '@/services/tournament-services'
import { FaSyncAlt } from 'react-icons/fa'
import type { Table } from '@tanstack/react-table'
import { useState } from 'react'
import { ratingPointsEval } from '@/services/tournament-services/tourney-rating'
import { BiSearch } from 'react-icons/bi'
import { Spinner } from '../ui/spinner'
import { cn } from '@/lib/utils'
import type { GAME } from '@/types/games'
import type { PLAYER } from '@/types/players'
import type { syncTournReq, TOURNAMENT } from '@/types/tournament'
import { useSyncTournament } from '@/hooks/tournaments'

export function DataTableHeader({
  players,
  table,
  tourney,
  isSynced,
}: {
  table: Table<GAME>
  players: PLAYER[]
  tourney: TOURNAMENT
  isSynced: boolean
}) {
  const { mutate: syncTourney, isPending: isSyncing } = useSyncTournament(
    tourney.clubId,
  )
  const [isRated, setIsRated] = useState(isSynced)
  const tData = tourney.games
  console.log(table)

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
  async function syncRatings(tData: GAME[]) {
    const { updatedGames, ratingUpdates } = ratingPointsEval({
      tourneyGames: tData,
      globPlayers: players,
    })
    const tournamentId = tourney.id
    const payload: syncTournReq = {
      tournamentId: tournamentId,
      updatedGames: updatedGames,
      ratingUpdates: ratingUpdates,
    }

    syncTourney(payload, {
      onSuccess: () => {
        setIsRated(true)
      },
    })
  }

  return (
    <div className="w-full py-6 px-6 flex gap-3 flex-col bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-t-lg">
      <div className="w-full flex items-center justify-between">
        <h1 className="font-bold text-2xl text-nowrap">
          {tourney.tournamentName}
        </h1>
        {!isRated && (
          <Button
            disabled={isSyncing}
            onClick={() => {
              syncRatings(tData)
            }}
            type="button"
            className={cn(
              'flex gap-2 bg-slate-200 text-slate-800 hover:bg-slate-300 cursor-pointer',
              `${isSyncing ? 'opacity-30' : ''}`,
            )}
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
        <ul className="flex flex-row-reverse justify-end gap-3 w-auto ml-auto">
          <label className="flex items-center text-black/70 gap-2 rounded-md p-2 border border-black/50 ml-auto text-sm bg-white  ">
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
        </ul>
      </div>
    </div>
  )
}
