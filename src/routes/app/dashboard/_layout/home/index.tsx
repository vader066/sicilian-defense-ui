import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/app/dashboard/_layout/home/')({
  component: Home,
})

function Home() {
  return (
    <div className="flex h-dvh w-full items-center justify-center bg-red-500">
      <div className="flex gap-4">
        <Link
          to="/app/dashboard/home/add-offline-tourn"
          className="p-3 bg-black text-white rounded-md"
        >
          Add Offline Tournament
        </Link>
        <Link
          to="/app/dashboard/home/add-online-tourn"
          className="p-3 bg-black text-white rounded-md"
        >
          Add Online Tournament
        </Link>
        <Link
          to="/app/dashboard/home/manage-users"
          className="p-3 bg-black text-white rounded-md"
        >
          Manage users
        </Link>
      </div>
    </div>
  )
}
