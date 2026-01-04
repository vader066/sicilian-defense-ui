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
import { Spinner } from '@/components/ui/spinner'
import { RiErrorWarningFill } from 'react-icons/ri'
import { tournamentServices } from '@/services/tournament-services'
import { usePlayers } from '@/hooks/players'
import { useAddTournament } from '@/hooks/tournaments'
import type { GAME } from '@/types/games'
// import { players } from '@/store/player-data'

export const Route = createFileRoute(
  '/app/dashboard/_layout/home/add-offline-tourn/',
)({
  component: DynamicForm,
})

export type GameResultEntry = {
  game_id: string
  black: string // black player ID
  round: number
  black_rating: number // rating of black when game was played
  white: string // white player ID
  white_rating: number // rating of white when game was  played
  result: 'black' | 'white' | 'draw' | 'WF' | 'BF' | 'FF'
  played_at: string
}

function DynamicForm() {
  //hooks
  const { user } = Route.useRouteContext()
  const {
    data: players,
    isPending: isLoading,
    error,
  } = usePlayers(user.club_id)
  const { mutate: addTournament, isPending: isSaving } = useAddTournament(
    user.club_id,
  )

  const [canRemove, setCanRemove] = useState(false)
  const [maxRound, setMaxRound] = useState(1)
  const [fields, setFields] = useState<Array<GameResultEntry>>([])
  const [tournamentName, setTournamentName] = useState('')
  const [games, setGames] = useState<GAME[]>([])

  //Initialization before render because selects can't be empty
  useEffect(() => {
    if (players && players.length > 0) {
      const placeholderBlack = players[0]
      const placeholderWhite = players[2]
      setFields([
        {
          game_id: uuidv4(),
          white: placeholderWhite.id,
          round: maxRound,
          white_rating: placeholderWhite.rating,
          black: placeholderBlack.id,
          black_rating: placeholderBlack.rating,
          result: 'black',
          played_at: new Date().toISOString(),
        },
      ])
    }
  }, [players])

  useEffect(() => {
    const games: GAME[] = fields.map((gameRes) => {
      const { result, ...game } = gameRes

      let gameBase: GAME = {
        ...game,
        draw: false, // draw is fault by default
      }
      if (result === 'white') {
        gameBase.winner = gameRes.white
      } else if (result === 'black') {
        gameBase.winner = gameRes.black
      } else if (result === 'BF') {
        gameBase.forfeit = 'BF'
      } else if (result === 'WF') {
        gameBase.forfeit = 'WF'
      } else if (result === 'FF') {
        gameBase.forfeit = 'FF'
      } else if (result === 'draw') {
        gameBase.draw = true
      }

      return gameBase
    })

    setGames(games)
  }, [fields])

  if (isLoading || fields.length == 0) {
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

  const getPlayerName = (id: string): string => {
    const player = players!.find((p) => p.id === id)
    return `${player?.first_name ?? 'N/A'} ${player?.last_name ?? ''}`
  }

  const getUsername = (id: string): string => {
    const player = players!.find((p) => p.id === id)
    return player?.username || 'N/A'
  }

  const handleAddField = () => {
    const placeholderBlack = players[0]
    const placeholderWhite = players[2]
    setFields([
      ...fields,
      {
        game_id: uuidv4(),
        round: maxRound,
        white: placeholderWhite.id,
        white_rating: placeholderWhite.rating,
        black: placeholderBlack.id,
        black_rating: placeholderBlack.rating,
        result: 'black',
        played_at: new Date().toISOString(),
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
    } else if (name === 'round') {
      const fieldRound = newFields[index].round
      newFields[index].round = Number(value)
      if (newFields[index].round > maxRound) {
        setMaxRound(fieldRound)
      }
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
    console.log('Submitted Fields:', fields)
    const payload = tournamentServices.createDBTourneyReq({
      games: games,
      tournamentName: tournamentName,
    })
    addTournament(payload)
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
        <div className="flex gap-3" key={field.game_id}>
          <Select
            name="white"
            value={field.white}
            onValueChange={(value) => {
              handleSelectChange(value, 'white', index)
            }}
          >
            <SelectTrigger className="h-8 w-fit bg-white py-5">
              <SelectValue placeholder={getUsername(field.white)} />
            </SelectTrigger>
            <SelectContent side="bottom">
              {players.map((player, idx) => {
                return (
                  <SelectItem key={idx} value={player.id}>
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
              <SelectValue placeholder={getUsername(field.black)} />
            </SelectTrigger>
            <SelectContent side="bottom">
              {players.map((player, idx) => {
                return (
                  <SelectItem key={idx} value={player.id}>
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
          <Select
            name="result"
            value={field.result}
            onValueChange={(value) => {
              handleSelectChange(value, 'result', index)
            }}
          >
            <SelectTrigger className="h-8 w-fit bg-white py-5">
              <SelectValue placeholder={field.round} />
            </SelectTrigger>
            <SelectContent side="bottom">
              {Array(10).map((_, idx) => {
                const round = String(idx + 1)
                return (
                  <SelectItem value={round}>
                    <span>{round}</span>
                  </SelectItem>
                )
              })}
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
