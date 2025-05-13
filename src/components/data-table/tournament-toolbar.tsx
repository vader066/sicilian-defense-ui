import { cn } from '@/lib/utils'
import { Spinner } from '../ui/spinner'
import { ratingPointsEval } from '@/services/tournament-services/tourney-rating'
import { type GAMES } from '@/types/database/models'
import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { BiSearch } from 'react-icons/bi'
import { localFetch } from '@/services/fetch'
import { usePlayerData } from '@/contexts/players-context'
import { toast } from '../toast'

// This toolbar for tournament tables performs calculations and updates the tournament synced state on the database
export function Toolbar({
  table,
  tournamentId,
  isSynced,
}: {
  table: Table<GAMES>
  tournamentId: string
  isSynced: boolean
}) {
  const [isSyncing, setIsSyncing] = useState(false)
  const [isRated, setIsRated] = useState(isSynced)
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
  const { players } = usePlayerData()

  // calculate ratingUpdates
  async function syncRatings(tData: GAMES[]) {
    setIsSyncing(true)
    const { updatedGames, ratingUpdates } = ratingPointsEval({
      tourneyGames: tData,
      globPlayers: players,
    })
    try {
      console.log(tournamentId)
      const response = await localFetch(`/sync-tournament/${tournamentId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          games: updatedGames,
          ratingUpdates: ratingUpdates,
        }),
      })

      console.log(response)
      setIsRated(true)
      toast({
        title: 'Tournament synced successfully',
        description: 'Tournament has been synced successfully',
        variant: 'success',
      })
    } catch (error) {
      console.log(error)
    } finally {
      setIsSyncing(false)
      console.log(updatedGames)
      // console.log(ratingUpdates)
    }
  }
  return (
    <ul className="flex flex-row-reverse justify-end gap-3 w-full">
      {!isRated && (
        <button
          disabled={isSyncing}
          onClick={() => {
            syncRatings(tData)
          }}
          className={cn(
            'rounded-md text-white text-sm bg-black p-3',
            `${isSyncing ? 'opacity-30' : ''}`,
          )}
        >
          {isSyncing ? <Spinner /> : 'Sync'}
        </button>
      )}
      <label className="flex items-center text-black/70 gap-2 rounded-md p-2 border border-black/50 ml-auto text-sm">
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
      <span className="flex font-bold items-center text-2xl">
        {tournamentId ?? 'N/A'}
      </span>
    </ul>
  )
}
