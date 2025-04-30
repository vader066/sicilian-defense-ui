import { createFileRoute } from '@tanstack/react-router'
import { RecordNewTournament } from '@/services/lichess/record-tournament'
import { type TOURNAMENT } from '@/types/database/models'
import React, { useState } from 'react'
import { Spinner } from '@/components/ui/spinner'

export const Route = createFileRoute(
  '/app/dashboard/_layout/home/add-online-tourn/',
)({
  component: Page,
})
;('use client')

function Page() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingb, setIsLoadingb] = useState(false)
  const [tournamentId, setTournamentId] = useState('LicKZkxi')
  const [data, setData] = useState<TOURNAMENT | undefined>(undefined)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setTournamentId(e.target.value)
  }

  const handleClick = async (e: any) => {
    e.preventDefault()
    setIsLoadingb(true)
    try {
      const response = await fetch('/api/db/add-tournament', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          tournament: data,
        }),
      })
      if (!response.ok) {
        throw new Error('Could not add tournament')
      }
      const res = await response.json()
      console.log(res)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoadingb(false)
    }
  }

  // can't use async with React.ChangeEvent<HTMLInputElement>
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const process_data = await RecordNewTournament(tournamentId)
      setData(process_data)
      console.log(process_data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="w-full h-dvh flex flex-col items-center justify-center gap-5"
      >
        <input
          type="text"
          value={tournamentId}
          onChange={handleChange}
          id=""
          placeholder="Tournament ID"
          className="p-2 focus:outline-none focus:border-gray-400 border border-gray-600 rounded-md"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-2 bg-black text-white rounded-md ${
            isLoading ? 'opacity-70' : ''
          }`}
        >
          {isLoading ? <Spinner /> : 'Fetch Lichess Tournament'}
        </button>
        <button
          onClick={handleClick}
          disabled={isLoadingb}
          className={`px-6 py-2 bg-black text-white rounded-md ${
            isLoadingb ? 'opacity-70' : ''
          }`}
        >
          {isLoadingb ? <Spinner /> : 'Add To db'}
        </button>
      </form>
    </div>
  )
}
