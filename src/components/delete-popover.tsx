import { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

export default function DeletePopover({
  onConfirm,
  children,
}: {
  onConfirm: () => void
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-56 flex flex-col gap-2">
        <p className="text-sm">Are you sure you want to remove this member?</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              onConfirm()
              setOpen(false)
            }}
            className="text-white"
          >
            Confirm
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
