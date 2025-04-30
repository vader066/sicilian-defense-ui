import { createFileRoute } from '@tanstack/react-router'
import { Spinner } from '@/components/ui/spinner'
import { players } from '@/store/player-data'

import { useState } from 'react'

export const Route = createFileRoute('/app/dashboard/_layout/settings/')({
  component: Settings,
})

function Settings() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleClick() {
    setIsLoading(true)
    try {
      players.forEach(async (player) => {
        // await createPlayer(player);
        console.log(player)
      })
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Backend needs to do this (i.e Add players in bulk)

  // async function createPlayer(player: PLAYER) {
  // 	await databases.createDocument(db, playerCollection, uuidv1(), {
  // 		id: player.id,
  // 		name: player.name,
  // 		rating: player.rating,
  // 		clubs: "KNUST CHESS CLUB", //use the name of the users club
  // 	});
  // 	console.log("Player collection created");
  // }

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
