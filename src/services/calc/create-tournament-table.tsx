'use client'

import DataTable from '@/components/data-table'
import {
  type APPWRITE_TOURNAMENT,
  type GAMES,
  type TTableData,
} from '@/types/database/models'
import { Toolbar } from '@/components/data-table/tournament-toolbar'
import { useEffect } from 'react'

// This function is for constructing the tournament table object to be displayed on the history page
function CreateTournamentTData(games: GAMES[]): TTableData[] {
  const tournamentTableData: TTableData[] = games.map((game) => {
    return {
      white: game.players[0],
      black: game.players[1],
      winner: game.winner,
    }
  })

  return tournamentTableData
}

// This is for creating the tournament tables from the tournaments fetched from appwrite database
export function CreateTournamentTables(data: APPWRITE_TOURNAMENT) {
  const tournTables = data.documents.map((tourn) => {
    const tData = CreateTournamentTData(tourn.games)
    return (
      <DataTable
        key={tourn.tournamentId}
        DataTableToolbar={(props) => (
          <Toolbar
            {...props}
            tournamentId={tourn.tournamentId as string}
            isSynced={tourn.synced as boolean}
          />
        )}
        isLoading={false}
        data={tData}
        columns={[
          {
            accessorKey: 'white',
            header: 'White',
          },
          {
            accessorKey: 'black',
            header: 'Black',
          },
          {
            accessorKey: 'winner',
            header: 'Winner',
          },
        ]}
      />
    )
  })

  return tournTables
}
