import DataTable from '@/components/data-table'
import { Toolbar } from '@/components/data-table/tournament-toolbar'
import { Badge } from '@/components/ui/badge'
import { usePlayerData } from '@/contexts/players-context'
import { getPlayerName } from '@/services/player-services'
import type { GAMES, TOURNAMENT } from '@/types/database/models'
import type { ColumnDef } from '@tanstack/react-table'
import { PiWarningDiamond } from 'react-icons/pi'

const getWinnerBadge = (winner: string) => {
  if (winner === 'Draw') {
    return <Badge variant="secondary">Draw</Badge>
  }
  return <Badge variant="default">{winner}</Badge>
}
export function TourneyTable({ tourn }: { tourn: TOURNAMENT }) {
  const { players, isLoading, error } = usePlayerData()

  if (error) {
    return (
      <div className="contents">
        <p>Error: {error}</p>
      </div>
    )
  }

  const columns: ColumnDef<GAMES>[] = [
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
      accessorKey: 'white',
      header: 'White',
      cell: (row) => {
        const username = row.getValue() as string
        const playerName = getPlayerName(username, players)
        return (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white border-2 border-slate-300 rounded-full"></div>
            {playerName ? (
              playerName
            ) : (
              <div className="text-red-500 flex gap-2 items-center">
                <span>{username}</span>
                <PiWarningDiamond />
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'black',
      header: 'Black',
      cell: (row) => {
        const username = row.getValue() as string
        const playerName = getPlayerName(username, players)
        return (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-800 rounded-full"></div>
            {playerName ? (
              playerName
            ) : (
              <div className="text-red-500 flex gap-2 items-center">
                <span>{username}</span>
                <PiWarningDiamond />
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'winner',
      header: () => {
        return (
          <div className="font-medium w-full justify-center flex text-slate-600">
            Winner
          </div>
        )
      },
      cell: (row) => {
        const username = row.getValue() as string
        const playerName = getPlayerName(username, players)
        return (
          <div className="contents">
            {playerName ? (
              getWinnerBadge(playerName)
            ) : (
              <div className="text-red-500 flex gap-2 w-full justify-center items-center">
                {getWinnerBadge(username)}
                <PiWarningDiamond />
              </div>
            )}
          </div>
        )
      },
    },
  ]
  return (
    <DataTable
      TheadClassName="!text-start font-semibold text-slate-700"
      TcellClassName="py-4! border-b border-slate-100 font-semibold text-slate-800"
      DataTableToolbar={(props) => (
        <Toolbar {...props} players={players} tourney={tourn} />
      )}
      isLoading={isLoading}
      data={tourn.games}
      columns={columns}
    />
  )
}
