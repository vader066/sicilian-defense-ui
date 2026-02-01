import { toast } from '@/components/toast'
import { tournamentServices } from '@/services/tournament-services'
import type {
  syncTournReq,
  tournamentReq,
  createRoundRobinTournamentReq,
} from '@/types/tournament'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useTournaments(clubId: string) {
  return useQuery({
    queryKey: ['tournaments', clubId],
    queryFn: () => tournamentServices.listTournaments(),
    enabled: !!clubId,
  })
}

export function useGetTournament(tournamentId: string) {
  return useQuery({
    queryKey: ['tournament', tournamentId],
    queryFn: () => tournamentServices.getTournamentWithGames(tournamentId),
    enabled: !!tournamentId,
  })
}

export function useAddTournament(clubId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (t: tournamentReq) => tournamentServices.addTournament(t),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments', clubId] })
      toast({
        title: 'Tournament Created',
        description: 'The tournament has been successfully added.',
        variant: 'success',
      })
    },
    onError: (error) => {
      toast({
        title: 'Tournament Creation',
        description:
          error instanceof Error
            ? error.message
            : 'Tournament creation failed. Please try again.',
        variant: 'error',
      })
    },
  })
}

export function useSyncTournament(clubId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (s: syncTournReq) => {
      return tournamentServices.syncTournament(s)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments', clubId] })
      queryClient.clear()
      toast({
        title: 'Tournament Update',
        description: 'The tournament has been successfully updated.',
        variant: 'success',
      })
    },
    onError: (error) => {
      toast({
        title: 'Tournament Update',
        description:
          error instanceof Error
            ? error.message
            : 'Tournament update failed. Please try again.',
        variant: 'error',
      })
    },
  })
}

export function useGetLichessArenaTournament(tournamentId: string) {
  return useQuery({
    queryKey: ['lichessArenaTournament', tournamentId],
    queryFn: () => tournamentServices.getLichessArenaTournament(tournamentId),
    enabled: false,
    retry: false,
  })
}

export function useCreateRoundRobinTournament(clubId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: createRoundRobinTournamentReq) =>
      tournamentServices.createRoundRobinTournament(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments', clubId] })
      toast({
        title: 'Round Robin Tournament Created',
        description: 'The tournament has been successfully created.',
        variant: 'success',
      })
    },
    onError: (error) => {
      toast({
        title: 'Tournament Creation',
        description:
          error instanceof Error
            ? error.message
            : 'Tournament creation failed. Please try again.',
        variant: 'error',
      })
    },
  })
}

export function useGetTournamentPairings(tournamentId: string) {
  return useQuery({
    queryKey: ['tournamentPairings', tournamentId],
    queryFn: () => tournamentServices.getTournamentPairings(tournamentId),
    enabled: !!tournamentId,
  })
}
