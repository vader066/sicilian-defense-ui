import DataTable from '@/components/data-table'
import { Toolbar } from '@/components/data-table/tournament-toolbar'
import {
  type APPWRITE_TOURNAMENT,
  type GAMES,
  type TOURNAMENT,
} from '@/types/database/models'
import { getPlayerName } from '../player-services'
import { usePlayerData } from '@/contexts/players-context'
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
            accessorKey: 'white',
            header: 'White',
            cell: (row) => {
              const username = row.getValue() as string
              return getPlayerName(username, players)
            },
          },
          {
            accessorKey: 'black',
            header: 'Black',
            cell: (row) => {
              const username = row.getValue() as string
              return getPlayerName(username, players)
            },
          },
          {
            accessorKey: 'winner',
            header: 'Winner',
            cell: (row) => {
              const username = row.getValue() as string
              return getPlayerName(username, players)
            },
          },
        ]}
      />
    )
  })

  return tournTables
}
