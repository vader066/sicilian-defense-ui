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
import { EditIcon } from 'lucide-react'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { EditPlayerInfo } from './update-dialog'

export function ExistingMember() {
  const [deletingUsername, setDeletingUsername] = useState<string | null>(null) // Track the username of the row being deleted
  const deletePlayer = async (username: string) => {
    try {
      setDeletingUsername(username) // Set the username of the row being deleted
      await localFetch(`/players/${username}`, {
        method: 'DELETE',
      })
      toast({
        title: 'Deleted successfully',
        description: 'Player has been deleted successfully',
        variant: 'success',
      })

      // Remove the deleted player from the table
      setPlayers((prevPlayers) =>
        prevPlayers.filter((player) => player.username !== username),
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
      setDeletingUsername(null) // Reset the deleting ID
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
            {
              accessorKey: 'first_name',
              header: 'First Name',
            },
            {
              accessorKey: 'last_name',
              header: 'Last Name',
            },
            { accessorKey: 'username', header: ' Username' },
            { accessorKey: 'rating', header: 'Rating' },
            {
              accessorKey: 'username',
              header: 'Remove',
              cell: ({ row }) => {
                const rowId = row.getValue('username') as string
                return (
                  // <ActionsButton playerId={rowId}>
                  <DeletePopover
                    onConfirm={() => {
                      deletePlayer(row.getValue('username'))
                      console.log('deleted')
                    }}
                  >
                    <button
                      disabled={deletingUsername === rowId} // Disable only the button for the row being deleted
                      className="hover:bg-black/5 rounded-md px-2 py-3"
                    >
                      {deletingUsername === rowId ? ( // Show spinner only for the row being deleted
                        <Spinner />
                      ) : (
                        <div className="flex items-center gap-2 text-xs">
                          <FaTrash className="text-red-400" />
                        </div>
                      )}
                    </button>
                  </DeletePopover>
                  // </ActionsButton>
                )
              },
            },
            {
              accessorKey: 'username',
              header: 'Edit',
              cell: ({ row }) => {
                const rowId = row.getValue('username') as string
                const player = row.original
                return (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        disabled={deletingUsername === rowId} // Disable only the button for the row being deleted
                        type="button"
                        className="hover:bg-black/5 rounded-md disabled:opacity-15 px-2 py-3"
                        // className="border-0 bg-transparent p-0 hover:bg-transparent"
                      >
                        <EditIcon className="h-5 w-5 text-gray-500" />
                      </button>
                    </DialogTrigger>
                    <EditPlayerInfo player={player} />
                  </Dialog>
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
