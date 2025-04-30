import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/app/auth/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1>Auth Layout</h1>
      <Outlet />
    </div>
  )
}
