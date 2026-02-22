import { toast } from '@/components/toast'
import { AuthService } from '@/services/auth'
import { playerService } from '@/services/player-services'
import type { PLAYER } from '@/types/players'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const localStorageClubID = AuthService.getUserData().user.club_id

export function usePlayers() {
  return useQuery({
    queryKey: ['players'],
    queryFn: () => playerService.getPlayers(localStorageClubID),
    enabled: true,
  })
}

export function useAddPlayer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (playerData: Partial<PLAYER>) =>
      playerService.addPlayer(playerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] })
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

export function useUpdatePlayer() {
  const queryClient = useQueryClient()
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
      queryClient.invalidateQueries({ queryKey: ['players'] })
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

export function usePlayersFileUpload() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => playerService.uploadPlayersFile(file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['players'] })
      toast({
        title: 'File Upload',
        description: `Successfully uploaded ${data.length} player${data.length !== 1 ? 's' : ''}.`,
        variant: 'success',
      })
    },
    onError: (error) => {
      toast({
        title: 'File Upload',
        description:
          error instanceof Error
            ? error.message
            : 'File upload failed. Please try again.',
        variant: 'error',
      })
    },
  })
}
