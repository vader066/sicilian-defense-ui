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
import { type GAMES } from '@/types/database/models'
import { CreateAppWriteTourney } from '@/services/tournament-services/index'
import { Spinner } from '@/components/ui/spinner'
import { usePlayerData } from '@/contexts/players-context'
import { RiErrorWarningFill } from 'react-icons/ri'
import { localFetch } from '@/services/fetch'
import { toast } from '@/components/toast'
// import { players } from '@/store/player-data'

export const Route = createFileRoute(
  '/app/dashboard/_layout/home/add-offline-tourn/',
)({
  component: DynamicForm,
})

export type GameResultEntry = {
  gameId: string
  black: string
  white: string
  result: 'black' | 'white' | 'draw' | 'WF' | 'BF' | 'FF'
  date: Date
}

function DynamicForm() {
  //hooks
  const { players, isLoading, error } = usePlayerData()
  const [isSaving, setIsSaving] = useState(false)
  const [canRemove, setCanRemove] = useState(false)
  const [fields, setFields] = useState<Array<GameResultEntry>>([])
  const [tournamentName, setTournamentName] = useState('')
  const [games, setGames] = useState<GAMES[]>([])

  const getPlayerName = (username: string): string => {
    const player = players.find((p) => p.username === username)
    return `${player?.first_name ?? 'N/A'} ${player?.last_name ?? ''}`
  }

  //Initialization before render because selects can't be empty
  useEffect(() => {
    if (players && players.length > 0) {
      setFields([
        {
          gameId: uuidv4().slice(0, 19),
          white: players[0].username,
          black: players[2].username,
          result: 'black',
          date: new Date(),
        },
      ])
    }
  }, [players])

  useEffect(() => {
    const games: GAMES[] = fields.map((gameRes) => {
      let gameBase: GAMES = {
        gameId: gameRes.gameId,
        white: gameRes.white,
        black: gameRes.black,
        date: gameRes.date,
      }
      if (gameRes.result === 'white') {
        gameBase.winner = gameRes.white
      } else if (gameRes.result === 'black') {
        gameBase.winner = gameRes.black
      } else if (gameRes.result === 'BF') {
        gameBase.forfeit = 'BF'
      } else if (gameRes.result === 'WF') {
        gameBase.forfeit = 'WF'
      } else if (gameRes.result === 'FF') {
        gameBase.forfeit = 'FF'
      } else if (gameRes.result === 'draw') {
        gameBase.draw = true
      }

      return gameBase
    })

    setGames(games)
  }, [fields])

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
        gameId: uuidv4().slice(0, 19),
        white: players[0].username,
        black: players[2].username,
        result: 'black',
        date: new Date(),
      },
    ])
    setCanRemove(true)
  }

  const handleSelectChange = (value: string, name: string, index: number) => {
    const newFields = [...fields]
    if (name === 'white') {
      newFields[index].white = value
    } else if (name === 'black') {
      newFields[index].black = value
    } else if (name === 'result') {
      newFields[index].result = value as  //need to find a better way to do this using enums
        | 'black'
        | 'white'
        | 'draw'
        | 'WF'
        | 'BF'
        | 'FF'
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
    const payload = CreateAppWriteTourney({
      games: games,
      tournamentName: tournamentName,
    })
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
        description: 'The tournament could not be created',
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
      <div className="flex flex-col gap-2 mb-5">
        <label htmlFor="tournamentName" className="text-xl font-bold">
          Tournament Name
        </label>
        <input
          type="text"
          onChange={(e) => {
            setTournamentName(e.target.value)
          }}
          value={tournamentName}
          placeholder="Enter a name for this tournament"
          id="tournamentName"
          className="border border-black/20 rounded-md p-2 w-[50%]"
        />
      </div>
      {fields.map((field, index) => (
        <div className="flex gap-3" key={field.gameId}>
          <Select
            name="white"
            value={field.white}
            onValueChange={(value) => {
              handleSelectChange(value, 'white', index)
            }}
          >
            <SelectTrigger className="h-8 w-fit bg-white py-5">
              <SelectValue placeholder={field.white} />
            </SelectTrigger>
            <SelectContent side="bottom">
              {players.map((player, idx) => {
                return (
                  <SelectItem key={idx} value={player.username}>
                    <span>{`${player.first_name} ${player.last_name}`}</span>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          <Select
            name="black"
            value={field.black}
            onValueChange={(value) => {
              handleSelectChange(value, 'black', index)
            }}
          >
            <SelectTrigger className="h-8 w-fit bg-white py-5">
              <SelectValue placeholder={field.black} />
            </SelectTrigger>
            <SelectContent side="bottom">
              {players.map((player, idx) => {
                return (
                  <SelectItem key={idx} value={player.username}>
                    <span>{`${player.first_name} ${player.last_name}`}</span>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          <Select
            name="result"
            value={field.result}
            onValueChange={(value) => {
              handleSelectChange(value, 'result', index)
            }}
          >
            <SelectTrigger className="h-8 w-fit bg-white py-5">
              <SelectValue placeholder={field.result} />
            </SelectTrigger>
            <SelectContent side="bottom">
              <SelectItem value={'white'}>
                <span>{`${getPlayerName(field.white)} Win`}</span>
              </SelectItem>
              <SelectItem value={'black'}>
                <span>{`${getPlayerName(field.black)} Win`}</span>
              </SelectItem>
              <SelectItem value={'draw'}>
                <span>Draw</span>
              </SelectItem>
              <SelectItem value={'WF'}>
                <span>{`${getPlayerName(field.white)} Forfeit`}</span>
              </SelectItem>
              <SelectItem value={'BF'}>
                <span>{`${getPlayerName(field.black)} Forfeit`}</span>
              </SelectItem>
              <SelectItem value={'FF'}>
                <span>Double Forfeit</span>
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
