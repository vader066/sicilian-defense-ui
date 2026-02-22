import { toast } from '@/components/toast'
import { AuthService } from '@/services/auth'
import { playerService } from '@/services/player-services'
import type { PLAYER } from '@/types/players'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const localStorageClubID = AuthService.getUserData().user.club_id

export function usePlayers() {
  // don't need this argument anymore since we get clubId from localStorage but too lazy to change all calls
  return useQuery({
    queryKey: ['players', localStorageClubID],
    queryFn: () => playerService.getPlayers(localStorageClubID),
    enabled: true,
  })
}

export function useAddPlayer(clubId: string) {
  const queryClient = useQueryClient()
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
