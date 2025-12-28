import { toast } from '@/components/toast'
import { playerService } from '@/services/player-services'
import type { PLAYER } from '@/types/players'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const queryClient = useQueryClient()

export function usePlayers(clubId: string) {
  return useQuery({
    queryKey: ['players', clubId],
    queryFn: () => playerService.getPlayers(clubId),
    enabled: !!clubId,
  })
}

export function useAddPlayer(clubId: string) {
  return useMutation({
    mutationFn: (playerData: Partial<PLAYER>) =>
      playerService.addPlayer(playerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players', clubId] })
      toast({
        title: 'Player Creation',
        description: 'The player has been successfully added.',
        variant: 'success',
      })
    },
    onError: (error) => {
      toast({
        title: 'Player Creation',
        description:
          error instanceof Error
            ? error.message
            : 'Player creation failed. Please try again.',
        variant: 'error',
      })
    },
  })
}

export function useUpdatePlayer(clubId: string) {
  return useMutation({
    mutationFn: ({
      playerId,
      playerData,
    }: {
      playerId: string
      playerData: Partial<PLAYER>
    }) => {
      return playerService.updatePlayer(playerId, playerData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players', clubId] })
      queryClient.clear()
      toast({
        title: 'Player Update',
        description: 'The player has been successfully updated.',
        variant: 'success',
      })
    },
    onError: (error) => {
      toast({
        title: 'Player Update',
        description:
          error instanceof Error
            ? error.message
            : 'Player update failed. Please try again.',
        variant: 'error',
      })
    },
  })
}
