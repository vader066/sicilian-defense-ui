import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { PLAYER } from '@/types/players'

interface PlayerSelectorProps {
  players: PLAYER[]
  selectedPlayers: PLAYER[]
  onSelectedPlayersChange: (players: PLAYER[]) => void
}

export function PlayerSelector({
  players,
  selectedPlayers,
  onSelectedPlayersChange,
}: PlayerSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const availablePlayers = useMemo(() => {
    return players.filter(
      (player) =>
        !selectedPlayers.some((selected) => selected.id === player.id),
    )
  }, [players, selectedPlayers])

  const filteredAvailablePlayers = useMemo(() => {
    if (!searchTerm) return availablePlayers
    const term = searchTerm.toLowerCase()
    return availablePlayers.filter(
      (player) =>
        player.first_name.toLowerCase().includes(term) ||
        player.last_name.toLowerCase().includes(term) ||
        player.username.toLowerCase().includes(term),
    )
  }, [availablePlayers, searchTerm])

  const handleSelectPlayer = (player: PLAYER) => {
    onSelectedPlayersChange([...selectedPlayers, player])
  }

  const handleUnselectPlayer = (player: PLAYER) => {
    onSelectedPlayersChange(selectedPlayers.filter((p) => p.id !== player.id))
  }

  return (
    <div className="flex gap-6 w-full">
      {/* Available Players Column */}
      <div className="flex-1 border rounded-lg p-4 bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-3 text-slate-800">
          Available Players
        </h3>
        <Input
          type="text"
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-3"
        />
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {filteredAvailablePlayers.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">
              No players available
            </p>
          ) : (
            filteredAvailablePlayers.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-3 border rounded hover:bg-slate-50 transition-colors"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-slate-800">
                    {player.first_name} {player.last_name}
                  </span>
                  <span className="text-sm text-slate-500">
                    @{player.username} • Rating: {player.rating}
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleSelectPlayer(player)}
                  className="ml-2"
                >
                  Select
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Selected Players Column */}
      <div className="flex-1 border rounded-lg p-4 bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-3 text-slate-800">
          Selected Players ({selectedPlayers.length})
        </h3>
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {selectedPlayers.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">
              No players selected
            </p>
          ) : (
            selectedPlayers.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-3 border rounded bg-slate-50"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-slate-800">
                    {player.first_name} {player.last_name}
                  </span>
                  <span className="text-sm text-slate-500">
                    @{player.username} • Rating: {player.rating}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleUnselectPlayer(player)}
                  className="ml-2"
                >
                  Remove
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
