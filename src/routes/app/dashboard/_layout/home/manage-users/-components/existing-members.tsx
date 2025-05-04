import DataTable from '@/components/data-table'
import { Toolbar } from '@/components/data-table/players-toolbar'
import DeletePopover from '@/components/delete-popover'
import { usePlayerData } from '@/contexts/players-context'
import { useState } from 'react'
import { BiErrorAlt } from 'react-icons/bi'
import { FaTrash } from 'react-icons/fa'
import { Spinner } from '@/components/ui/spinner'
import { localFetch } from '@/services/fetch'
import { toast } from '@/components/toast'

export function ExistingMember() {
  const [deletingId, setDeletingId] = useState<string | null>(null) // Track the ID of the row being deleted
  const deletePlayer = async (id: string) => {
    try {
      setDeletingId(id) // Set the ID of the row being deleted
      await localFetch(`/players/${id}`, {
        method: 'DELETE',
      })
      toast({
        title: 'Deleted successfully',
        description: 'Player has been deleted successfully',
        variant: 'success',
      })

      // Remove the deleted player from the table
      setPlayers((prevPlayers) =>
        prevPlayers.filter((player) => player.id !== id),
      )
    } catch (error: any) {
      console.log('there was an error')
      console.log(error)
      toast({
        title: 'Error deleting player',
        description: error.message,
        variant: 'error',
      })
    } finally {
      setDeletingId(null) // Reset the deleting ID
    }
  }

  const { players, isLoading, error, setPlayers } = usePlayerData()
  return (
    <div className="w-full p-3 flex flex-col gap-5 text-center">
      {!error ? (
        <DataTable
          data={players}
          DataTableToolbar={(props) => <Toolbar {...props} />}
          isLoading={isLoading}
          columns={[
            { accessorKey: 'name', header: 'Name' },
            { accessorKey: 'id', header: 'ID' },
            { accessorKey: 'rating', header: 'Rating' },
            {
              accessorKey: 'id',
              header: 'Action',
              cell: ({ row }) => {
                const rowId = row.getValue('id')
                return (
                  <DeletePopover
                    onConfirm={() => {
                      deletePlayer(row.getValue('id'))
                      console.log('deleted')
                    }}
                  >
                    <button
                      disabled={deletingId === rowId} // Disable only the button for the row being deleted
                      className="hover:bg-black/5 rounded-md px-2 py-3"
                    >
                      {deletingId === rowId ? ( // Show spinner only for the row being deleted
                        <Spinner />
                      ) : (
                        <div>
                          <FaTrash className="text-red-400" />
                        </div>
                      )}
                    </button>
                  </DeletePopover>
                )
              },
            },
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
