import { DialogContent, DialogTitle } from '@/components/ui/dialog'
import { AddMember } from './add-member'
import type { PLAYER } from '@/types/database/models'

export function EditPlayerInfo({ player }: { player: PLAYER }) {
  return (
    <DialogContent className="fixed left-1/2 top-[10%] w-[95vw] max-w-[500px] -translate-x-1/2 rounded-md border-none sm:w-[80vw] md:w-[60vw] lg:w-[700px] bg-green-400">
      <div
        className="absolute left-0 right-0 top-1 flex max-h-[90vh] flex-col overflow-auto rounded-md bg-[#FAFAFA] p-5 pt-3 w-full [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
      >
        <DialogTitle className="mb-7 text-xl font-bold text-black">
          {'Update Player Information'}
        </DialogTitle>
        {/* <div className="w-full h-56"></div> */}
        <AddMember player={player} />
      </div>
    </DialogContent>
  )
}
