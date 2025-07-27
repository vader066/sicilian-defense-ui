import { createFileRoute } from '@tanstack/react-router'
// import { tournamentStore } from "@/store/tournament-data";
import {
  type APPWRITE_TOURNAMENT,
  type TOURNAMENT,
} from '@/types/database/models'
import { useEffect, useState } from 'react'
import { localFetch } from '@/services/fetch'
import DataTable from '@/components/data-table'
import { tournamentColumns } from './-components/columns'
import { TourneyTable } from './-components/tourney-table'
import { Button } from '@/components/ui/button'
import { Button as MovingBorderButton } from '@/components/ui/moving-border'
import { BiArrowBack } from 'react-icons/bi'

export const Route = createFileRoute('/app/dashboard/_layout/history/')({
  component: History,
})

function History() {
  // const [isError, setIsError] = useState(false)
  const [tournArray, setTournArray] = useState<APPWRITE_TOURNAMENT | null>(null)
  const [isFetching, setIsFetching] = useState(true)
  const [selectedTourn, setSelectedTourn] = useState<TOURNAMENT | null>(null)

  async function fetchTournament() {
    try {
      setIsFetching(true)
      const response = await localFetch<APPWRITE_TOURNAMENT>('/tournaments')
      setTournArray(response.data)
    } catch (error: any) {
      console.error(error.message)
      // setIsError(true)
    } finally {
      setIsFetching(false)
    }
  }
  useEffect(() => {
    fetchTournament()
  }, [])
  return selectedTourn ? (
    <div>
      <div className="flex items-center mb-5">
        <Button
          onClick={() => setSelectedTourn(null)}
          className="bg-white border-slate-300 border"
        >
          <BiArrowBack className="text-black" />
        </Button>
      </div>
      <TourneyTable tourn={selectedTourn} />
    </div>
  ) : (
    <div className="text-xl flex flex-col gap-4 w-full items-center justify-center">
      <h1 className="text-2xl font-bold text-slate-800">Tournaments</h1>
      <DataTable
        TheadClassName="!text-start font-semibold text-slate-700"
        TcellClassName="py-4! border-b border-slate-100 font-semibold text-slate-800"
        // DataTableToolbar={(props) => (
        //   <Toolbar {...props} players={players} tourney={tourn} />
        // )}
        isLoading={isFetching}
        data={tournArray?.documents || []}
        columns={[
          ...tournamentColumns,
          {
            id: 'tournament',
            cell: ({ row }) => {
              const tourn = row.original
              return (
                <div>
                  <MovingBorderButton
                    onClick={() => {
                      setSelectedTourn(tourn)
                    }}
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
