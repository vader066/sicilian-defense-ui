import { toast } from '@/components/toast'
import { clubService } from '@/services/club'
import type { CREATEACCOUNTREQ } from '@/types/club'
import { useMutation } from '@tanstack/react-query'

export function useSignUp() {
  return useMutation({
    mutationFn: (signUpReq: CREATEACCOUNTREQ) => clubService.signUp(signUpReq),
    onSuccess: () => {
      toast({
        title: 'Account Created',
        description: 'Your account has been successfully created.',
        variant: 'success',
      })
    },
    onError: (error) => {
      toast({
        title: 'Account Creation',
        description:
          error instanceof Error
            ? error.message
            : 'Account creation failed. Please try again.',
        variant: 'error',
      })
    },
  })
}

// export function useUpdateClub(clubId: string) {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: ({
//       playerId,
//       playerData,
//     }: {
//       playerId: string
//       playerData: Partial<PLAYER>
//     }) => {
//       return playerService.updatePlayer(playerId, playerData)
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['players', clubId] })
//       queryClient.clear()
//       toast({
//         title: 'Player Update',
//         description: 'The player has been successfully updated.',
//         variant: 'success',
//       })
//     },
//     onError: (error) => {
//       toast({
//         title: 'Player Update',
//         description:
//           error instanceof Error
//             ? error.message
//             : 'Player update failed. Please try again.',
//         variant: 'error',
//       })
//     },
//   })
// }
