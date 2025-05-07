import { createFileRoute } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { AddMember } from './-components/add-member'
import { ExistingMember } from './-components/existing-members'

export const Route = createFileRoute(
  '/app/dashboard/_layout/home/manage-users/',
)({
  component: ManageUsers,
})

type Tabs = 'add-member' | 'existing-member'

function ManageUsers() {
  const [page, setPage] = useState<Tabs>('add-member')

  return (
    <div className="flex flex-col gap-6 items-center justify-center w-full px-10">
      <section className="flex justify-between w-full">
        <div className="flex flex-col gap-1">
          <p className="text-2xl font-bold">Manage users</p>
          <p className="text-sm text-black/50">
            Add, Delete and Edit Member information
          </p>
        </div>
      </section>
      <section className="flex flex-col gap-3 w-full">
        <ul className="flex gap-3 border-b border-black/20 text-sm">
          <button
            onClick={() => setPage('add-member')}
            className={cn(
              'px-4 py-2 border border-transparent border-b-0 rounded-t-lg',
              {
                'border-black/20 text-black/50': page === 'add-member',
              },
            )}
          >
            Add Member
          </button>
          <button
            onClick={() => setPage('existing-member')}
            className={cn(
              'px-4 py-2 border border-transparent border-b-0 rounded-t-lg',
              {
                'border-black/20 text-black/50': page === 'existing-member',
              },
            )}
          >
            Existing Member
          </button>
        </ul>
        <div className="w-full border border-black/20 min-h-[500px] rounded-lg flex items-start py-6 justify-center">
          {page === 'add-member' && (
            <div className="lg:w-[50%] md:w-[70%] w-[90%] ">
              <AddMember />
            </div>
          )}
          {page === 'existing-member' && <ExistingMember />}
        </div>
      </section>
    </div>
  )
}
