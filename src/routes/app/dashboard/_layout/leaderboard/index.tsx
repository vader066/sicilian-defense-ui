import { createFileRoute } from '@tanstack/react-router'
import DataTable from '@/components/data-table'
import { Toolbar } from '@/components/data-table/players-toolbar'
import { usePlayerData } from '@/contexts/players-context'
import { BiErrorAlt } from 'react-icons/bi'

export const Route = createFileRoute('/app/dashboard/_layout/leaderboard/')({
  component: Leaderboard,
})

function Leaderboard() {
  const { players, isLoading, error } = usePlayerData()
  return (
    <div className="w-full p-3 flex flex-col gap-5 text-center">
      <p className="text-xl font-bold">Leaderboard</p>
      {!error ? (
        <DataTable
          data={players}
          DataTableToolbar={(props) => <Toolbar {...props} />}
          isLoading={isLoading}
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
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  )
}

export default Leaderboard
