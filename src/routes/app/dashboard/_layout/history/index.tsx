import { createFileRoute } from '@tanstack/react-router'
import { Spinner } from '@/components/ui/spinner'
import { CreateTournamentTables } from '@/services/calc/create-tournament-table'
// import { tournamentStore } from "@/store/tournament-data";
import { type APPWRITE_TOURNAMENT } from '@/types/database/models'
import { useEffect, useState } from 'react'
import { BiErrorCircle } from 'react-icons/bi'
import { localFetch } from '@/services/fetch'

export const Route = createFileRoute('/app/dashboard/_layout/history/')({
  component: History,
})

function History() {
  const [isError, setIsError] = useState(false)
  const [tournArray, setTournArray] = useState<APPWRITE_TOURNAMENT | null>(null)
  const [isFetching, setIsFetching] = useState(true)

  async function fetchTournament() {
    try {
      setIsFetching(true)
      const response = await localFetch<APPWRITE_TOURNAMENT>('/tournaments')
      setTournArray(response.data)
    } catch (error: any) {
      console.error(error.message)
      setIsError(true)
    } finally {
      setIsFetching(false)
    }
  }
  useEffect(() => {
    fetchTournament()
  }, [])
  return (
    <div className="text-xl flex flex-col gap-4 w-full items-center justify-center">
      Tournament History
      {!isError ? (
        // {isError ? (
        <div className="contents">
          {isFetching && <Spinner />}
          <div className="w-full flex flex-col gap-20">
            {/* {CreateTournamentTables(tournamentStore)} */}
            {tournArray ? (
              CreateTournamentTables(tournArray)
            ) : (
              <GeneratingTables />
            )}
          </div>
        </div>
      ) : (
        <BiErrorCircle size={50} color="red" />
      )}
    </div>
  )
}

function GeneratingTables() {
  return (
    <div className="flex flex-col text-md font-bold items-center justify-center">
      <p>Generating Tables please wait...</p>
      <Spinner />
    </div>
  )
}
