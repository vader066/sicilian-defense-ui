import { createFileRoute } from '@tanstack/react-router'
import { Spinner } from '@/components/ui/spinner'
import { players } from '@/store/player-data'

import { useState } from 'react'
import { localFetch } from '@/services/fetch'
import { toast } from '@/components/toast'

export const Route = createFileRoute('/app/dashboard/_layout/settings/')({
  component: Settings,
})

function Settings() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleClick() {
    try {
      setIsLoading(true)
      const response = await localFetch('/players/populate', {
        method: 'POST',
        body: JSON.stringify(players),
      })
      console.log(response)
      toast({
        title: 'Players added successfully',
        description: 'Players have been added to the database',
        variant: 'success',
      })
    } catch (error) {
      console.error('Error adding players:', error)
      toast({
        title: 'Error adding players',
        description: 'There was an error adding players to the database',
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col gap-4">
        <button
          disabled={isLoading}
          onClick={handleClick}
          className="bg-black rounded-md text-white p-3"
        >
          {!isLoading ? 'Add players to DB' : <Spinner />}
        </button>
      </div>
    </div>
  )
}

export default Settings
