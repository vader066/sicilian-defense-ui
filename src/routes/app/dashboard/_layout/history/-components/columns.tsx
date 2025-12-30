import { Badge } from '@/components/ui/badge'
import type { DBTourney } from '@/types/tournament'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

export const tournamentColumns: ColumnDef<DBTourney>[] = [
  {
    accessorKey: 'tournament_name',
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
    accessorKey: 'number_of_players',
    header: () => {
      return (
        <div className="font-medium w-full justify-center flex text-slate-600">
          Players
        </div>
      )
    },
    cell: (row) => {
      const players = row.getValue() as number
      return (
        <div className="font-medium w-full justify-center flex text-slate-600">
          {players}
        </div>
      )
    },
  },
  {
    accessorKey: 'began_at',
    header: () => {
      return (
        <div className="font-medium w-full justify-center flex text-slate-600">
          Began At
        </div>
      )
    },
    cell: (row) => {
      const dateStr = row.getValue() as string
      const fmtDate = format(new Date(dateStr), 'PPP')
      return (
        <div className="font-medium w-full justify-center flex text-slate-600">
          {fmtDate}
        </div>
      )
    },
  },
  {
    accessorKey: 'synced',
    header: () => {
      return (
        <div className="font-medium w-full justify-center flex text-slate-600">
          Synced
        </div>
      )
    },
    cell: (row) => {
      const synced = row.getValue() as boolean
      return (
        <div className="font-medium w-full justify-center flex text-slate-600">
          {synced ? (
            <Badge variant="default">Synced</Badge>
          ) : (
            <Badge variant="destructive">Not Synced</Badge>
          )}
        </div>
      )
    },
  },
  // {
  //   accessorKey: 'id',
  //   header: () => {
  //     return (
  //       <div className="font-medium w-full justify-center flex text-slate-600">
  //         Actions
  //       </div>
  //     )
  //   },
  //   cell: (row) => {
  //     const id = row.getValue() as string
  //     return (
  //       <div className="font-medium w-full justify-center flex text-slate-600">
  //         <Button variant="link" href={`/app/dashboard/history/${id}`}>
  //           View
  //         </Button>
  //       </div>
  //     )
  //   },
  // },
  // {
  //   accessorKey: 'docId',
  //   header: 'Date',
  //   cell: () => {
  //     const date = new Date()
  //     const dateStr = date.toLocaleDateString('en-US', {
  //       year: 'numeric',
  //       month: '2-digit',
  //       day: '2-digit',
  //     })
  //     return (
  //       <div className="font-medium w-full flex text-slate-600">{dateStr}</div>
  //     )
  //   },
  // },
]
