import { Calendar, UsersIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { GetTourneyPlayers } from '@/services/tournament-services'
import type { TOURNAMENT } from '@/types/database/models'
import { FaSyncAlt } from 'react-icons/fa'

export function DataTableHeader({
  tourney,
  isSynced,
}: {
  tourney: TOURNAMENT
  isSynced: boolean
}) {
  return (
    <div className="w-full py-6 px-6 flex gap-3 flex-col bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-t-lg">
      <div className="w-full flex items-center justify-between">
        <h1 className="font-bold text-2xl">{tourney.tournamentId}</h1>
        {!isSynced && (
          <Button
            disabled={isSynced}
            type="button"
            className="flex gap-2 bg-slate-200 text-slate-800 hover:bg-slate-300 cursor-pointer"
          >
            <div className="contents">
              <span>Sync</span>
              <FaSyncAlt />
            </div>
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
      </div>
    </div>
  )
}
