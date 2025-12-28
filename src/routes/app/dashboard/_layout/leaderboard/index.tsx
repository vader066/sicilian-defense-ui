import { createFileRoute } from '@tanstack/react-router'
import DataTable from '@/components/data-table'
import { Toolbar } from '@/components/data-table/players-toolbar'
import { BiErrorAlt } from 'react-icons/bi'
import { usePlayers } from '@/hooks/players'

export const Route = createFileRoute('/app/dashboard/_layout/leaderboard/')({
  component: Leaderboard,
})

function Leaderboard() {
  const { user } = Route.useRouteContext()
  const { data: players, isPending, error } = usePlayers(user.club_id)
  return (
    <div className="w-full p-3 flex flex-col gap-5 text-center">
      <p className="text-xl font-bold">Leaderboard</p>
      {!error ? (
        <DataTable
          data={players || []}
          DataTableToolbar={(props) => <Toolbar {...props} />}
          isLoading={isPending}
          columns={[
            {
              accessorKey: 'first_name',
              header: 'First Name',
            },
            {
              accessorKey: 'last_name',
              header: 'Last Name',
            },
            { accessorKey: 'username', header: 'Username' },
            { accessorKey: 'rating', header: 'Rating' },
          ]}
        />
      ) : (
        <div className="contents">
          <BiErrorAlt size={50} />
          <p>Error: {error.message}</p>
        </div>
      )}
    </div>
  )
}

export default Leaderboard
