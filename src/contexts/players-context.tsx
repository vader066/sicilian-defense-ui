'use client'

import { type APPWRITE_PLAYERS, type PLAYER } from '@/types/database/models'
import { createContext, useContext, useEffect, useState } from 'react'

interface playercontextprops {
  players: PLAYER[]
  isLoading: boolean
  error: string | null
  setPlayers: React.Dispatch<React.SetStateAction<PLAYER[]>>
}

const PlayerData = createContext<playercontextprops | undefined>(undefined)

export function usePlayerData() {
  const context = useContext(PlayerData)
  if (!context) {
    throw new Error('usePlayerData must be used within an PlayerDataProvider')
  }
  return context
}

export function PlayerDataProvider({
  children,
}: {
  children?: React.ReactNode
}) {
  const [players, setPlayers] = useState<PLAYER[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    fetchPlayers()
  }, [])

  async function fetchPlayers() {
    try {
      const response = await fetch('http://localhost:5001/api/players', {
        headers: {
          'content-type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Could not fetch players')
      }
      const res: { data: APPWRITE_PLAYERS } = await response.json()
      setPlayers(res.data.documents)
    } catch (error) {
      console.error(error)
      setError('Could not fetch players')
    } finally {
      setIsLoading(false)
    }
  }
  const value = { players, isLoading, error, setPlayers }
  return <PlayerData.Provider value={value}>{children}</PlayerData.Provider>
}
