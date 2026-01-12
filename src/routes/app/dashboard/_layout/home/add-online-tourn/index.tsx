import { createFileRoute } from '@tanstack/react-router'
import { RecordNewTournament } from '@/services/lichess/record-tournament'
import React, { useEffect, useState } from 'react'
import { localFetch } from '@/services/fetch'
import { toast } from '@/components/toast'
import { Search, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TournamentTable } from './-components/tournament-table'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
// import { useAddPlayers } from '@/hooks/players'
import { useGetLichessTournament } from '@/hooks/tournaments'
import type { TOURNAMENT } from '@/types/tournament'

export const Route = createFileRoute(
  '/app/dashboard/_layout/home/add-online-tourn/',
)({
  component: Page,
})

function Page() {
  const [isCreating, setIsCreating] = useState(false)
  const [tournamentId, setTournamentId] = useState('')
  const [data, setData] = useState<TOURNAMENT | undefined>(undefined)
  // const { user } = Route.useRouteContext()

  // Use the hook with the current tournamentId
  const {
    data: lichessTournamentGames,
    isPending,
    isError,
    refetch,
  } = useGetLichessTournament(tournamentId)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setTournamentId(e.target.value)
  }

  const handleAddTournamentToDB = async (e: any) => {
    e.preventDefault()
    setIsCreating(true)
    try {
      const response = await localFetch('/tournaments', {
        method: 'POST',
        body: JSON.stringify({
          tournament: data,
        }),
      })

      toast({
        title: 'Created successfully',
        description: 'Tournament has been added successfully',
        variant: 'success',
      })

      console.log(response)
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error creating tournament',
        description: 'There was an error creating the tournament',
        variant: 'error',
      })
    } finally {
      setIsCreating(false)
    }
  }

  // Fetch using the hook's refetch and rely on isPending for UI state
  const handleFetchTournament = async (e: any) => {
    e.preventDefault()
    try {
      const result = await refetch()
      const games = result.data ?? []
      const tournament = RecordNewTournament(tournamentId, games)
      if (!tournament) {
        throw new Error('An error occurred while processing the tournament')
      }
      setData(tournament)
      console.log(tournament)
    } catch (error) {
      console.log(error)
      toast({
        title: 'Fetch error',
        description:
          error instanceof Error ? error.message : 'Failed to fetch tournament',
        variant: 'error',
      })
    }
  }

  // Also update data when hook data changes (e.g., typing then pressing Enter)
  useEffect(() => {
    if (!tournamentId) return
    if (lichessTournamentGames && !isPending && !isError) {
      const tournament = RecordNewTournament(
        tournamentId,
        lichessTournamentGames ?? [],
      )
      if (tournament) {
        setData(tournament)
      }
    }
  }, [tournamentId, lichessTournamentGames, isPending, isError])

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center gap-3">
            <Trophy className="h-8 w-8 text-amber-600" />
            <h1 className="text-4xl font-bold text-slate-800">
              Chess Tournament Manager
            </h1>
          </div>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Search and view tournament results from our chess club database
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-2xl flex flex-col gap-6 mx-auto shadow-lg border-0 bg-white/80 backdrop-blur p-6 rounded-lg">
          <div>
            <div className="flex items-center gap-2 text-2xl font-semibold">
              <Search className="h-5 w-5" />
              <span>Tournament Search</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Enter the tournament Id to fetch match results
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex gap-3">
              <Input
                placeholder="e.g., spring-championship"
                value={tournamentId}
                onChange={handleChange}
                onKeyDown={(e) => e.key === 'Enter' && handleFetchTournament(e)}
                className="flex-1"
                disabled={isPending}
              />
              <Button onClick={handleFetchTournament} disabled={isPending} className="px-6">
                {isPending ? (
                  <div className="flex items-center gap-2 ">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Fetching...
                  </div>
                ) : (
                  'Fetch Tournament'
                )}
              </Button>
            </div>
            {/* {error && (
              <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </p>
            )} */}
          </div>
        </div>

        {/* Tournament Results */}

        {data && (
          <TournamentTable
            tournament={data}
            isCreating={isCreating}
            action={handleAddTournamentToDB}
          />
        )}

        {/* Loading State */}
        {isPending && (
          <div className="p-6 rounded-md max-w-4xl mx-auto shadow-lg border-0 bg-white/80 backdrop-blur">
            <div className="p-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                <p className="text-slate-600 text-lg">Fetching tournament data...</p>
                <p className="text-slate-500 text-sm">This may take a few moments</p>
              </div>
            </div>
          </div>
        )}

        {/* Help Text */}
        {!data && !isPending && (
          <div className="rounded-md max-w-2xl mx-auto bg-blue-50 border-blue-200 border">
            <div className="p-6 text-center">
              <p className="text-blue-800 font-medium mb-2">Try these sample tournaments:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline" className="cursor-pointer hover:bg-blue-100" onClick={() => setTournamentId('LicKZkxi')}>
                  LicKZkxi
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-blue-100" onClick={() => setTournamentId('summer-open')}>
                  summer-open
                </Badge>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// <div>
//   <form
//     onSubmit={handleSubmit}
//     className="w-full h-dvh flex flex-col items-center justify-center gap-5"
//   >
//     <input
//       type="text"
//       value={tournamentId}
//       onChange={handleChange}
//       id=""
//       placeholder="Tournament ID"
//       className="p-2 focus:outline-none focus:border-gray-400 border border-gray-600 rounded-md"
//     />
//     <button
//       type="submit"
//       disabled={isFetching}
//       className={`px-6 py-2 bg-black text-white rounded-md ${
//         isFetching ? 'opacity-70' : ''
//       }`}
//     >
//       {isFetching ? <Spinner /> : 'Fetch Lichess Tournament'}
//     </button>
//     <button
//       onClick={handleClick}
//       disabled={isCreating}
//       className={`px-6 py-2 bg-black text-white rounded-md ${
//         isCreating ? 'opacity-70' : ''
//       }`}
//     >
//       {isCreating ? <Spinner /> : 'Add To db'}
//     </button>
//   </form>
// </div>
