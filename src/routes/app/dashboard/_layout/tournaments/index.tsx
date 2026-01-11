import { createFileRoute, useNavigate } from '@tanstack/react-router'
// import { tournamentStore } from "@/store/tournament-data";
import DataTable from '@/components/data-table'
import { tournamentColumns } from './-components/columns'
import { Button as MovingBorderButton } from '@/components/ui/moving-border'
import { useTournaments } from '@/hooks/tournaments'
import type { DBTourney } from '@/types/tournament'

export const Route = createFileRoute('/app/dashboard/_layout/tournaments/')({
  component: TournamentPage,
})

function TournamentPage() {
  const { user } = Route.useRouteContext()
  const navigate = useNavigate()

  const {
    data: tournaments,
    isPending: isTournamentLoading,
    isError: isTournamentError,
  } = useTournaments(user.club_id)

  if (isTournamentError) {
    return <div>An error occured</div>
  }

  const handleViewTournament = (tourn: DBTourney) => {
    navigate({
      to: '/app/dashboard/tournaments/$tournamentId',
      params: { tournamentId: tourn.id },
    })
  }

  return (
    <div className="text-xl flex flex-col gap-4 w-full items-center justify-center">
      <h1 className="text-2xl font-bold text-slate-800">Tournaments</h1>
      <DataTable
        TheadClassName="!text-start font-semibold text-slate-700"
        TcellClassName="py-4! border-b border-slate-100 font-semibold text-slate-800"
        // DataTableToolbar={(props) => (
        //   <Toolbar {...props} players={players} tourney={tourn} />
        // )}
        isLoading={isTournamentLoading}
        data={tournaments || []}
        columns={[
          ...tournamentColumns,
          {
            id: 'tournament',
            cell: ({ row }) => {
              const tourn = row.original
              return (
                <div>
                  <MovingBorderButton
                    onClick={() => handleViewTournament(tourn)}
                    borderRadius="1.75rem"
                    type="button"
                    containerClassName="!w-auto !h-auto hover:scale-105"
                    className="bg-white text-black border-neutral-200 p-3 px-4 cursor-pointer text-xs"
                  >
                    View
                  </MovingBorderButton>
                </div>
              )
            },
          },
        ]}
      />
    </div>
  )
}
