import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import SideBar from '@/components/sidebar'
import { PlayerDataProvider } from '@/contexts/players-context'
import { useAuth } from '@/hooks/auth'
import { Spinner } from '@/components/ui/spinner'

export const Route = createFileRoute('/app/dashboard/_layout')({
  component: DashboardLayout,
})

function DashboardLayout() {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="h-dvh w-screen flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!user) {
    redirect({ to: '/app/auth/sign-in' })
  }

  return (
    <div>
      <SideBar />
      <PlayerDataProvider>
        <main className="ml-20 p-3 pt-10 bg-gradient-to-br from-slate-50 to-slate-100">
          <Outlet />
        </main>
      </PlayerDataProvider>
    </div>
  )
}
