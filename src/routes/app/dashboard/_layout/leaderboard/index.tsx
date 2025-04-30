import { createFileRoute } from '@tanstack/react-router'
import DataTable from '@/components/data-table'
import { Toolbar } from '@/components/data-table/players-toolbar'
import { usePlayerData } from '@/contexts/players-context'
import { BiErrorAlt } from 'react-icons/bi'
// import { type PLAYER } from "@/types/database/models";
// import { type Table } from "@tanstack/react-table";

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
            { accessorKey: 'name', header: 'Name' },
            { accessorKey: 'id', header: 'ID' },
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
