import { cn } from '@/lib/utils'
import { Spinner } from '../ui/spinner'
import { calcRatingUpdates } from '@/services/calc/calculate-ratings'
import { type TTableData } from '@/types/database/models'
import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { BiSearch } from 'react-icons/bi'

// This toolbar for tournament tables performs calculations and updates the tournament synced state on the database
export function Toolbar({
  table,
  documentId,
  isSynced,
}: {
  table: Table<TTableData>
  documentId: string
  isSynced: boolean
}) {
  const [isSyncing, setIsSyncing] = useState(false)
  const [isRated, setIsRated] = useState(isSynced)
  const tData = table.options.data

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

  async function syncRatings(tData: TTableData[]) {
    setIsSyncing(true)
    const updates = calcRatingUpdates(tData)
    try {
      const response = await fetch('/api/db/sync-tournament', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          documentId: documentId,
        }),
      })

      if (!response.ok) {
        throw new Error('could not sync tournament')
      }
      const res_obj = await response.json()
      console.log(res_obj)
      setIsRated(true)
    } catch (error) {
      console.log(error)
    } finally {
      setIsSyncing(false)
      // console.log(updates);
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
      <span className="flex font-bold items-center text-2xl">Tourney Name</span>
    </ul>
  )
}
