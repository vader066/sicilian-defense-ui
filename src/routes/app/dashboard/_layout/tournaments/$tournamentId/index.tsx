import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { BiArrowBack } from 'react-icons/bi'
import { TourneyTable } from '../-components/tourney-table'
import { useGetTournament } from '@/hooks/tournaments'
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

  const isLoading = tournamentPending || playersPending
  const error = tournamentError || playersError

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
      <TourneyTable tournament={tournament} players={players || []} />
    </div>
  )
}
