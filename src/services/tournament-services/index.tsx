import DataTable from '@/components/data-table'
import { Toolbar } from '@/components/data-table/tournament-toolbar'
import {
  type APPWRITE_TOURNAMENT,
  type GAMES,
  type TOURNAMENT,
} from '@/types/database/models'
import { getPlayerName } from '../player-services'
import { usePlayerData } from '@/contexts/players-context'
import { PiWarningDiamond } from 'react-icons/pi'
import { Badge } from '@/components/ui/badge'
import { DataTableHeader } from '@/components/data-table/data-table-header'
// This will construct the appwrite database tournament data from the form data
// entered by admin on the add-offline-tourn page

export function CreateAppWriteTourney({
  games,
  tournamentName,
}: {
  games: GAMES[]
  tournamentName: string
}): TOURNAMENT {
  return {
    tournamentId: tournamentName,
    games: games,
    players: GetTourneyPlayers(games),
  }
}

// Creates an array of player usernames of all players that played in a tournament
export function GetTourneyPlayers(games: GAMES[]): Array<string> {
  const players = games.reduce<string[]>((acc_players, currentGame) => {
    if (!acc_players.includes(currentGame.black)) {
      acc_players.push(currentGame.black)
    }
    if (!acc_players.includes(currentGame.white)) {
      acc_players.push(currentGame.white)
    }
    return acc_players
  }, [])
  return players
}

// This is for creating the tournament tables from the tournaments fetched from appwrite database
export function CreateTournamentTables(data: APPWRITE_TOURNAMENT) {
  const { players, isLoading, error } = usePlayerData()
  const getWinnerBadge = (winner: string) => {
    if (winner === 'Draw') {
      return <Badge variant="secondary">Draw</Badge>
    }
    return <Badge variant="default">{winner}</Badge>
  }
  if (error) {
    return (
      <div className="contents">
        <p>Error: {error}</p>
      </div>
    )
  }
  const tournTables = data.documents.map((tourn) => {
    return (
      <DataTable
        key={tourn.tournamentId}
        TheadClassName="!text-start font-semibold text-slate-700"
        TcellClassName="py-4! border-b border-slate-100 font-semibold text-slate-800"
        DataTableHeader={() => (
          <DataTableHeader tourney={tourn} isSynced={tourn.synced as boolean} />
        )}
        DataTableToolbar={(props) => (
          <Toolbar
            {...props}
            players={players}
            tournamentId={tourn.tournamentId as string}
            isSynced={tourn.synced as boolean}
          />
        )}
        isLoading={isLoading}
        data={tourn.games}
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
            header: 'Winner',
            cell: (row) => {
              const username = row.getValue() as string
              const playerName = getPlayerName(username, players)
              return (
                <div className="contents">
                  {playerName ? (
                    getWinnerBadge(playerName)
                  ) : (
                    <div className="text-red-500 flex gap-2 items-center">
                      {getWinnerBadge(username)}
                      <PiWarningDiamond />
                    </div>
                  )}
                </div>
              )
            },
          },
        ]}
      />
    )
  })

  return tournTables
}
