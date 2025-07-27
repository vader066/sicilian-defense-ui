import { Badge } from '@/components/ui/badge'
import { Calendar, LucideNotebookPen, UsersIcon } from 'lucide-react'
import DataTable from '@/components/data-table'
import type { TOURNAMENT } from '@/types/database/models'
import { GetTourneyPlayers } from '@/services/tournament-services'
import { Button } from '@/components/ui/button'

export function TournamentTable({
  tournament,
  action,
  isCreating,
}: {
  tournament: TOURNAMENT
  action?: (e: any) => Promise<void>
  isCreating?: boolean
}) {
  const getWinnerBadge = (winner: string) => {
    if (winner === 'Draw') {
      return <Badge variant="secondary">Draw</Badge>
    }
    return <Badge variant="default">{winner}</Badge>
  }
  return (
    <DataTable
      data={tournament.games}
      TheadClassName="!text-start font-semibold text-slate-700"
      TcellClassName="py-4! border-b border-slate-100 font-semibold text-slate-800"
      DataTableToolbar={() => {
        return (
          <div className="w-full py-6 px-6 flex gap-3 flex-col bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-t-lg">
            <div className="w-full flex items-center justify-between">
              <h1 className="font-bold text-2xl">{tournament.tournamentId}</h1>
              <Button
                disabled={isCreating}
                type="button"
                onClick={action}
                className="flex gap-2 bg-slate-200 text-slate-800 hover:bg-slate-300 cursor-pointer"
              >
                {isCreating ? (
                  <div className="flex items-center gap-2 ">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </div>
                ) : (
                  <div className="contents">
                    <span>Add to History</span>
                    <LucideNotebookPen />
                  </div>
                )}
              </Button>
            </div>
            <div className="flex gap-3 text-slate-200 text-sm font-semibold">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {'March 15-17, 2024' /* Replace with actual date later */}
              </span>
              <span className="flex items-center gap-1">
                <UsersIcon className="h-4 w-4" />
                {GetTourneyPlayers(tournament.games).length} participants
              </span>
            </div>
          </div>
        )
      }}
      isLoading={false}
      columns={[
        {
          id: 'matchNumber',
          header: 'Match #',
          cell: ({ row }) => {
            return (
              <div className="font-medium w-full flex text-slate-600">
                #{row.index + 1}
              </div>
            )
          },
        },
        {
          accessorKey: 'black',
          header: 'Black Player',
          cell: (row) => {
            return (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-800 rounded-full"></div>
                {row.getValue() as string}
              </div>
            )
          },
        },
        {
          accessorKey: 'white',
          header: 'White Player',
          cell: (row) => {
            return (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white border-2 border-slate-300 rounded-full"></div>
                {row.getValue() as string}
              </div>
            )
          },
        },
        {
          accessorKey: 'winner',
          header: 'Winner',
          cell: (row) => {
            return (
              <div className="w-full flex">
                {getWinnerBadge(row.getValue() as string)}
              </div>
            )
          },
        },
      ]}
    />
  )
}
