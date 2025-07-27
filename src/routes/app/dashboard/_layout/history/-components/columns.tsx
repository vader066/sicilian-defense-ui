import type { GAMES, TOURNAMENT } from '@/types/database/models'
import type { ColumnDef } from '@tanstack/react-table'

export const tournamentColumns: ColumnDef<TOURNAMENT>[] = [
  {
    accessorKey: 'tournamentId',
    header: 'Name',
    cell: (row) => {
      return (
        <div className="font-medium w-full flex text-slate-600">
          {row.getValue() as string}
        </div>
      )
    },
  },
  {
    accessorKey: 'games',
    header: () => {
      return (
        <div className="font-medium w-full justify-center flex text-slate-600">
          Games
        </div>
      )
    },
    cell: (row) => {
      const games = row.getValue() as Array<GAMES>
      return (
        <div className="font-medium w-full justify-center flex text-slate-600">
          {games.length}
        </div>
      )
    },
  },
  {
    accessorKey: 'players',
    header: () => {
      return (
        <div className="font-medium w-full justify-center flex text-slate-600">
          Players
        </div>
      )
    },
    cell: (row) => {
      const players = row.getValue() as Array<string>
      return (
        <div className="font-medium w-full justify-center flex text-slate-600">
          {players.length}
        </div>
      )
    },
  },
  {
    accessorKey: 'docId',
    header: 'Date',
    cell: () => {
      const date = new Date()
      const dateStr = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      return (
        <div className="font-medium w-full flex text-slate-600">{dateStr}</div>
      )
    },
  },
]
