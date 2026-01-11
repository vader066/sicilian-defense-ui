import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { usePlayers } from '@/hooks/players'
import { PlayerSelector } from '@/components/player-selector'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import type { PLAYER } from '@/types/players'

export const Route = createFileRoute(
  '/app/dashboard/_layout/tournaments/create-round-robin-tournament/',
)({
  component: CreateRoundRobinTournament,
})

function CreateRoundRobinTournament() {
  const { user } = Route.useRouteContext()
  const [selectedPlayers, setSelectedPlayers] = useState<PLAYER[]>([])

  const { data: players, isLoading, error } = usePlayers(user.club_id)

  const handleLogSelectedPlayers = () => {
    console.log('Selected Players:', selectedPlayers)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-500">Error loading players: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">
          Create Round Robin Tournament
        </h1>
        <Button onClick={handleLogSelectedPlayers} size="lg">
          Log Selected Players
        </Button>
      </div>

      <PlayerSelector
        players={players || []}
        selectedPlayers={selectedPlayers}
        onSelectedPlayersChange={setSelectedPlayers}
      />
    </div>
  )
}
