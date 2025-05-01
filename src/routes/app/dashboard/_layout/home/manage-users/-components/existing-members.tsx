import DataTable from '@/components/data-table'
import { Toolbar } from '@/components/data-table/players-toolbar'
import DeletePopover from '@/components/delete-popover'
import { usePlayerData } from '@/contexts/players-context'

import { useState } from 'react'
import { BiErrorAlt } from 'react-icons/bi'
import { BsTrash3Fill } from 'react-icons/bs'
import { Spinner } from '@/components/ui/spinner'

export function ExistingMember() {
  const [isDeleting, setIsDeleting] = useState(false)
  const deletePlayer = async (id: string) => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/db/delete-player/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error('Error deleting player', data)
      }
      console.log('Player deleted successfully', data)
    } catch (error: any) {
      console.log(error.message)
    } finally {
      setIsDeleting(false)
    }
  }

  const { players, isLoading, error } = usePlayerData()
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
                return (
                  <DeletePopover
                    onConfirm={() => {
                      deletePlayer(row.getValue('id'))
                      console.log('deleted')
                    }}
                  >
                    <button
                      disabled={isDeleting}
                      className="hover:bg-black/5 rounded-md px-2 py-3"
                    >
                      {isDeleting ? (
                        <Spinner />
                      ) : (
                        <BsTrash3Fill className="text-red-500" />
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
