import { createFileRoute } from '@tanstack/react-router'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { BiSave } from 'react-icons/bi'
import { BsPlusCircleDotted } from 'react-icons/bs'
import { FaTimesCircle } from 'react-icons/fa'
import { Spinner } from '@/components/ui/spinner'
import { RiErrorWarningFill } from 'react-icons/ri'
import { tournamentServices } from '@/services/tournament-services'
import { usePlayers } from '@/hooks/players'
import { useAddTournament } from '@/hooks/tournaments'
import type { GAME } from '@/types/games'
import type { PLAYER } from '@/types/players'

export const Route = createFileRoute(
  '/app/dashboard/_layout/home/add-offline-tourn/',
)({
  component: DynamicForm,
})

export type GameResultEntry = {
  game_id: string
  black: string // black player ID
  round: number
  white: string // white player ID
  result: 'black' | 'white' | 'draw' | 'WF' | 'BF' | 'FF'
  played_at: string
}

type RoundSection = {
  roundNumber: number
  games: GameResultEntry[]
}

type GameChangeField = 'white' | 'black' | 'result'

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

function makeDefaultGame(
  roundNumber: number,
  players: PLAYER[],
): GameResultEntry {
  const white = players[1] ?? players[0]
  const black = players[0]
  return {
    game_id: uuidv4(),
    white: white.id,
    black: black.id,
    round: roundNumber,
    result: 'black',
    played_at: new Date().toISOString(),
  }
}

function gameEntryToGame(gameRes: GameResultEntry): GAME {
  const { result, ...rest } = gameRes
  const gameBase: GAME = { ...rest, draw: false }
  if (result === 'white') gameBase.winner = gameRes.white
  else if (result === 'black') gameBase.winner = gameRes.black
  else if (result === 'draw') gameBase.draw = true
  else if (result === 'WF') gameBase.forfeit = 'WF'
  else if (result === 'BF') gameBase.forfeit = 'BF'
  else if (result === 'FF') gameBase.forfeit = 'FF'
  return gameBase
}

function getPlayerName(players: PLAYER[], id: string): string {
  const p = players.find((p) => p.id === id)
  return p ? `${p.first_name} ${p.last_name}` : 'N/A'
}

// ---------------------------------------------------------------------------
// Memoized sub-components
// ---------------------------------------------------------------------------

/**
 * The player dropdown items are identical for every select in every row.
 * Memoizing them means the list is built once and reused across all selects
 * for the lifetime of the players data — the single biggest render cost.
 */
const PlayerOptions = React.memo(function PlayerOptions({
  players,
  excludeId,
}: {
  players: PLAYER[]
  excludeId?: string
}) {
  return (
    <>
      {players
        .filter((p) => p.id !== excludeId)
        .map((p) => (
          <SelectItem key={p.id} value={p.id}>
            {p.first_name} {p.last_name}
          </SelectItem>
        ))}
    </>
  )
})

type GameRowProps = {
  game: GameResultEntry
  gameIndex: number
  roundIndex: number
  canRemove: boolean
  players: PLAYER[]
  onGameChange: (
    roundIndex: number,
    gameIndex: number,
    field: GameChangeField,
    value: string,
  ) => void
  onRemoveGame: (roundIndex: number, gameIndex: number) => void
}

/**
 * Each game row is memoized so that changing one game does not re-render
 * its siblings. React's shallow-equality check passes because setRounds
 * returns the same object reference for unchanged game entries.
 */
const GameRow = React.memo(function GameRow({
  game,
  gameIndex,
  roundIndex,
  canRemove,
  players,
  onGameChange,
  onRemoveGame,
}: GameRowProps) {
  return (
    <div className="grid grid-cols-[1fr_1fr_1.5fr_2rem] gap-3 items-center">
      {/* White player */}
      <Select
        value={game.white}
        onValueChange={(v) => onGameChange(roundIndex, gameIndex, 'white', v)}
      >
        <SelectTrigger className="h-9 bg-white border-black/15 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <PlayerOptions players={players} excludeId={game.black} />
        </SelectContent>
      </Select>

      {/* Black player */}
      <Select
        value={game.black}
        onValueChange={(v) => onGameChange(roundIndex, gameIndex, 'black', v)}
      >
        <SelectTrigger className="h-9 bg-white border-black/15 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <PlayerOptions players={players} excludeId={game.white} />
        </SelectContent>
      </Select>

      {/* Result */}
      <Select
        value={game.result}
        onValueChange={(v) => onGameChange(roundIndex, gameIndex, 'result', v)}
      >
        <SelectTrigger className="h-9 bg-white border-black/15 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="white">
            {getPlayerName(players, game.white)} Wins
          </SelectItem>
          <SelectItem value="black">
            {getPlayerName(players, game.black)} Wins
          </SelectItem>
          <SelectItem value="draw">Draw</SelectItem>
          <SelectItem value="WF">
            {getPlayerName(players, game.white)} Forfeit
          </SelectItem>
          <SelectItem value="BF">
            {getPlayerName(players, game.black)} Forfeit
          </SelectItem>
          <SelectItem value="FF">Double Forfeit</SelectItem>
        </SelectContent>
      </Select>

      {/* Remove game */}
      <button
        type="button"
        onClick={() => onRemoveGame(roundIndex, gameIndex)}
        disabled={!canRemove}
        className={cn(
          'flex items-center justify-center p-1.5 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 transition',
          !canRemove && 'opacity-25 pointer-events-none',
        )}
        title="Remove game"
      >
        <FaTimesCircle size={15} />
      </button>
    </div>
  )
})

type RoundCardProps = {
  round: RoundSection
  roundIndex: number
  isOnly: boolean
  players: PLAYER[]
  onGameChange: (
    roundIndex: number,
    gameIndex: number,
    field: GameChangeField,
    value: string,
  ) => void
  onRemoveGame: (roundIndex: number, gameIndex: number) => void
  onAddGame: (roundIndex: number) => void
  onRemoveRound: (roundIndex: number) => void
}

/**
 * Each round card is memoized so that adding/changing games in one round
 * does not re-render any other round.
 */
const RoundCard = React.memo(function RoundCard({
  round,
  roundIndex,
  isOnly,
  players,
  onGameChange,
  onRemoveGame,
  onAddGame,
  onRemoveRound,
}: RoundCardProps) {
  return (
    <div className="border border-black/10 rounded-xl bg-white shadow-sm overflow-hidden">
      {/* Round header */}
      <div className="flex items-center justify-between px-5 py-3 bg-black/[0.04] border-b border-black/10">
        <span className="font-semibold text-sm tracking-wide uppercase text-black/70">
          Round {round.roundNumber}
        </span>
        {!isOnly && (
          <button
            type="button"
            onClick={() => onRemoveRound(roundIndex)}
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 transition"
          >
            <FaTimesCircle size={13} />
            Remove Round
          </button>
        )}
      </div>

      {/* Column labels */}
      <div className="grid grid-cols-[1fr_1fr_1.5fr_2rem] gap-3 px-5 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-black/35">
        <span>White</span>
        <span>Black</span>
        <span>Result</span>
        <span />
      </div>

      {/* Game rows */}
      <div className="flex flex-col gap-2 px-5 pt-1 pb-3">
        {round.games.map((game, gameIndex) => (
          <GameRow
            key={game.game_id}
            game={game}
            gameIndex={gameIndex}
            roundIndex={roundIndex}
            canRemove={round.games.length > 1}
            players={players}
            onGameChange={onGameChange}
            onRemoveGame={onRemoveGame}
          />
        ))}
      </div>

      {/* Add game within round */}
      <div className="px-5 pb-4">
        <button
          type="button"
          onClick={() => onAddGame(roundIndex)}
          className="flex items-center gap-2 text-xs text-black/50 hover:text-black/80 hover:bg-black/5 transition py-1.5 px-2.5 rounded-lg"
        >
          <BsPlusCircleDotted size={14} />
          Add Game
        </button>
      </div>
    </div>
  )
})

// ---------------------------------------------------------------------------
// Root form component
// ---------------------------------------------------------------------------

function DynamicForm() {
  const { data: players, isPending: isLoading, error } = usePlayers()
  const { mutate: addTournament, isPending: isSaving } = useAddTournament()

  const [rounds, setRounds] = useState<RoundSection[]>([])
  const tournamentNameRef = useRef<HTMLInputElement>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const pendingPayloadRef = useRef<ReturnType<
    typeof tournamentServices.createDBTourneyReq
  > | null>(null)

  // Initialise with Round 1 once players are available
  useEffect(() => {
    if (players && players.length >= 2 && rounds.length === 0) {
      setRounds([{ roundNumber: 1, games: [makeDefaultGame(1, players)] }])
    }
  }, [players]) // eslint-disable-line react-hooks/exhaustive-deps

  // Derive the flat GAME[] from round sections – no extra state needed
  const games = useMemo<GAME[]>(
    () => rounds.flatMap((r) => r.games.map(gameEntryToGame)),
    [rounds],
  )

  // ---- Stable handlers (useCallback so memo'd children don't re-render) ----

  const handleAddRound = useCallback(() => {
    setRounds((prev) => {
      const nextRound = prev.length + 1
      return [
        ...prev,
        {
          roundNumber: nextRound,
          games: [makeDefaultGame(nextRound, players!)],
        },
      ]
    })
  }, [players])

  const handleRemoveRound = useCallback((roundIndex: number) => {
    setRounds((prev) =>
      prev
        .filter((_, i) => i !== roundIndex)
        .map((r, i) => ({
          ...r,
          roundNumber: i + 1,
          games: r.games.map((g) => ({ ...g, round: i + 1 })),
        })),
    )
  }, [])

  const handleAddGame = useCallback(
    (roundIndex: number) => {
      setRounds((prev) => {
        const updated = [...prev]
        updated[roundIndex] = {
          ...updated[roundIndex],
          games: [
            ...updated[roundIndex].games,
            makeDefaultGame(updated[roundIndex].roundNumber, players!),
          ],
        }
        return updated
      })
    },
    [players],
  )

  const handleRemoveGame = useCallback(
    (roundIndex: number, gameIndex: number) => {
      setRounds((prev) => {
        const updated = [...prev]
        updated[roundIndex] = {
          ...updated[roundIndex],
          games: updated[roundIndex].games.filter((_, i) => i !== gameIndex),
        }
        return updated
      })
    },
    [],
  )

  const handleGameChange = useCallback(
    (
      roundIndex: number,
      gameIndex: number,
      field: GameChangeField,
      value: string,
    ) => {
      setRounds((prev) =>
        prev.map((r, ri) => {
          if (ri !== roundIndex) return r
          return {
            ...r,
            games: r.games.map((g, gi) => {
              if (gi !== gameIndex) return g
              if (field === 'white') {
                return { ...g, white: value }
              }
              if (field === 'black') {
                return { ...g, black: value }
              }
              return { ...g, result: value as GameResultEntry['result'] }
            }),
          }
        }),
      )
    },
    [],
  )

  // ---- Submit --------------------------------------------------------------

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    pendingPayloadRef.current = tournamentServices.createDBTourneyReq({
      numberOfRounds: rounds.length,
      games,
      tournamentName: tournamentNameRef.current?.value ?? '',
    })
    setShowConfirmDialog(true)
  }

  const handleConfirmSave = () => {
    if (pendingPayloadRef.current) {
      addTournament(pendingPayloadRef.current)
      pendingPayloadRef.current = null
    }
    setShowConfirmDialog(false)
  }

  const handleCancelSave = () => {
    pendingPayloadRef.current = null
    setShowConfirmDialog(false)
  }

  // ---- Early-return states -------------------------------------------------

  if (isLoading || rounds.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <RiErrorWarningFill size={50} color="red" />
        <p>Could not fetch players from database</p>
      </div>
    )
  }

  if (players!.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <RiErrorWarningFill size={50} color="#eab308" />
        <p>Not enough players in database to create tournament</p>
      </div>
    )
  }

  // ---- Render --------------------------------------------------------------

  return (
    <>
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Save Tournament</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-black/70">
            Saving this tournament will permanently update player ratings based
            on the recorded results. This action cannot be undone. Are you sure
            you want to continue?
          </p>
          <DialogFooter className="mt-2">
            <button
              type="button"
              onClick={handleCancelSave}
              className="px-4 py-2 rounded-lg border border-black/20 text-sm font-medium hover:bg-black/5 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmSave}
              disabled={isSaving}
              className={cn(
                'px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition',
                isSaving && 'opacity-40 pointer-events-none',
              )}
            >
              {isSaving ? <Spinner /> : 'Yes, Save Tournament'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-4xl">
        {/* Tournament name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="tournamentName" className="text-xl font-bold">
            Tournament Name
          </label>
          <input
            type="text"
            id="tournamentName"
            ref={tournamentNameRef}
            defaultValue=""
            required
            placeholder="Enter a name for this tournament"
            className="border border-black/20 rounded-lg px-3 py-2.5 w-full max-w-sm text-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition"
          />
        </div>

        {/* Round sections */}
        <div className="flex flex-col gap-4">
          {rounds.map((round, roundIndex) => (
            <RoundCard
              key={round.roundNumber}
              round={round}
              roundIndex={roundIndex}
              isOnly={rounds.length === 1}
              players={players!}
              onGameChange={handleGameChange}
              onRemoveGame={handleRemoveGame}
              onAddGame={handleAddGame}
              onRemoveRound={handleRemoveRound}
            />
          ))}
        </div>

        {/* Add round */}
        <button
          type="button"
          onClick={handleAddRound}
          className="flex items-center justify-center gap-2 border-2 border-dashed border-black/20 text-black/40 hover:text-black/70 hover:border-black/35 transition rounded-xl py-3 text-sm font-medium"
        >
          <BsPlusCircleDotted size={17} />
          Add Round {rounds.length + 1}
        </button>

        {/* Save */}
        <button
          type="submit"
          disabled={isSaving}
          className={cn(
            'flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm transition',
            isSaving && 'opacity-40 pointer-events-none',
          )}
        >
          {isSaving ? (
            <Spinner />
          ) : (
            <>
              <BiSave size={19} />
              Save Tournament
            </>
          )}
        </button>
      </form>
    </>
  )
}
