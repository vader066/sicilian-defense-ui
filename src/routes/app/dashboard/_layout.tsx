import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import SideBar from '@/components/sidebar'
import { PlayerDataProvider } from '@/contexts/players-context'

export const Route = createFileRoute('/app/dashboard/_layout')({
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/app/auth/sign-in' })
    }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div>
      <SideBar />
      <PlayerDataProvider>
        <main className="ml-20 p-3 pt-10 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
          <Outlet />
        </main>
      </PlayerDataProvider>
    </div>
  )
}
