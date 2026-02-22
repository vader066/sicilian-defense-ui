import { DatePicker } from '@/components/date-picker'
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
import { useAddPlayer, useUpdatePlayer } from '@/hooks/players'
import { cn } from '@/lib/utils'
import type { PLAYER } from '@/types/players'
import { type FormEvent, useState } from 'react'
import { FaChessKing, FaChessQueen } from 'react-icons/fa'

export function AddMember({
  player,
  clubId,
}: {
  player?: PLAYER
  clubId: string
}) {
  // This component is also used to edit an existing member's info when a player object is passed
  const { mutate: updatePlayer, isPending: isUpdating } =
    useUpdatePlayer(clubId)
  const { mutate: addPlayer, isPending: isAdding } = useAddPlayer(clubId)
  const [form, setForm] = useState<PLAYER>(
    player || {
      id: '',
      first_name: '',
      last_name: '',
      programme: '',
      username: '',
      date_of_birth: new Date().toLocaleDateString(),
      rating: 1400,
      sex: 'FEMALE',
      club_id: clubId,
    },
  )
  const [dob, setDob] = useState<Date | undefined>(new Date(form.date_of_birth))
  const [edit, setEdit] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (player) {
      const playerData: PLAYER = {
        id: player.id,
        first_name: form.first_name,
        last_name: form.last_name,
        programme: form.programme,
        username: form.username,
        date_of_birth: dob ? dob.toLocaleDateString() : '',
        rating: form.rating,
        sex: form.sex,
        club_id: player.club_id,
      }
      updatePlayer({ playerId: player.id, playerData })
    } else {
      addPlayer({
        ...form,
        rating: Number(form.rating),
        date_of_birth: dob ? dob.toLocaleDateString() : '',
      })
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
        <div className="flex gap-5 w-full">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="first_name" className="w-full">
              First Name
            </label>
            <input
              type="text"
              value={form.first_name}
              name="first_name"
              id="first_name"
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              className="border border-black/20 rounded-md p-2 w-full"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="last_name" className="w-full">
              Last Name
            </label>
            <input
              type="text"
              value={form.last_name}
              name="last_name"
              id="last_name"
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              className="border border-black/20 rounded-md p-2 w-full"
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
              className="border border-black/20 rounded-md p-2 w-full"
            />
          </div>
          <div className="flex w-full flex-col gap-2">
            <label htmlFor="sex">Sex</label>
            <Select
              value={form.sex}
              onValueChange={(value) =>
                setForm({ ...form, sex: (value as 'MALE') || 'FEMALE' })
              }
            >
              <SelectTrigger className="border flex border-black/20 rounded-md p-2">
                <SelectValue
                  id="sex"
                  placeholder="Select your sex"
                  className="contents"
                >
                  <div className="flex gap-3 items-center">
                    <span className="capitalize">{form.sex}</span>
                    {form.sex === 'FEMALE' && (
                      <FaChessQueen className="text-green-500" />
                    )}
                    {form.sex === 'MALE' && (
                      <FaChessKing className="text-green-500" />
                    )}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          <label htmlFor="dob">Date of Birth</label>
          <DatePicker date={dob} setDate={setDob} className="w-32 h-11" />
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
                className={cn('border border-black/20 rounded-md p-2 w-full', {
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
              disabled={isUpdating}
              className="bg-primary text-white"
            >
              {isUpdating ? <Spinner /> : 'Submit'}
            </Button>
          </DialogFooter>
        ) : (
          <button
            disabled={isAdding}
            type="submit"
            className={cn(
              'bg-black text-white p-3 px-20 mt-10 rounded-lg w-fit',
              {
                'opacity-30': isAdding,
              },
            )}
          >
            {isAdding ? <Spinner /> : 'Add Member'}
          </button>
        )}
      </section>
    </form>
  )
}
