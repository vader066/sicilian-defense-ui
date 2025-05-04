import { createFileRoute } from '@tanstack/react-router'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { BiSave } from 'react-icons/bi'
import { BsPlusCircleDotted } from 'react-icons/bs'
import { FaTimesCircle } from 'react-icons/fa'
import { type GAME_TABLE_FORM } from '@/types/database/models'
import { CreateAppWriteTourney } from '@/services/calc/create-offline-tourn'
import { Spinner } from '@/components/ui/spinner'
import { usePlayerData } from '@/contexts/players-context'
import { RiErrorWarningFill } from 'react-icons/ri'
import { localFetch } from '@/services/fetch'
import { toast } from '@/components/toast'

export const Route = createFileRoute(
  '/app/dashboard/_layout/home/add-offline-tourn/',
)({
  component: DynamicForm,
})

function DynamicForm() {
  //hooks
  const { players, isLoading, error } = usePlayerData()
  const [isSaving, setIsSaving] = useState(false)
  const [canRemove, setCanRemove] = useState(false)
  const [fields, setFields] = useState<Array<GAME_TABLE_FORM>>([])

  //Initialization before render because selects can't be empty
  useEffect(() => {
    if (players && players.length > 0) {
      setFields([
        {
          id: uuidv4(),
          value: {
            white: players[0].name,
            black: players[2].name,
            winner: players[2].name,
          },
        },
      ])
    }
  }, [players])
  if (isLoading && fields.length == 0) {
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center">
        <RiErrorWarningFill size={50} color="red" />
        <p>Could not fetch players from database</p>
      </div>
    )
  }

  const handleAddField = () => {
    setFields([
      ...fields,
      {
        id: uuidv4(),
        value: {
          white: players[0].name,
          black: players[2].name,
          winner: players[2].name,
        },
      },
    ])
    setCanRemove(true)
  }

  const handleSelectChange = (value: string, name: string, index: number) => {
    const newFields = [...fields]
    if (name === 'white') {
      newFields[index].value.white = value
    } else if (name === 'black') {
      newFields[index].value.black = value
    } else if (name === 'winner') {
      newFields[index].value.winner = value
    }
    setFields(newFields) // Update state for the specific field
  }

  const handleRemoveField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index)
    setFields(newFields) // Remove the specific field
    if (fields.length <= 2) {
      setCanRemove(false)
    }
  }

  const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setIsSaving(true)
    console.log('Submitted Fields:', fields)
    const payload = CreateAppWriteTourney(fields)
    try {
      const response = await localFetch('/tournaments', {
        method: 'POST',
        body: JSON.stringify({ tournament: payload }),
      })
      if (response.status !== 201) {
        throw new Error('Could not create tournament')
      }
      toast({
        title: 'Created successfully',
        description: 'The tournament was created successfully',
        variant: 'success',
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Could not create',
        description: 'The tournament could not created',
        variant: 'error',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form
      onSubmit={(event: any) => handleSubmit(event)}
      className="flex flex-col gap-3"
    >
      {fields.map((field, index) => (
        <div className="flex gap-3" key={field.id}>
          <Select
            name="white"
            value={field.value.white}
            onValueChange={(value) => {
              handleSelectChange(value, 'white', index)
            }}
          >
            <SelectTrigger className="h-8 w-fit bg-white py-5">
              <SelectValue placeholder={field.value.white} />
            </SelectTrigger>
            <SelectContent side="bottom">
              {players.map((player) => {
                return (
                  <SelectItem key={player.name} value={player.name}>
                    <span>{player.name}</span>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          <Select
            name="black"
            value={field.value.black}
            onValueChange={(value) => {
              handleSelectChange(value, 'black', index)
            }}
          >
            <SelectTrigger className="h-8 w-fit bg-white py-5">
              <SelectValue placeholder={field.value.black} />
            </SelectTrigger>
            <SelectContent side="bottom">
              {players.map((player) => {
                return (
                  <SelectItem key={player.name} value={player.name}>
                    <span>{player.name}</span>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          <Select
            name="winner"
            value={field.value.winner}
            onValueChange={(value) => {
              handleSelectChange(value, 'winner', index)
            }}
          >
            <SelectTrigger className="h-8 w-fit bg-white py-5">
              <SelectValue placeholder={field.value.winner} />
            </SelectTrigger>
            <SelectContent side="bottom">
              <SelectItem value={field.value.white}>
                <span>{field.value.white}</span>
              </SelectItem>
              <SelectItem value={field.value.black}>
                <span>{field.value.black}</span>
              </SelectItem>
            </SelectContent>
          </Select>
          <button
            type="button"
            onClick={() => handleRemoveField(index)}
            disabled={!canRemove}
            className={cn(
              'bg-red-500 text-white p-3 rounded-md flex gap-3 items-center justify-center',
              `${!canRemove ? 'opacity-35' : ' '}`,
            )}
          >
            <FaTimesCircle size={20} color="white" />
            <span>Remove</span>
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddField}
        className="bg-black/10 text-black p-3 rounded-md flex gap-3 items-center justify-center"
      >
        <BsPlusCircleDotted size={20} color="black" />
        <span>Add Game</span>
      </button>
      <button
        disabled={isSaving}
        type="submit"
        className={cn(
          'bg-green-600 text-white p-3 rounded-md flex gap-3 items-center justify-center',
          `${isSaving ? 'opacity-40' : ''}`,
        )}
      >
        {isSaving ? (
          <Spinner />
        ) : (
          <div className="contents">
            <BiSave size={20} />
            <span>Save tournament</span>
          </div>
        )}
      </button>
    </form>
  )
}
