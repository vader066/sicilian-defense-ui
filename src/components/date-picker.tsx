import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { PiCalendarDuotone } from 'react-icons/pi'
import { cn } from '@/lib/utils'

export function DatePicker({
  date,
  setDate,
  className,
}: {
  date?: Date
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>
  className?: string
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className={cn('flex gap-2 w-full', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="justify-between font-normal h-full w-full"
          >
            {date ? date.toLocaleDateString() : 'Select date'}
            <PiCalendarDuotone className="size-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
