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

type Tabs = 'add-member' | 'existing-member' | 'edit-member-info'

function ManageUsers() {
  const [page, setPage] = useState<Tabs>('add-member')

  return (
    <div className="flex flex-col gap-6 items-center justify-center w-full px-10">
      <section className="flex justify-between w-full">
        <div className="flex flex-col gap-1">
          <p className="text-2xl font-bold">Manage users</p>
          <p className="text-sm text-black/50">
            Add delete and edit Member information
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
          <button
            onClick={() => setPage('edit-member-info')}
            className={cn(
              'px-4 py-2 border border-transparent border-b-0 rounded-t-lg',
              {
                'border-black/20 text-black/50': page === 'edit-member-info',
              },
            )}
          >
            Edit Member Info
          </button>
        </ul>
        <div className="w-full border border-black/20 min-h-[500px] rounded-lg flex items-start py-6 justify-center">
          {page === 'add-member' && <AddMember />}
          {page === 'existing-member' && <ExistingMember />}
          {page === 'edit-member-info' && <EditMemberinfo />}
        </div>
      </section>
    </div>
  )
}

function EditMemberinfo() {
  return (
    <div>
      <p className="text-2xl">Edit Member Info...</p>
    </div>
  )
}
