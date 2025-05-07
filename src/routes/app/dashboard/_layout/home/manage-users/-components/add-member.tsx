import { toast } from '@/components/toast'
import { Button } from '@/components/ui/button'
import { DialogClose, DialogFooter } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import { localFetch } from '@/services/fetch'
import type { PLAYER, sex } from '@/types/database/models'
import { type FormEvent, useEffect, useState } from 'react'
import { FaChessKing, FaChessQueen } from 'react-icons/fa'

export function AddMember({ player }: { player?: PLAYER }) {
  const [isLoading, setIsLoading] = useState(false)
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState<PLAYER>({
    first_name: '',
    last_name: '',
    programme: '',
    username: '',
    dob: new Date(),
    rating: 1400,
    sex: undefined,
    club: 'KNUST CHESS CLUB',
  })

  // This component is also used to edit an existing member's info when a player object is passed
  useEffect(() => {
    if (player) {
      setForm({ ...player, dob: new Date(player.dob) })
    }
  }, [])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (player) {
        const playerData: PLAYER = {
          first_name: form.first_name,
          last_name: form.last_name,
          programme: form.programme,
          username: form.username,
          dob: form.dob,
          rating: form.rating,
          sex: form.sex,
          club: form.club,
        }
        console.log(playerData)
        // if player object is passed use the update player endpoint instead
        const response = await localFetch(`/players/${player.username}`, {
          method: 'PUT',
          body: JSON.stringify(playerData),
        })
        toast({
          title: 'Updated Successfully',
          description: 'The player was successfully updated',
          variant: 'success',
        })
        console.log(response)
      } else {
        const response = await localFetch('/players', {
          method: 'POST',
          body: JSON.stringify(form),
        })
        console.log(response)

        toast({
          title: 'Created Successfully',
          description: 'The player was successfully added to the database',
          variant: 'success',
        })
      }
    } catch (error: any) {
      console.log(error.message)
      toast({
        title: 'Error Occurred',
        description: error.message,
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="w-full flex flex-col gap-4" onSubmit={onSubmit}>
      {/* <form className="w-[50%] flex flex-col gap-4" onSubmit={onSubmit}> */}
      <div className="flex gap-6 min-h-max">
        <div className="size-32 rounded-full bg-green-300"></div>
        <div className="flex flex-col gap-2 min-h-full justify-center">
          <button className="text-white bg-black px-3 py-2 rounded-md text-sm">
            Change Avatar
          </button>
          <span className="text-black/50 text-xs">
            JPG, GIF or PNG. 1MB max
          </span>
        </div>
      </div>
      <section className="contents">
        <div className="flex gap-5">
          <div className="flex w-full flex-col gap-2">
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              value={form.first_name}
              name="first_name"
              id="first_name"
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              className="border border-black/20 rounded-md p-2"
            />
          </div>
          <div className="flex w-full flex-col gap-2">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              value={form.last_name}
              name="last_name"
              id="last_name"
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              className="border border-black/20 rounded-md p-2"
            />
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          <label htmlFor="programme">Programme of Study</label>
          <input
            type="text"
            value={form.programme}
            name="programme"
            id="programme"
            onChange={(e) => setForm({ ...form, programme: e.target.value })}
            className="border border-black/20 rounded-md p-2"
          />
        </div>
        <div className="flex gap-5">
          <div className="flex w-full flex-col gap-2">
            <label htmlFor="username">Lichess Username</label>
            <input
              type="text"
              value={form.username}
              name="username"
              id="username"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="border border-black/20 rounded-md p-2"
            />
          </div>
          <div className="flex w-full flex-col gap-2">
            <label htmlFor="sex">Sex</label>
            <Select
              value={form.sex}
              onValueChange={(value) => setForm({ ...form, sex: value as sex })}
            >
              <SelectTrigger className="border flex border-black/20 rounded-md p-2">
                <SelectValue
                  id="sex"
                  placeholder="Select your sex"
                  className="contents"
                >
                  <div className="flex gap-3 items-center">
                    <span className="capitalize">{form.sex}</span>
                    {form.sex === 'female' && (
                      <FaChessQueen className="text-green-500" />
                    )}
                    {form.sex === 'male' && (
                      <FaChessKing className="text-green-500" />
                    )}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          <label htmlFor="dob">Date of Birth</label>
          <input
            type="text"
            value={form.dob.toUTCString()}
            name="dob"
            id="dob"
            onChange={(e) =>
              setForm({ ...form, dob: new Date(e.target.value) })
            }
            className="border border-black/20 rounded-md p-2"
          />
        </div>
        <div className="flex w-full flex-col gap-3 items-center">
          <p className="text-black/50 text-xs text-center w-[50%] italic">
            KCC Rating for new users is 1400 by default
          </p>
          <div className="w-full flex gap-4 text-red-500 italic items-center">
            <input
              type="checkbox"
              name="edit"
              id="edit"
              checked={edit}
              onChange={() => {
                setEdit(!edit)
                if (edit) {
                  setForm({ ...form, rating: 1400 })
                }
              }}
            />
            <label htmlFor="edit" className="text-nowrap">
              Edit anyway
            </label>
            <div className="ml-5 w-full flex flex-col gap-2 text-black">
              <label htmlFor="rating">KCC Rating</label>
              <input
                type="number"
                name="rating"
                id="rating"
                disabled={!edit}
                value={form.rating}
                onChange={(e) =>
                  setForm({ ...form, rating: parseInt(e.target.value) })
                }
                className={cn('border border-black/20 rounded-md p-2', {
                  'text-black/50': !edit,
                })}
              />
            </div>
          </div>
        </div>
        {player ? (
          <DialogFooter className="mt-4 flex w-full flex-row items-center justify-between gap-4 border-t px-4 pt-3 sm:gap-20 sm:px-8">
            <DialogClose asChild>
              <Button variant="ghost" className="text-muted-foreground">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-white"
            >
              {isLoading ? <Spinner /> : 'Submit'}
            </Button>
          </DialogFooter>
        ) : (
          <button
            disabled={isLoading}
            type="submit"
            className={cn(
              'bg-black text-white p-3 px-20 mt-10 rounded-lg w-fit',
              {
                'opacity-30': isLoading,
              },
            )}
          >
            {isLoading ? <Spinner /> : 'Add Member'}
          </button>
        )}
      </section>
    </form>
  )
}
