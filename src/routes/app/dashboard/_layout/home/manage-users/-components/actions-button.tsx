import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Edit2Icon, MoreHorizontal } from 'lucide-react'

export function ActionsButton({
  // playerId,
  children,
}: {
  playerId: string
  children: React.ReactNode
}) {
  return (
    <span className="flex h-full w-full items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger className="border-0 bg-transparent p-0 hover:bg-transparent">
          <MoreHorizontal className="h-5 w-5 text-gray-500" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <li className="flex items-center gap-2 text-xs">
              <Edit2Icon />
              <span>Edit</span>
            </li>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <li className="flex items-center gap-2 text-xs">
              {children}
              <span>Delete</span>
            </li>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </span>
  )
}
