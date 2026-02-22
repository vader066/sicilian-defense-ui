import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { usePlayers } from '@/hooks/players'
import { useCreateRoundRobinTournament } from '@/hooks/tournaments'
import { PlayerSelector } from '@/components/player-selector'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import type { PLAYER } from '@/types/players'

export const Route = createFileRoute(
  '/app/dashboard/_layout/tournaments/create-round-robin-tournament/',
)({
  component: CreateRoundRobinTournament,
})

function CreateRoundRobinTournament() {
  const { user } = Route.useRouteContext()
  const [tournamentName, setTournamentName] = useState('')
  const [selectedPlayers, setSelectedPlayers] = useState<PLAYER[]>([])

  const { data: players, isLoading, error } = usePlayers()
  const { mutate: createTournament, isPending } = useCreateRoundRobinTournament(
    user.club_id,
  )

  const handleCreateTournament = () => {
    if (!tournamentName.trim()) {
      alert('Please enter a tournament name')
      return
    }

    if (selectedPlayers.length < 2) {
      alert('Please select at least 2 players')
      return
    }

    createTournament({
      tournamentName: tournamentName.trim(),
      playerIDs: selectedPlayers.map((p) => p.id),
    })
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
        <Button onClick={handleCreateTournament} size="lg" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create Tournament'}
        </Button>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <label className="block mb-3">
          <span className="text-sm font-semibold text-slate-700 mb-2 block">
            Tournament Name
          </span>
          <Input
            type="text"
            placeholder="Enter tournament name"
            value={tournamentName}
            onChange={(e) => setTournamentName(e.target.value)}
            disabled={isPending}
          />
        </label>
      </div>

      <PlayerSelector
        players={players || []}
        selectedPlayers={selectedPlayers}
        onSelectedPlayersChange={setSelectedPlayers}
      />
    </div>
  )
}
