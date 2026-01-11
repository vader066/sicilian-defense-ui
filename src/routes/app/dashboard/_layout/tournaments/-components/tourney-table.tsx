import DataTable from '@/components/data-table'
import { Toolbar } from '@/components/data-table/tournament-toolbar'
import { Badge } from '@/components/ui/badge'
import { getPlayer } from '@/services/player-services'
import type { GAME } from '@/types/games'
import type { ColumnDef } from '@tanstack/react-table'
import type { PLAYER } from '@/types/players'
import type { TOURNAMENT } from '@/types/tournament'
// import { useMemo } from 'react'
import { PiWarningDiamond } from 'react-icons/pi'

const getWinnerBadge = (winner: string) => {
  if (winner === 'Draw') {
    return <Badge variant="secondary">Draw</Badge>
  }
  return <Badge variant="default">{winner}</Badge>
}
export function TourneyTable({
  tournament,
  players,
}: {
  tournament: TOURNAMENT
  players: PLAYER[]
}) {
  const columns: ColumnDef<GAME>[] = [
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
        const playerId = row.getValue() as string
        const player = getPlayer(playerId, players)
        return (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white border-2 border-slate-300 rounded-full"></div>
            {player ? (
              player.username
            ) : (
              <div className="text-red-500 flex gap-2 items-center">
                <span>{playerId}</span>
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
        const playerId = row.getValue() as string
        const player = getPlayer(playerId, players)
        return (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-800 rounded-full"></div>
            {player ? (
              player.username
            ) : (
              <div className="text-red-500 flex gap-2 items-center">
                <span>{playerId}</span>
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
        const playerId = row.getValue() as string
        const player = getPlayer(playerId, players)
        return (
          <div className="contents">
            {player ? (
              getWinnerBadge(player.username)
            ) : (
              <div className="text-red-500 flex gap-2 w-full justify-center items-center">
                {getWinnerBadge(playerId)}
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
        <Toolbar {...props} players={players} tourney={tournament} />
      )}
      isLoading={false}
      data={tournament?.games || []}
      columns={columns}
    />
  )
}
