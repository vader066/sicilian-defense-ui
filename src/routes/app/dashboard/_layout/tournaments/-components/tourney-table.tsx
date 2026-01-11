import DataTable from '@/components/data-table'
import { Toolbar } from '@/components/data-table/tournament-toolbar'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { usePlayers } from '@/hooks/players'
import { useGetTournament } from '@/hooks/tournaments'
import { getPlayer } from '@/services/player-services'
import type { GAME } from '@/types/games'
import type { DBTourney } from '@/types/tournament'
import type { ColumnDef } from '@tanstack/react-table'
// import { useMemo } from 'react'
import { PiWarningDiamond } from 'react-icons/pi'

const getWinnerBadge = (winner: string) => {
  if (winner === 'Draw') {
    return <Badge variant="secondary">Draw</Badge>
  }
  return <Badge variant="default">{winner}</Badge>
}
export function TourneyTable({ tourn }: { tourn: DBTourney }) {
  // get tournament with games
  const {
    data: tournament,
    isPending: tournamentPending,
    error: tournamentError,
  } = useGetTournament(tourn.id)

  // get club players
  const {
    data: players,
    isPending: playersPending,
    error: playersError,
  } = usePlayers(tourn.club_id)

  const isLoading = tournamentPending || playersPending

  const error = tournamentError || playersError

  if (isLoading) {
    return (
      <div className="contents">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="contents">
        <p>Error: {error.message}</p>
      </div>
    )
  }

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
      isLoading={isLoading}
      data={tournament?.games || []}
      columns={columns}
    />
  )
}
