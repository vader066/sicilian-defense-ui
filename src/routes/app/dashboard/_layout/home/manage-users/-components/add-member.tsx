import { toast } from '@/components/toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import type { Member, sex } from '@/types/database/models'
import { type FormEvent, useState } from 'react'
import { FaChessKing, FaChessQueen } from 'react-icons/fa'

export function AddMember() {
  const [isLoading, setIsLoading] = useState(false)
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState<Member>({
    first_name: '',
    last_name: '',
    programme: '',
    username: '',
    dob: new Date(),
    rating: 1400,
    sex: undefined,
  })

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:5001/api/players', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(form),
      })
      if (!response.ok) {
        const error = await response.json()
        console.log(error.type)
        toast({
          title: 'Error Occurred',
          description: error.message,
          variant: 'error',
        })
        throw Error(error.message)
      }
      toast({
        title: 'Created Successfully',
        description: 'The player was successfully added to the database',
        variant: 'success',
      })
    } catch (error: any) {
      console.log(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="w-[50%] flex flex-col gap-4" onSubmit={onSubmit}>
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
            value={form.dob.toDateString()}
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
      </section>
    </form>
  )
}
