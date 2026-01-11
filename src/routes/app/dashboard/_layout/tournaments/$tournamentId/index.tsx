import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { BiArrowBack } from 'react-icons/bi'
import { TourneyTable } from '../-components/tourney-table'
import { useGetTournament, useGetTournamentPairings } from '@/hooks/tournaments'
import { usePlayers } from '@/hooks/players'
import { Spinner } from '@/components/ui/spinner'

export const Route = createFileRoute(
  '/app/dashboard/_layout/tournaments/$tournamentId/',
)({
  component: TournamentDetailPage,
})

function TournamentDetailPage() {
  const { user } = Route.useRouteContext()
  const navigate = useNavigate()
  const { tournamentId } = Route.useParams()

  const {
    data: tournament,
    isPending: tournamentPending,
    error: tournamentError,
  } = useGetTournament(tournamentId)

  const {
    data: players,
    isPending: playersPending,
    error: playersError,
  } = usePlayers(user.club_id)

  const {
    data: pairingsData,
    isPending: pairingsPending,
    error: pairingsError,
  } = useGetTournamentPairings(tournamentId)

  const isLoading = tournamentPending || playersPending || pairingsPending
  const error = tournamentError || playersError || pairingsError

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
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-600">Tournament not found</p>
      </div>
    )
  }

  const handleGoBack = () => {
    navigate({
      to: '/app/dashboard/tournaments',
    })
  }

  const getPlayerName = (playerId: string) => {
    const player = players?.find((p) => p.id === playerId)
    return player ? `${player.first_name} ${player.last_name}` : playerId
  }

  return (
    <div>
      <div className="flex items-center mb-5">
        <Button
          onClick={handleGoBack}
          className="bg-white border-slate-300 border"
        >
          <BiArrowBack className="text-black" />
        </Button>
      </div>

      {tournament.status === 'in_progress' ? (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-slate-900">
            {tournament.tournamentName}
          </h1>
          {pairingsData?.rounds.map((round) => (
            <div
              key={round.round}
              className="border rounded-lg p-6 bg-white shadow-sm"
            >
              <h2 className="text-lg font-semibold text-slate-800 mb-4">
                Round {round.round}
              </h2>
              <div className="space-y-3">
                {round.pairings.map((pairing, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 border border-slate-200 rounded bg-slate-50"
                  >
                    <div className="flex-1">
                      {pairing.white ? (
                        <span className="font-medium text-slate-800">
                          {getPlayerName(pairing.white)}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">Bye</span>
                      )}
                    </div>
                    <div className="px-4 text-slate-500 font-semibold">vs</div>
                    <div className="flex-1 text-right">
                      {pairing.black ? (
                        <span className="font-medium text-slate-800">
                          {getPlayerName(pairing.black)}
                        </span>
                      ) : pairing.bye ? (
                        <span className="text-slate-500 italic">
                          Bye ({getPlayerName(pairing.bye)})
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">Pending</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <TourneyTable tournament={tournament} players={players || []} />
      )}
    </div>
  )
}
