import { createFileRoute } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@radix-ui/react-toast'
import { useEffect, useState } from 'react'
import { AddMember, type ToastState } from './-components/add-member'
import { FaTimes } from 'react-icons/fa'
import { BiCheck } from 'react-icons/bi'
import { ExistingMember } from './-components/existing-members'

export const Route = createFileRoute(
  '/app/dashboard/_layout/home/manage-users/',
)({
  component: ManageUsers,
})

type Tabs = 'add-member' | 'existing-member' | 'edit-member-info'

function ManageUsers() {
  const [page, setPage] = useState<Tabs>('add-member')
  const [toastState, setToastState] = useState<ToastState>(undefined)
  const [isOpen, setIsOpen] = useState(false)
  const getToastState = (state: ToastState) => {
    setToastState(state)
  }
  useEffect(() => {
    if (toastState) {
      setIsOpen(true)
      setTimeout(() => {
        setIsOpen(false)
        setToastState(undefined)
      }, 5000)
    }
  }, [toastState])
  return (
    <ToastProvider swipeDirection="right" duration={5000}>
      <Toast
        open={isOpen}
        className="rounded-xl flex bg-white shadow-md border w-max border-black/5 overflow-clip data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
      >
        <div className="flex p-2 gap-5 min-w-max">
          <ToastClose
            onClick={() => {
              setIsOpen(false)
            }}
            className="flex size-6 items-center justify-center rounded-full bg-slate-400/10"
          >
            <FaTimes className="text-sm font-thin text-black/50" />
          </ToastClose>
          <div className="flex flex-col gap-2 text-sm justify-center">
            {toastState && toastState !== 'error' && (
              <ToastTitle className="text-green-500">Success</ToastTitle>
            )}
            {toastState === 'error' && (
              <ToastTitle className="text-red-500">Failed</ToastTitle>
            )}
            <ToastDescription className="text-sm text-nowrap">
              {toastState === 'added' && 'Player successfully created!'}
              {toastState === 'updated' && 'Player successfully updated!'}
              {toastState === 'deleted' && 'Player successfully deleted!'}
              {toastState === 'error' && 'Action Failed!'}
            </ToastDescription>
          </div>
          <div className="ml-auto h-full py-3 flex items-center">
            <span
              className={cn(
                'size-12 flex items-center justify-center rounded-full',
                {
                  'bg-green-200/20': toastState && toastState !== 'error',
                  'bg-red-200/20': toastState === 'error',
                },
              )}
            >
              {toastState && toastState !== 'error' && (
                <BiCheck className="text-green-400 text-3xl" />
              )}
              {toastState === 'error' && (
                <FaTimes className="text-red-400 text-3xl" />
              )}
            </span>
          </div>
        </div>
        <div
          className={cn('min-h-full w-[3%] text-transparent', {
            'bg-green-500': toastState && toastState !== 'error',
            'bg-red-500': toastState === 'error',
          })}
        >
          s
        </div>
      </Toast>
      <ToastViewport className="fixed top-[5%] right-0 h-max w-max" />
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
            {page === 'add-member' && (
              <AddMember sendToastState={getToastState} />
            )}
            {page === 'existing-member' && (
              <ExistingMember sendToastState={getToastState} />
            )}
            {page === 'edit-member-info' && <EditMemberinfo />}
          </div>
        </section>
      </div>
    </ToastProvider>
  )
}

function EditMemberinfo() {
  return (
    <div>
      <p className="text-2xl">Edit Member Info...</p>
    </div>
  )
}
